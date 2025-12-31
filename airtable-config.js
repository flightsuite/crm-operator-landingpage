// Airtable Configuration for FlightSuite Landing Page
// Using Netlify Functions for secure backend API calls

const AIRTABLE_CONFIG = {
    // Netlify Function endpoint (API key is now secure on backend)
    functionEndpoint: '/.netlify/functions/submit-to-airtable',

    // For local development
    isDevelopment: window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1',

    // Table names
    tables: {
        crmWaitlist: 'CRM Waitlist',
        mobileEmailCapture: 'Mobile Email Capture',
        installClicks: 'Install Clicks'
    }
};

/**
 * Submit data to Airtable via Netlify Function
 * @param {string} formType - Type of form ('crmWaitlist' or 'mobileEmail')
 * @param {object} fields - Data fields to submit
 * @returns {Promise} - Response from the backend
 */
async function submitToAirtable(formType, fields) {
    const url = AIRTABLE_CONFIG.functionEndpoint;

    try {
        console.log('📤 Submitting to Netlify function:', formType, fields);

        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                formType: formType,
                fields: fields
            })
        });

        if (!response.ok) {
            const error = await response.json();
            console.error('❌ Backend API Error:', error);

            // User-friendly error messages
            let userMessage = error.message || 'Failed to save to Airtable. ';
            if (error.type === 'TABLE_NOT_FOUND') {
                userMessage += `Table not found. Please check your Airtable setup.`;
            } else if (error.type === 'INVALID_PERMISSIONS') {
                userMessage += 'Permission denied. Check API key settings.';
            }

            throw new Error(userMessage);
        }

        const data = await response.json();
        console.log('✅ Successfully submitted:', data);
        return data;
    } catch (error) {
        console.error('❌ Failed to submit:', error);

        // Check if it's a network error
        if (error.message.includes('fetch') || error.message.includes('NetworkError')) {
            console.error('💡 Network error - make sure you\'re running on Netlify or using `netlify dev`');
        }

        throw error;
    }
}

/**
 * Submit CRM Waitlist form data
 * @param {object} formData - { name, email, crm, timestamp }
 */
async function submitCrmWaitlist(formData) {
    const fields = {
        'Name': formData.name,
        'Email': formData.email,
        'CRM Type': formData.crm,
        'Submission Date': formData.timestamp || new Date().toISOString(),
        'Source': 'Landing Page',
        'Status': 'New'
    };

    return await submitToAirtable('crmWaitlist', fields);
}

/**
 * Submit Mobile Email Capture form data
 * @param {object} formData - { name, email, timestamp }
 */
async function submitMobileEmailCapture(formData) {
    const fields = {
        'Name': formData.name,
        'Email': formData.email,
        'Submission Date': formData.timestamp || new Date().toISOString(),
        'Source': 'Landing Page - Mobile',
        'Status': 'New'
    };

    return await submitToAirtable('mobileEmail', fields);
}

/**
 * Track install button clicks (optional)
 * @param {object} data - { timestamp, userAgent, referrer }
 */
async function trackInstallClick(data) {
    const fields = {
        'Timestamp': data.timestamp || new Date().toISOString(),
        'User Agent': data.userAgent || navigator.userAgent,
        'Referrer': data.referrer || document.referrer || 'Direct',
        'Page URL': window.location.href
    };

    return await submitToAirtable(AIRTABLE_CONFIG.tables.installClicks, fields);
}
