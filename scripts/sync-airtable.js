/**
 * Airtable → Expert Directory Sync
 *
 * Syncs expert data from Airtable to the website, scrapes GHL directory
 * for additional data, and generates HTML profile pages.
 *
 * Usage:
 *   AIRTABLE_API_KEY=pat... node scripts/sync-airtable.js
 *   node scripts/sync-airtable.js --dry-run
 *
 * Environment Variables:
 *   AIRTABLE_API_KEY - Your Airtable Personal Access Token
 *   AIRTABLE_BASE_ID - Base ID (default: appK4eoFrLRthiENZ)
 *   AIRTABLE_TABLE_ID - Table ID (default: tbldVnfJ0SBfo0hiK)
 */

const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');
const https = require('https');

// Configuration
const CONFIG = {
    AIRTABLE_BASE_ID: process.env.AIRTABLE_BASE_ID || 'appK4eoFrLRthiENZ',
    AIRTABLE_TABLE_ID: process.env.AIRTABLE_TABLE_ID || 'tbldVnfJ0SBfo0hiK',
    EXPERTS_DATA_PATH: path.join(__dirname, '../experts/experts-data.json'),
    EXPERTS_DIR: path.join(__dirname, '../experts'),
    DRY_RUN: process.argv.includes('--dry-run'),
    SCRAPE_DELAY_MS: 2000,
};

// Airtable field mapping (Airtable column → internal field)
const FIELD_MAP = {
    'Lead Name': 'name',
    'CRM Type': 'crm',
    'Website or Profile Link': 'ghlDirectoryUrl',
    'Email': 'email',
    'Fathom Link': 'fathomLink',
    'Core Services': 'coreServices',
    'Prices': 'pricing',
    'Target Clients': 'targetClients',
    'Booking link': 'bookingLink',
};

/**
 * Fetch a single page of records from Airtable API
 */
function fetchAirtablePage(apiKey, offset = null) {
    const baseId = CONFIG.AIRTABLE_BASE_ID;
    const tableId = CONFIG.AIRTABLE_TABLE_ID;

    return new Promise((resolve, reject) => {
        let path = `/v0/${baseId}/${tableId}?pageSize=100`;
        if (offset) {
            path += `&offset=${encodeURIComponent(offset)}`;
        }

        const options = {
            hostname: 'api.airtable.com',
            path,
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${apiKey}`,
                'Content-Type': 'application/json',
            },
        };

        const req = https.request(options, (res) => {
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => {
                if (res.statusCode === 200) {
                    resolve(JSON.parse(data));
                } else {
                    reject(new Error(`Airtable API error ${res.statusCode}: ${data}`));
                }
            });
        });

        req.on('error', reject);
        req.end();
    });
}

/**
 * Fetch ALL records from Airtable API (handles pagination for 100+ records)
 */
async function fetchAirtableRecords(apiKey) {
    const allRecords = [];
    let offset = null;
    let page = 1;

    do {
        console.log(`   Fetching page ${page}...`);
        const response = await fetchAirtablePage(apiKey, offset);
        allRecords.push(...(response.records || []));
        offset = response.offset; // Will be undefined if no more pages
        page++;
    } while (offset);

    return { records: allRecords };
}

/**
 * Extract GHL directory URL from profile link field
 */
function extractGHLUrl(profileLink) {
    if (!profileLink) return null;

    // Handle multiple URLs separated by space
    const urls = profileLink.split(/\s+/);

    for (const url of urls) {
        if (url.includes('directory.gohighlevel.com')) {
            return url.trim();
        }
    }

    return null;
}

/**
 * Extract location from GHL directory URL
 * URLs like: /united-states/san-mateo/certified-admins/name or /australia/sydney/certified-admins/name
 */
function extractLocationFromGHLUrl(ghlUrl) {
    if (!ghlUrl) return 'International';

    // Known country mappings (URL path → Display name)
    const countryMap = {
        'united-states': 'United States',
        'united-kingdom': 'United Kingdom',
        'australia': 'Australia',
        'canada': 'Canada',
        'philippines': 'Philippines',
        'pakistan': 'Pakistan',
        'india': 'India',
        'germany': 'Germany',
        'ireland': 'Ireland',
        'italy': 'Italy',
        'greece': 'Greece',
        'portugal': 'Portugal',
        'new-zealand': 'New Zealand',
        'united-arab-emirates': 'UAE',
        'dubai': 'UAE',
        'cameroon': 'Cameroon',
        'venezuela': 'Venezuela',
        'chile': 'Chile',
        'ecuador': 'Ecuador',
    };

    try {
        const url = new URL(ghlUrl);
        const pathParts = url.pathname.split('/').filter(p => p && p !== 'certified-admins' && p !== 'ghl');

        // Check if first part is a known country
        if (pathParts.length > 0) {
            const firstPart = pathParts[0].toLowerCase();
            if (countryMap[firstPart]) {
                return countryMap[firstPart];
            }
            // If it's a city name (not in country map), try to identify common patterns
            // Some URLs are like /doylestown/certified-admins/name (US city without country)
        }

        return 'International';
    } catch (e) {
        return 'International';
    }
}

/**
 * Generate URL slug from name
 */
function generateSlug(name) {
    return name
        .trim()                        // Remove leading/trailing whitespace first
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')           // Collapse multiple dashes
        .replace(/^-|-$/g, '');        // Remove leading/trailing dashes
}

/**
 * Scrape GHL directory profile for ratings and certifications
 */
async function scrapeGHLProfile(browser, url) {
    if (!url) return null;

    const page = await browser.newPage();

    try {
        await page.setUserAgent('Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36');
        await page.goto(url, { waitUntil: 'networkidle2', timeout: 30000 });

        const data = await page.evaluate(() => {
            // Extract rating from stars or text
            let rating = 5.0;
            let reviewCount = 0;
            const certifications = [];
            let location = null;

            // Look for rating display (varies by page structure)
            const ratingElements = document.querySelectorAll('[class*="rating"], [class*="star"], [class*="review"]');
            ratingElements.forEach(el => {
                const text = el.textContent || '';
                // Match patterns like "5.0" or "4.9 (23 reviews)"
                const ratingMatch = text.match(/(\d+\.?\d*)\s*(?:stars?|★)?/i);
                const reviewMatch = text.match(/\((\d+)\s*reviews?\)/i) || text.match(/(\d+)\s*reviews?/i);

                if (ratingMatch && parseFloat(ratingMatch[1]) <= 5) {
                    rating = parseFloat(ratingMatch[1]);
                }
                if (reviewMatch) {
                    reviewCount = parseInt(reviewMatch[1]);
                }
            });

            // Look for certification badges
            const badgeElements = document.querySelectorAll('[class*="badge"], [class*="cert"], [class*="skill"], .tag, .chip');
            badgeElements.forEach(el => {
                const text = el.textContent.trim();
                if (text && text.length > 2 && text.length < 50) {
                    // Common GHL certifications
                    const certKeywords = ['Certified', 'Admin', 'HIPAA', 'A2P', 'AI', 'Funnel', 'Course', 'SaaS', 'WhatsApp', 'Paid Ads', 'Social Media', 'Quick Wins', 'Voice'];
                    if (certKeywords.some(kw => text.includes(kw))) {
                        certifications.push(text);
                    }
                }
            });

            // Look for location
            const locationElements = document.querySelectorAll('[class*="location"], [class*="address"], [class*="city"]');
            locationElements.forEach(el => {
                const text = el.textContent.trim();
                if (text && text.length > 2 && text.length < 100 && !location) {
                    location = text;
                }
            });

            return { rating, reviewCount, certifications: [...new Set(certifications)], location };
        });

        await page.close();
        return data;

    } catch (error) {
        console.error(`  Error scraping ${url}:`, error.message);
        await page.close();
        return null;
    }
}

/**
 * Parse pricing info to extract minimum price
 */
function parsePriceMin(pricingText) {
    if (!pricingText) return null;

    // Look for dollar amounts
    const matches = pricingText.match(/\$[\d,]+/g);
    if (!matches) return null;

    // Parse all amounts and find minimum
    const amounts = matches.map(m => parseInt(m.replace(/[$,]/g, '')));
    return Math.min(...amounts);
}

/**
 * Determine budget tier from price
 */
function getBudgetTier(priceMin) {
    if (!priceMin) return 'mid';
    if (priceMin < 100) return 'low';
    if (priceMin < 500) return 'mid';
    return 'high';
}

/**
 * Extract specialty keywords from services text
 */
function extractSpecialty(servicesText) {
    if (!servicesText) return 'automation';

    const text = servicesText.toLowerCase();
    const specialties = [];

    if (text.includes('full') && (text.includes('build') || text.includes('stack'))) specialties.push('full-builds');
    if (text.includes('funnel')) specialties.push('funnels');
    if (text.includes('automation') || text.includes('workflow')) specialties.push('automation');
    if (text.includes('voice ai') || text.includes('ai voice') || text.includes('voice agent')) specialties.push('ai-voice');
    if (text.includes('api') || text.includes('integration')) specialties.push('integrations');

    return specialties.length > 0 ? specialties.join(' ') : 'automation';
}

/**
 * Extract industries from target clients text
 */
function extractIndustries(targetClientsText) {
    if (!targetClientsText) return ['agency', 'local-service'];

    const text = targetClientsText.toLowerCase();
    const industries = [];

    if (text.includes('agenc')) industries.push('agency');
    if (text.includes('coach') || text.includes('consult')) industries.push('coach');
    if (text.includes('real estate') || text.includes('realtor')) industries.push('real-estate');
    if (text.includes('local') || text.includes('service') || text.includes('home')) industries.push('local-service');
    if (text.includes('ecommerce') || text.includes('e-commerce')) industries.push('ecommerce');
    if (text.includes('health') || text.includes('medical') || text.includes('dental')) industries.push('healthcare');
    if (text.includes('saas')) industries.push('saas');

    return industries.length > 0 ? industries : ['agency', 'local-service'];
}

/**
 * Transform Airtable record to expert data format
 */
function transformAirtableRecord(record, scrapedData) {
    const fields = record.fields;
    const name = fields['Lead Name'];
    const slug = generateSlug(name);
    const ghlUrl = extractGHLUrl(fields['Website or Profile Link']);
    const priceMin = parsePriceMin(fields['Prices']);
    const crmType = (fields['CRM Type'] || 'GHL').toLowerCase();

    return {
        slug,
        data: {
            name,
            ghlDirectoryUrl: ghlUrl,
            rating: scrapedData?.rating || 5.0,
            reviewCount: scrapedData?.reviewCount || 0,
            certifications: scrapedData?.certifications?.length > 0
                ? scrapedData.certifications
                : ['Certified Admin'],
            claimed: true,
            priceMin: priceMin || 100,
            featured: false,
            specialty: extractSpecialty(fields['Core Services']),
            location: extractLocationFromGHLUrl(ghlUrl),
            budgetTier: getBudgetTier(priceMin),
            industries: extractIndustries(fields['Target Clients']),
            crm: [crmType === 'ghl' ? 'gohighlevel' : crmType],
            // Extended data from Airtable
            email: fields['Email']?.trim(),
            fathomLink: fields['Fathom Link']?.trim(),
            coreServices: fields['Core Services'],
            pricingDetails: fields['Prices'],
            targetClients: fields['Target Clients'],
            bookingLink: fields['Booking link']?.trim(),
        },
    };
}

/**
 * Generate HTML page for an expert
 */
function generateExpertHTML(expert) {
    const { name, ghlDirectoryUrl, rating, reviewCount, certifications,
            priceMin, specialty, location, coreServices, pricingDetails,
            targetClients, bookingLink, fathomLink } = expert;

    const slug = generateSlug(name);
    const initials = name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
    const specialtyDisplay = specialty.split(' ').map(s =>
        s.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())
    ).join(' • ');

    // Parse services into list items
    const servicesList = (coreServices || '')
        .split('\n')
        .filter(line => line.trim())
        .slice(0, 8)
        .map(service => `<li>${service.replace(/^[-•*]\s*/, '').trim()}</li>`)
        .join('\n                    ');

    // Parse target clients into tags
    const clientTags = (targetClients || 'Agencies, Business Owners')
        .split(/[,\n]/)
        .filter(c => c.trim())
        .slice(0, 6)
        .map(client => `<span class="best-for-tag">${client.trim()}</span>`)
        .join('\n                    ');

    const priceDisplay = priceMin ? `$${priceMin.toLocaleString()}+` : 'Contact for pricing';
    const bookingUrl = bookingLink || '#';
    const firstName = name.split(' ')[0];

    // Video section - YouTube embed, clickable link for others, or hidden if empty
    let videoSection = '';
    if (fathomLink) {
        // Check if it's a YouTube URL
        const youtubeMatch = fathomLink.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/);

        if (youtubeMatch) {
            // YouTube - embed it
            const videoId = youtubeMatch[1];
            videoSection = `
        <section class="video-section">
            <h2 class="section-title">
                <svg viewBox="0 0 24 24" fill="none" stroke="var(--color-ios-purple)" stroke-width="2">
                    <polygon points="23 7 16 12 23 17 23 7"></polygon>
                    <rect x="1" y="5" width="15" height="14" rx="2" ry="2"></rect>
                </svg>
                Expert Spotlight
            </h2>
            <div class="video-container">
                <iframe src="https://www.youtube.com/embed/${videoId}" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
            </div>
            <p class="video-caption">Watch ${firstName}'s expert spotlight interview</p>
        </section>`;
        } else {
            // Other URL - show clickable card
            videoSection = `
        <section class="video-section">
            <h2 class="section-title">
                <svg viewBox="0 0 24 24" fill="none" stroke="var(--color-ios-purple)" stroke-width="2">
                    <polygon points="23 7 16 12 23 17 23 7"></polygon>
                    <rect x="1" y="5" width="15" height="14" rx="2" ry="2"></rect>
                </svg>
                Expert Spotlight
            </h2>
            <a href="${fathomLink}" target="_blank" rel="noopener" style="display: flex; align-items: center; gap: 20px; padding: 24px; background: linear-gradient(135deg, rgba(94, 92, 230, 0.08) 0%, rgba(0, 113, 227, 0.08) 100%); border-radius: 16px; text-decoration: none; color: inherit; border: 1px solid rgba(94, 92, 230, 0.15); transition: all 0.3s ease;">
                <div style="width: 64px; height: 64px; background: var(--gradient-primary); border-radius: 16px; display: flex; align-items: center; justify-content: center; flex-shrink: 0;">
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="white" stroke="none">
                        <polygon points="5 3 19 12 5 21 5 3"></polygon>
                    </svg>
                </div>
                <div style="flex: 1;">
                    <div style="font-weight: 600; font-size: 17px; margin-bottom: 4px;">Watch ${firstName}'s Expert Interview</div>
                    <div style="color: var(--color-text-secondary); font-size: 14px;">See how ${firstName} approaches GHL projects and learn about their process</div>
                </div>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--color-ios-purple)" stroke-width="2" style="flex-shrink: 0;">
                    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                    <polyline points="15 3 21 3 21 9"></polyline>
                    <line x1="10" y1="14" x2="21" y2="3"></line>
                </svg>
            </a>
        </section>`;
        }
    }
    // If no video link, videoSection stays empty (section won't appear)

    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">

    <!-- Primary Meta Tags -->
    <title>${name} - GoHighLevel Expert | FlightSuite Verified Pro</title>
    <meta name="title" content="${name} - GoHighLevel Expert | FlightSuite Verified Pro">
    <meta name="description" content="${name} is a FlightSuite Verified Pro specializing in ${specialtyDisplay}. ${priceDisplay}. Connect for GHL builds, automations, and more.">
    <meta name="keywords" content="${name}, GoHighLevel expert, GHL consultant, ${specialty.replace(/-/g, ' ')}, CRM setup, marketing automation">
    <meta name="author" content="FlightSuite">
    <meta name="robots" content="index, follow">
    <link rel="canonical" href="https://flightsuite.ai/experts/${slug}">

    <!-- Open Graph -->
    <meta property="og:type" content="profile">
    <meta property="og:url" content="https://flightsuite.ai/experts/${slug}">
    <meta property="og:title" content="${name} - GoHighLevel Expert | FlightSuite Verified Pro">
    <meta property="og:description" content="FlightSuite Verified Pro specializing in ${specialtyDisplay}. ${priceDisplay}.">
    <meta property="og:image" content="https://flightsuite.ai/Assets/social-preview.png">

    <!-- Favicon -->
    <link rel="icon" type="image/svg+xml" href="/Assets/Flight Suite Favicon vPurple.svg">
    <link rel="apple-touch-icon" href="/Assets/Flight Suite Favicon vPurple.svg">

    <!-- BreadcrumbList Schema -->
    <script type="application/ld+json">
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "itemListElement": [
        { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://flightsuite.ai" },
        { "@type": "ListItem", "position": 2, "name": "Experts", "item": "https://flightsuite.ai/experts" },
        { "@type": "ListItem", "position": 3, "name": "${name}", "item": "https://flightsuite.ai/experts/${slug}" }
      ]
    }
    </script>

    <!-- ProfessionalService Schema -->
    <script type="application/ld+json">
    {
      "@context": "https://schema.org",
      "@type": "ProfessionalService",
      "name": "${name} - GoHighLevel Expert",
      "description": "FlightSuite Verified Pro specializing in ${specialtyDisplay}.",
      "url": "https://flightsuite.ai/experts/${slug}",
      "priceRange": "${priceDisplay}",
      "areaServed": "${location}",
      "aggregateRating": {
        "@type": "AggregateRating",
        "ratingValue": "${rating}",
        "reviewCount": "${reviewCount}"
      }
    }
    </script>

    <style>
        :root {
            --color-apple-blue: #0071E3;
            --color-ios-purple: #5E5CE6;
            --color-success: #34C759;
            --color-warning: #FF9F0A;
            --color-error: #FF3B30;
            --color-text-primary: #1D1D1F;
            --color-text-secondary: #6E6E73;
            --color-text-tertiary: #86868B;
            --color-bg-primary: #FFFFFF;
            --color-bg-secondary: #F5F5F7;
            --color-border: #D2D2D7;
            --color-border-light: #E8E8ED;
            --gradient-primary: linear-gradient(135deg, var(--color-ios-purple) 0%, var(--color-apple-blue) 100%);
            --gradient-success: linear-gradient(135deg, #34C759 0%, #30D158 100%);
            --font-display: -apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Roboto, sans-serif;
            --font-body: -apple-system, BlinkMacSystemFont, "SF Pro Text", "Segoe UI", Roboto, sans-serif;
            --ease-smooth: cubic-bezier(0.25, 0.46, 0.45, 0.94);
            --ease-spring: cubic-bezier(0.34, 1.56, 0.64, 1);
            --section-spacing: clamp(40px, 6vw, 80px);
            --container-padding: clamp(20px, 5vw, 40px);
        }

        * { margin: 0; padding: 0; box-sizing: border-box; }
        html { scroll-behavior: smooth; -webkit-font-smoothing: antialiased; }
        body {
            font-family: var(--font-body);
            color: var(--color-text-primary);
            background: var(--color-bg-primary);
            font-size: clamp(15px, 1.5vw, 17px);
            line-height: 1.47059;
            min-height: 100vh;
        }

        .animated-bg {
            position: fixed; inset: 0; z-index: -1;
            background: linear-gradient(135deg, #FFFFFF 0%, #F5F5F7 50%, #FFFFFF 100%);
        }
        .gradient-orb {
            position: absolute; border-radius: 50%; filter: blur(80px); opacity: 0.6;
            animation: float 20s ease-in-out infinite;
        }
        .gradient-orb:nth-child(1) {
            width: min(600px, 50vw); height: min(600px, 50vw);
            background: radial-gradient(circle, rgba(94, 92, 230, 0.15) 0%, transparent 70%);
            top: -200px; left: -200px;
        }
        .gradient-orb:nth-child(2) {
            width: min(500px, 40vw); height: min(500px, 40vw);
            background: radial-gradient(circle, rgba(52, 199, 89, 0.1) 0%, transparent 70%);
            top: 30%; right: -150px; animation-delay: -10s;
        }
        @keyframes float {
            0%, 100% { transform: translate(0, 0) scale(1); }
            33% { transform: translate(50px, -50px) scale(1.1); }
            66% { transform: translate(-30px, 30px) scale(0.9); }
        }

        .header {
            position: fixed; top: 0; left: 0; right: 0; z-index: 1000;
            background: rgba(255, 255, 255, 0.72);
            backdrop-filter: saturate(180%) blur(20px);
            border-bottom: 1px solid rgba(0, 0, 0, 0.08);
        }
        .header-inner {
            max-width: 1440px; margin: 0 auto; padding: 0 var(--container-padding);
            height: clamp(48px, 8vw, 52px);
            display: flex; align-items: center; justify-content: space-between;
        }
        .logo-text {
            font-family: var(--font-display); font-size: clamp(20px, 3vw, 24px); font-weight: 700;
            text-decoration: none;
            background: var(--gradient-primary); -webkit-background-clip: text; -webkit-text-fill-color: transparent;
        }
        .header-nav { display: flex; align-items: center; gap: clamp(16px, 3vw, 32px); }
        .nav-link {
            color: var(--color-text-primary); text-decoration: none;
            font-size: clamp(13px, 1.5vw, 14px); transition: opacity 0.2s;
        }
        .nav-link:hover { opacity: 0.6; }
        .cta-header {
            background: var(--color-apple-blue); color: white; border: none;
            padding: clamp(6px, 1vw, 8px) clamp(12px, 2vw, 16px); border-radius: 980px;
            font-size: clamp(13px, 1.5vw, 14px); text-decoration: none;
            transition: background 0.3s;
        }
        .cta-header:hover { background: #0077ED; }

        .breadcrumbs { padding: clamp(80px, 12vw, 100px) var(--container-padding) 0; max-width: 900px; margin: 0 auto; }
        .breadcrumbs-list {
            display: flex; align-items: center; gap: 8px; list-style: none;
            font-size: clamp(12px, 1.4vw, 14px); color: var(--color-text-tertiary);
        }
        .breadcrumbs-list a { color: var(--color-text-secondary); text-decoration: none; }
        .breadcrumbs-list a:hover { color: var(--color-apple-blue); }

        .main-content {
            max-width: 900px; margin: 0 auto;
            padding: clamp(24px, 4vw, 32px) var(--container-padding) var(--section-spacing);
        }

        .profile-hero {
            background: linear-gradient(135deg, rgba(94, 92, 230, 0.06) 0%, rgba(52, 199, 89, 0.06) 100%);
            border-radius: 24px; padding: clamp(32px, 5vw, 48px);
            margin-bottom: clamp(32px, 5vw, 48px); position: relative;
        }
        .profile-hero::before {
            content: ''; position: absolute; top: 0; left: 0; right: 0; height: 4px;
            background: var(--gradient-success);
        }
        .back-link {
            display: inline-flex; align-items: center; gap: 6px;
            font-size: clamp(13px, 1.5vw, 14px); color: var(--color-text-secondary);
            text-decoration: none; margin-bottom: 24px;
        }
        .back-link:hover { color: var(--color-apple-blue); }
        .profile-header {
            display: flex; gap: clamp(20px, 4vw, 32px); align-items: flex-start; margin-bottom: 24px;
        }
        .profile-photo {
            width: clamp(100px, 15vw, 120px); height: clamp(100px, 15vw, 120px);
            border-radius: 24px; background: var(--gradient-primary);
            display: flex; align-items: center; justify-content: center;
            color: white; font-size: clamp(36px, 6vw, 48px); font-weight: 700;
            box-shadow: 0 8px 32px rgba(94, 92, 230, 0.2);
        }
        .profile-info { flex: 1; }
        .verified-badge {
            display: inline-flex; align-items: center; gap: 6px;
            padding: 6px 12px; background: rgba(52, 199, 89, 0.1);
            border-radius: 980px; font-size: 12px; font-weight: 600;
            color: var(--color-success); margin-bottom: 12px;
        }
        .profile-name {
            font-family: var(--font-display); font-size: clamp(32px, 6vw, 44px);
            font-weight: 700; margin-bottom: 8px;
        }
        .profile-specialty {
            font-size: clamp(17px, 2.2vw, 20px); color: var(--color-text-secondary); margin-bottom: 16px;
        }
        .profile-meta { display: flex; flex-wrap: wrap; gap: 16px; margin-bottom: 24px; }
        .meta-item {
            display: flex; align-items: center; gap: 8px;
            font-size: clamp(14px, 1.6vw, 16px); color: var(--color-text-secondary);
        }
        .meta-item svg { width: 18px; height: 18px; opacity: 0.6; }
        .meta-item strong { color: var(--color-text-primary); font-weight: 600; }
        .profile-cta {
            display: inline-flex; align-items: center; gap: 8px;
            padding: clamp(14px, 2.2vw, 16px) clamp(28px, 4vw, 32px);
            background: var(--gradient-primary); color: white; border: none;
            border-radius: 980px; font-size: clamp(15px, 1.8vw, 17px); font-weight: 600;
            text-decoration: none; box-shadow: 0 4px 16px rgba(94, 92, 230, 0.3);
            transition: all 0.3s var(--ease-smooth);
        }
        .profile-cta:hover { transform: translateY(-4px); box-shadow: 0 12px 32px rgba(94, 92, 230, 0.4); }

        .video-section { margin-bottom: clamp(32px, 5vw, 48px); }
        .section-title {
            font-family: var(--font-display); font-size: clamp(22px, 3.5vw, 28px);
            font-weight: 600; margin-bottom: 16px;
            display: flex; align-items: center; gap: 10px;
        }
        .section-title svg { width: 24px; height: 24px; }
        .video-container {
            position: relative; padding-bottom: 56.25%; height: 0;
            border-radius: 20px; overflow: hidden; background: var(--color-bg-secondary);
            box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
        }
        .video-container iframe { position: absolute; top: 0; left: 0; width: 100%; height: 100%; border: none; }
        .video-caption {
            font-size: clamp(14px, 1.6vw, 15px); color: var(--color-text-secondary);
            margin-top: 12px; text-align: center;
        }

        .content-section { margin-bottom: clamp(32px, 5vw, 48px); }
        .content-card {
            background: rgba(255, 255, 255, 0.8); backdrop-filter: blur(20px);
            border-radius: 20px; padding: clamp(24px, 4vw, 32px);
            border: 1px solid var(--color-border-light);
        }
        .content-card h3 {
            font-family: var(--font-display); font-size: clamp(18px, 2.5vw, 22px);
            font-weight: 600; margin-bottom: 16px;
        }
        .content-card p {
            font-size: clamp(15px, 1.8vw, 17px); line-height: 1.7;
            color: var(--color-text-secondary); margin-bottom: 16px;
        }
        .service-list { list-style: none; display: flex; flex-direction: column; gap: 12px; }
        .service-list li {
            display: flex; align-items: flex-start; gap: 12px;
            font-size: clamp(15px, 1.8vw, 16px); line-height: 1.5;
        }
        .service-list li::before { content: '✓'; color: var(--color-success); font-weight: 700; }

        .pricing-card {
            background: linear-gradient(135deg, rgba(94, 92, 230, 0.04) 0%, rgba(0, 113, 227, 0.04) 100%);
            border: 2px solid rgba(94, 92, 230, 0.15);
        }
        .price-amount {
            font-family: var(--font-display); font-size: clamp(36px, 6vw, 48px);
            font-weight: 700; color: var(--color-ios-purple); margin-bottom: 8px;
        }
        .price-desc { font-size: clamp(14px, 1.6vw, 16px); color: var(--color-text-secondary); }

        .best-for-list { display: flex; flex-wrap: wrap; gap: 8px; }
        .best-for-tag {
            padding: 8px 16px; background: var(--color-bg-secondary);
            border-radius: 980px; font-size: clamp(13px, 1.5vw, 14px);
            font-weight: 500; color: var(--color-text-secondary);
        }

        .cta-section {
            background: var(--color-bg-secondary); border-radius: 24px;
            padding: clamp(32px, 5vw, 48px); text-align: center;
            margin-bottom: clamp(32px, 5vw, 48px);
        }
        .cta-section h3 {
            font-family: var(--font-display); font-size: clamp(24px, 4vw, 32px);
            font-weight: 700; margin-bottom: 12px;
        }
        .cta-section p {
            font-size: clamp(15px, 1.8vw, 17px); color: var(--color-text-secondary); margin-bottom: 24px;
        }
        .cta-buttons { display: flex; gap: 12px; justify-content: center; flex-wrap: wrap; }
        .cta-btn {
            display: inline-flex; align-items: center; gap: 8px;
            padding: clamp(14px, 2.2vw, 16px) clamp(28px, 4vw, 32px);
            border-radius: 980px; font-size: clamp(15px, 1.8vw, 17px); font-weight: 600;
            text-decoration: none; border: none; transition: all 0.3s var(--ease-smooth);
        }
        .cta-btn.primary {
            background: var(--gradient-primary); color: white;
            box-shadow: 0 4px 16px rgba(94, 92, 230, 0.3);
        }
        .cta-btn.primary:hover { transform: translateY(-4px); box-shadow: 0 12px 32px rgba(94, 92, 230, 0.4); }
        .cta-btn.secondary { background: white; color: var(--color-text-primary); border: 1px solid var(--color-border); }
        .cta-btn.secondary:hover { background: var(--color-bg-secondary); }

        .flightsuite-cta {
            background: linear-gradient(135deg, rgba(94, 92, 230, 0.08) 0%, rgba(0, 113, 227, 0.08) 100%);
            border-radius: 20px; padding: clamp(24px, 4vw, 32px); text-align: center;
            border: 1px solid rgba(94, 92, 230, 0.15);
        }
        .flightsuite-cta h4 {
            font-size: clamp(18px, 2.5vw, 22px); font-weight: 600; margin-bottom: 12px;
            display: flex; align-items: center; justify-content: center; gap: 8px;
        }
        .flightsuite-cta p {
            font-size: clamp(15px, 1.8vw, 17px); color: var(--color-text-secondary); margin-bottom: 20px;
        }

        .footer {
            padding: clamp(40px, 6vw, 60px) var(--container-padding);
            border-top: 1px solid var(--color-border-light); text-align: center;
        }
        .footer-text { font-size: clamp(13px, 1.5vw, 14px); color: var(--color-text-tertiary); }
        .footer-text a { color: var(--color-apple-blue); text-decoration: none; }

        @media (max-width: 768px) {
            .nav-link { display: none; }
            .profile-header { flex-direction: column; align-items: center; text-align: center; }
            .profile-meta { justify-content: center; }
            .cta-buttons { flex-direction: column; }
            .cta-btn { width: 100%; justify-content: center; }
        }
    </style>
</head>
<body>
    <div class="animated-bg">
        <div class="gradient-orb"></div>
        <div class="gradient-orb"></div>
    </div>

    <header class="header">
        <div class="header-inner">
            <a href="/" class="logo-text">FlightSuite</a>
            <nav class="header-nav">
                <a href="/find-your-crm.html" class="nav-link">Find Your CRM</a>
                <a href="/experts/" class="nav-link">Experts</a>
                <a href="/blog.html" class="nav-link">Blog</a>
                <a href="https://chromewebstore.google.com/detail/flightsuite-crm-operator/blmnkgfabhnalpmmodfbpicmedfgdgbb" class="cta-header" target="_blank">Install Free</a>
            </nav>
        </div>
    </header>

    <nav class="breadcrumbs" aria-label="Breadcrumb">
        <ol class="breadcrumbs-list">
            <li><a href="/">Home</a></li>
            <li class="separator">›</li>
            <li><a href="/experts/">Experts</a></li>
            <li class="separator">›</li>
            <li aria-current="page">${name}</li>
        </ol>
    </nav>

    <main class="main-content">
        <section class="profile-hero">
            <a href="/experts/" class="back-link">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M19 12H5M12 19l-7-7 7-7"/>
                </svg>
                Back to Experts
            </a>

            <div class="profile-header">
                <div class="profile-photo">${initials}</div>
                <div class="profile-info">
                    <span class="verified-badge">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                            <polyline points="20 6 9 17 4 12"></polyline>
                        </svg>
                        FlightSuite Verified Pro
                    </span>
                    <h1 class="profile-name">${name}</h1>
                    <p class="profile-specialty">GHL Certified Expert • ${specialtyDisplay}</p>
                    <div class="profile-meta">
                        <span class="meta-item">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
                            <strong>${priceDisplay}</strong>
                        </span>
                        <span class="meta-item">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
                            ${location}
                        </span>
                        <span class="meta-item">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
                            ${rating} (${reviewCount} reviews)
                        </span>
                    </div>
                    <a href="${bookingUrl}" class="profile-cta" target="_blank" rel="noopener">
                        Book a Discovery Call
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M5 12h14M12 5l7 7-7 7"/>
                        </svg>
                    </a>
                </div>
            </div>
        </section>

        ${videoSection}

        <section class="content-section">
            <h2 class="section-title">What ${firstName} Builds</h2>
            <div class="content-card">
                <h3>Core Services</h3>
                <ul class="service-list">
                    ${servicesList || '<li>GoHighLevel setup and customization</li><li>Workflow and automation builds</li><li>CRM optimization</li>'}
                </ul>
            </div>
        </section>

        <section class="content-section">
            <h2 class="section-title">Pricing</h2>
            <div class="content-card pricing-card">
                <div class="price-amount">${priceDisplay}</div>
                <p class="price-desc">${(pricingDetails || 'Contact for detailed pricing based on your project scope.').replace(/\n/g, '<br>')}</p>
            </div>
        </section>

        <section class="content-section">
            <h2 class="section-title">Best For</h2>
            <div class="content-card">
                <div class="best-for-list">
                    ${clientTags}
                </div>
            </div>
        </section>

        <section class="cta-section">
            <h3>Ready to get started?</h3>
            <p>Book a discovery call with ${firstName} to discuss your project and see if it's a good fit.</p>
            <div class="cta-buttons">
                <a href="${bookingUrl}" class="cta-btn primary" target="_blank" rel="noopener">
                    Book a Call with ${firstName}
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M5 12h14M12 5l7 7-7 7"/>
                    </svg>
                </a>
                <a href="/experts/" class="cta-btn secondary">
                    Browse Other Experts
                </a>
            </div>
        </section>

        <section class="flightsuite-cta">
            <h4>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--color-ios-purple)" stroke-width="2">
                    <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"></path>
                </svg>
                Once your GHL is set up...
            </h4>
            <p>FlightSuite lets you update your CRM with natural language. No more manual data entry after calls.</p>
            <div class="cta-buttons">
                <a href="https://chromewebstore.google.com/detail/flightsuite-crm-operator/blmnkgfabhnalpmmodfbpicmedfgdgbb" class="cta-btn primary" target="_blank">Install FlightSuite - Free</a>
                <a href="/" class="cta-btn secondary">Learn More</a>
            </div>
        </section>
    </main>

    <footer class="footer">
        <p class="footer-text">
            Made with care by <a href="/">FlightSuite</a> · <a href="/experts/">All Experts</a> · <a href="/find-your-crm.html">CRM Quiz</a>
        </p>
    </footer>
</body>
</html>`;
}

/**
 * Generate expert card HTML for index page
 */
function generateExpertCard(slug, expert) {
    const initials = expert.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
    const specialtyDisplay = (expert.specialty || 'automation').split(' ').map(s =>
        s.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())
    ).slice(0, 2).join(' & ');

    const priceDisplay = expert.priceMin ? `From $${expert.priceMin.toLocaleString()}` : 'Contact for pricing';
    const locationDisplay = expert.location || 'International';
    const reviewCount = expert.reviewCount || 0;
    const ghlUrl = expert.ghlDirectoryUrl;
    const bookingLink = expert.bookingLink || '#';

    // Generate a short quote from services
    let quote = '"GHL expert ready to help"';
    if (expert.coreServices) {
        const firstLine = expert.coreServices.split('\n')[0].trim();
        if (firstLine.length > 10 && firstLine.length < 60) {
            quote = `"${firstLine}"`;
        }
    }

    const reviewsHtml = ghlUrl
        ? `<span class="rating-count"><a href="${ghlUrl}" target="_blank">${reviewCount} reviews</a></span>`
        : `<span class="rating-count">${reviewCount} reviews</span>`;

    return `
        <!-- ${expert.name} -->
        <article class="expert-card" data-crm="gohighlevel" data-specialty="${expert.specialty || 'automation'}" data-verified="true">
            <div class="verified-badge">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                    <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
                FlightSuite Verified Pro
            </div>
            <div class="card-body">
                <div class="expert-header">
                    <div class="expert-photo">${initials}</div>
                    <div class="expert-info">
                        <h3 class="expert-name">${expert.name}</h3>
                        <p class="expert-specialty">${specialtyDisplay}</p>
                        <div class="expert-rating">
                            <span class="rating-stars">
                                <svg viewBox="0 0 24 24"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
                                <svg viewBox="0 0 24 24"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
                                <svg viewBox="0 0 24 24"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
                                <svg viewBox="0 0 24 24"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
                                <svg viewBox="0 0 24 24"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
                            </span>
                            ${reviewsHtml}
                        </div>
                        <span class="claimed-badge">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"></polyline></svg>
                            Claimed Profile
                        </span>
                    </div>
                </div>
                <p class="expert-quote">${quote}</p>
                <div class="expert-meta">
                    <span class="meta-item">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
                        <strong>${priceDisplay}</strong>
                    </span>
                    <span class="meta-item">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
                        ${locationDisplay}
                    </span>
                </div>
                <div class="card-footer">
                    <a href="/experts/${slug}.html" class="btn-profile">View Profile</a>
                    <a href="${bookingLink}" class="btn-book" target="_blank" title="Book a call">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
                    </a>
                </div>
            </div>
        </article>`;
}

/**
 * Update experts/index.html with all expert cards
 */
function updateExpertsIndexPage(experts, dryRun) {
    const indexPath = path.join(CONFIG.EXPERTS_DIR, 'index.html');

    try {
        let html = fs.readFileSync(indexPath, 'utf8');

        // Generate cards for all experts, sorted by review count (descending)
        const sortedExperts = Object.entries(experts)
            .sort((a, b) => (b[1].reviewCount || 0) - (a[1].reviewCount || 0));

        const cardsHtml = sortedExperts
            .map(([slug, expert]) => generateExpertCard(slug, expert))
            .join('\n');

        // Replace the expert grid content
        const gridStartMarker = '<div class="expert-grid" id="expertGrid">';
        const gridEndMarker = '</div>\n\n    <div class="section-divider"';

        const startIndex = html.indexOf(gridStartMarker);
        const endIndex = html.indexOf(gridEndMarker);

        if (startIndex === -1 || endIndex === -1) {
            console.log('   ⚠️  Could not find expert grid markers in index.html');
            return;
        }

        const newHtml = html.substring(0, startIndex + gridStartMarker.length) +
            '\n' + cardsHtml + '\n    ' +
            html.substring(endIndex);

        // Also update the count in the stats
        const countRegex = /(\d+) Verified \+ (\d+) Unclaimed/;
        const updatedHtml = newHtml.replace(countRegex, `${sortedExperts.length} Verified + $2 Unclaimed`);

        if (!dryRun) {
            fs.writeFileSync(indexPath, updatedHtml);
            console.log(`   ✅ Updated experts/index.html with ${sortedExperts.length} expert cards`);
        } else {
            console.log(`   Would update experts/index.html with ${sortedExperts.length} expert cards`);
        }
    } catch (err) {
        console.log(`   ⚠️  Error updating index.html: ${err.message}`);
    }
}

/**
 * Main sync function
 */
async function syncAirtable() {
    console.log('='.repeat(60));
    console.log('Airtable → Expert Directory Sync');
    console.log('='.repeat(60));

    if (CONFIG.DRY_RUN) {
        console.log('\n⚠️  DRY RUN MODE - No files will be modified\n');
    }

    // Check for API key
    const apiKey = process.env.AIRTABLE_API_KEY;
    if (!apiKey) {
        console.error('❌ Missing AIRTABLE_API_KEY environment variable');
        console.error('   Get your API key from: https://airtable.com/create/tokens');
        process.exit(1);
    }

    // Load existing data
    console.log('\n📂 Loading existing experts data...');
    let expertsData = { experts: {}, unclaimedExperts: {}, lastUpdated: null, rankingWeights: {} };
    try {
        expertsData = JSON.parse(fs.readFileSync(CONFIG.EXPERTS_DATA_PATH, 'utf8'));
    } catch (e) {
        console.log('   No existing data found, starting fresh');
    }

    // Fetch from Airtable
    console.log('\n☁️  Fetching records from Airtable...');
    const airtableResponse = await fetchAirtableRecords(apiKey);
    const records = airtableResponse.records || [];
    console.log(`   Found ${records.length} records`);

    // Launch browser for GHL scraping
    console.log('\n🌐 Launching browser for GHL directory scraping...');
    const browser = await puppeteer.launch({
        headless: 'new',
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    });

    // Process each record
    const newExperts = [];
    const updatedExperts = [];

    for (const record of records) {
        const name = record.fields['Lead Name'];
        if (!name) continue;

        const slug = generateSlug(name);
        const ghlUrl = extractGHLUrl(record.fields['Website or Profile Link']);
        const isNew = !expertsData.experts[slug];

        console.log(`\n${isNew ? '➕' : '🔄'} ${name}`);

        // Scrape GHL directory if URL exists
        let scrapedData = null;
        if (ghlUrl) {
            console.log(`   Scraping: ${ghlUrl}`);
            scrapedData = await scrapeGHLProfile(browser, ghlUrl);
            if (scrapedData) {
                console.log(`   → ${scrapedData.rating}★ (${scrapedData.reviewCount} reviews), ${scrapedData.certifications.length} certs`);
            }
            await new Promise(resolve => setTimeout(resolve, CONFIG.SCRAPE_DELAY_MS));
        }

        // Transform and merge data
        const transformed = transformAirtableRecord(record, scrapedData);

        if (isNew) {
            newExperts.push(transformed);
        } else {
            updatedExperts.push(transformed);
        }

        // Update experts data
        expertsData.experts[slug] = transformed.data;
    }

    await browser.close();

    // Generate/regenerate HTML pages for ALL experts from Airtable
    const allExperts = [...newExperts, ...updatedExperts];
    console.log(`\n📝 Generating HTML pages for ${allExperts.length} expert(s)...`);

    for (const expert of allExperts) {
        const htmlContent = generateExpertHTML(expert.data);
        const htmlPath = path.join(CONFIG.EXPERTS_DIR, `${expert.slug}.html`);

        if (!CONFIG.DRY_RUN) {
            fs.writeFileSync(htmlPath, htmlContent);
            const isNew = newExperts.includes(expert);
            console.log(`   ${isNew ? '✅ Created' : '🔄 Updated'}: ${expert.slug}.html`);
        } else {
            console.log(`   Would write: ${expert.slug}.html`);
        }
    }

    // Update experts-data.json
    expertsData.lastUpdated = new Date().toISOString().split('T')[0];

    if (!CONFIG.DRY_RUN) {
        fs.writeFileSync(CONFIG.EXPERTS_DATA_PATH, JSON.stringify(expertsData, null, 2));
        console.log(`\n✅ Updated experts-data.json`);
    } else {
        console.log(`\nWould update experts-data.json`);
    }

    // Update experts/index.html with all expert cards
    console.log(`\n📄 Updating experts listing page...`);
    updateExpertsIndexPage(expertsData.experts, CONFIG.DRY_RUN);

    // Summary
    console.log('\n' + '='.repeat(60));
    console.log('SYNC COMPLETE');
    console.log('='.repeat(60));
    console.log(`   New experts:     ${newExperts.length}`);
    console.log(`   Updated experts: ${updatedExperts.length}`);
    console.log(`   Total experts:   ${Object.keys(expertsData.experts).length}`);

    if (newExperts.length > 0) {
        console.log('\n   New experts added:');
        newExperts.forEach(e => console.log(`   - ${e.data.name}`));
    }
}

// Run
syncAirtable().catch(err => {
    console.error('\n❌ Sync failed:', err);
    process.exit(1);
});
