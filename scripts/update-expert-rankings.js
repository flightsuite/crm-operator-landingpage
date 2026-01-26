/**
 * GHL Directory Scraper for Expert Rankings
 *
 * Run periodically to update experts-data.json with latest GHL directory info.
 *
 * Usage:
 *   node scripts/update-expert-rankings.js
 *
 * Requirements:
 *   npm install puppeteer
 *
 * This script will:
 * 1. Load the current experts-data.json
 * 2. For each expert with a ghlDirectoryUrl, scrape their profile
 * 3. Extract rating, review count, and certifications
 * 4. Update the JSON file with new data
 */

const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

const EXPERTS_DATA_PATH = path.join(__dirname, '../experts/experts-data.json');

async function scrapeGHLProfile(browser, url) {
    if (!url) return null;

    const page = await browser.newPage();

    try {
        await page.goto(url, { waitUntil: 'networkidle2', timeout: 30000 });

        // Extract data from the GHL directory profile page
        const data = await page.evaluate(() => {
            // These selectors may need adjustment based on GHL directory structure
            const ratingEl = document.querySelector('[class*="rating"], [class*="stars"]');
            const reviewCountEl = document.querySelector('[class*="review-count"], [class*="reviews"]');
            const certBadges = document.querySelectorAll('[class*="certification"], [class*="badge"]');

            // Extract rating (look for star rating or number)
            let rating = 5.0;
            if (ratingEl) {
                const ratingText = ratingEl.textContent || ratingEl.getAttribute('aria-label') || '';
                const match = ratingText.match(/([\d.]+)/);
                if (match) rating = parseFloat(match[1]);
            }

            // Extract review count
            let reviewCount = 0;
            if (reviewCountEl) {
                const match = reviewCountEl.textContent.match(/(\d+)/);
                if (match) reviewCount = parseInt(match[1]);
            }

            // Extract certifications
            const certifications = [];
            certBadges.forEach(badge => {
                const text = badge.textContent.trim();
                if (text && text.includes('Certified')) {
                    certifications.push(text);
                }
            });

            return { rating, reviewCount, certifications };
        });

        await page.close();
        return data;

    } catch (error) {
        console.error(`Error scraping ${url}:`, error.message);
        await page.close();
        return null;
    }
}

async function updateExpertRankings() {
    console.log('Loading experts data...');

    // Load current data
    const expertsData = JSON.parse(fs.readFileSync(EXPERTS_DATA_PATH, 'utf8'));

    console.log('Launching browser...');
    const browser = await puppeteer.launch({ headless: 'new' });

    let updated = 0;

    for (const [slug, expert] of Object.entries(expertsData.experts)) {
        if (expert.ghlDirectoryUrl) {
            console.log(`Scraping ${expert.name}...`);

            const scrapedData = await scrapeGHLProfile(browser, expert.ghlDirectoryUrl);

            if (scrapedData) {
                expert.rating = scrapedData.rating;
                expert.reviewCount = scrapedData.reviewCount;
                if (scrapedData.certifications.length > 0) {
                    expert.certifications = scrapedData.certifications;
                }
                updated++;
                console.log(`  Updated: ${scrapedData.rating} stars, ${scrapedData.reviewCount} reviews`);
            }

            // Be nice to the server
            await new Promise(resolve => setTimeout(resolve, 2000));
        }
    }

    await browser.close();

    // Update timestamp and save
    expertsData.lastUpdated = new Date().toISOString().split('T')[0];
    fs.writeFileSync(EXPERTS_DATA_PATH, JSON.stringify(expertsData, null, 2));

    console.log(`\nDone! Updated ${updated} experts.`);
    console.log(`Data saved to ${EXPERTS_DATA_PATH}`);
}

// Run if called directly
if (require.main === module) {
    updateExpertRankings().catch(console.error);
}

module.exports = { updateExpertRankings, scrapeGHLProfile };
