// Form Submission Configuration for FlightSuite Landing Page
// Using Google Sheets via Apps Script - Simple, free, no CORS issues!

const FORM_CONFIG = {
    // Google Apps Script Web App URL
    googleSheetsUrl: 'https://script.google.com/macros/s/AKfycbzKH1boDb5YFJu5MqEn38_nYn48wss5feOSpucoPyn-2mKIdgzOqzs_ix2f9ZbMtR88/exec'
};

/**
 * Submit data to Google Sheets via Apps Script
 * @param {object} data - Form data to submit
 * @returns {Promise} - Response from Google Sheets
 */
async function submitToGoogleSheets(data) {
    try {
        console.log('📤 Submitting to Google Sheets:', data);

        await fetch(FORM_CONFIG.googleSheetsUrl, {
            method: 'POST',
            mode: 'no-cors', // Google Apps Script handles CORS differently
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });

        // With no-cors mode, we can't read the response, but if it doesn't throw an error, it worked
        console.log('✅ Successfully submitted to Google Sheets!');
        return { success: true, message: 'Data saved successfully' };

    } catch (error) {
        console.error('❌ Failed to submit to Google Sheets:', error);

        // Check for network errors
        if (error.message.includes('Failed to fetch') || error.message.includes('NetworkError')) {
            console.error('💡 Network error - check your internet connection');
            throw new Error('Network error. Please check your connection and try again.');
        }

        throw error;
    }
}

/**
 * Submit CRM Waitlist form data
 * @param {object} formData - { name, email, crm, timestamp }
 */
async function submitCrmWaitlist(formData) {
    const data = {
        name: formData.name,
        email: formData.email,
        crmType: formData.crm,
        submissionDate: formData.timestamp || new Date().toISOString(),
        source: 'Landing Page',
        formType: 'CRM Waitlist'
    };

    return await submitToGoogleSheets(data);
}

/**
 * Submit Mobile Email Capture form data
 * @param {object} formData - { name, email, timestamp }
 */
async function submitMobileEmailCapture(formData) {
    const data = {
        name: formData.name,
        email: formData.email,
        submissionDate: formData.timestamp || new Date().toISOString(),
        source: 'Landing Page - Mobile',
        formType: 'Mobile Email Capture'
    };

    return await submitToGoogleSheets(data);
}

/**
 * Track install button clicks (optional)
 * @param {object} clickData - { timestamp, userAgent, referrer }
 */
async function trackInstallClick(clickData) {
    const data = {
        timestamp: clickData.timestamp || new Date().toISOString(),
        userAgent: clickData.userAgent || navigator.userAgent,
        referrer: clickData.referrer || document.referrer || 'Direct',
        pageUrl: window.location.href,
        formType: 'Install Click'
    };

    return await submitToGoogleSheets(data);
}
