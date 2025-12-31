// Airtable Configuration for FlightSuite Landing Page
// Using Airtable Webhook - Simple, secure, no API keys needed!

const AIRTABLE_CONFIG = {
    // Airtable Webhook URLs (no authentication needed!)
    crmWaitlistWebhook: 'https://hooks.airtable.com/workflows/v1/genericWebhook/app46JHq6Rm3TpbpT/wflTT6C1culC8Nuad/wtrpYgynXs2c9Ph1o',
    mobileEmailWebhook: 'https://hooks.airtable.com/workflows/v1/genericWebhook/app46JHq6Rm3TpbpT/wfls4xvfoLew9VHxF/wtrsgZw4yLpGXnxgD'
};

/**
 * Submit data to Airtable via Webhook
 * @param {string} webhookUrl - Webhook URL to submit to
 * @param {object} data - Form data to submit
 * @returns {Promise} - Response from webhook
 */
async function submitToAirtable(webhookUrl, data) {
    try {
        console.log('📤 Submitting to Airtable webhook:', data);

        const response = await fetch(webhookUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });

        // Airtable webhooks return 200 even on success with no body
        // So we just check if the request succeeded
        if (response.ok) {
            console.log('✅ Successfully submitted to Airtable!');
            return { success: true, message: 'Data saved successfully' };
        } else {
            const errorText = await response.text();
            console.error('❌ Webhook error:', response.status, errorText);
            throw new Error(`Failed to save: ${response.status} ${errorText || 'Unknown error'}`);
        }

    } catch (error) {
        console.error('❌ Failed to submit to Airtable:', error);

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

    return await submitToAirtable(AIRTABLE_CONFIG.crmWaitlistWebhook, data);
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

    return await submitToAirtable(AIRTABLE_CONFIG.mobileEmailWebhook, data);
}

/**
 * Track install button clicks (optional)
 * Note: You may want to create a separate webhook for install click tracking
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

    // Using CRM webhook for now - create separate webhook if needed
    return await submitToAirtable(AIRTABLE_CONFIG.crmWaitlistWebhook, data);
}
