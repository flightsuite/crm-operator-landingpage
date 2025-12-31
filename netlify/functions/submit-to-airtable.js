// Netlify Serverless Function for Airtable Submissions
// This keeps your API key secure on the backend

const fetch = require('node-fetch');

exports.handler = async (event, context) => {
    // Only allow POST requests
    if (event.httpMethod !== 'POST') {
        return {
            statusCode: 405,
            body: JSON.stringify({ error: 'Method not allowed' })
        };
    }

    // Enable CORS
    const headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Content-Type': 'application/json'
    };

    // Handle preflight requests
    if (event.httpMethod === 'OPTIONS') {
        return {
            statusCode: 200,
            headers,
            body: ''
        };
    }

    try {
        // Parse the request body
        const data = JSON.parse(event.body);
        const { formType, fields } = data;

        // Get environment variables
        const AIRTABLE_API_KEY = process.env.AIRTABLE_API_KEY;
        const AIRTABLE_BASE_ID = process.env.AIRTABLE_BASE_ID;

        if (!AIRTABLE_API_KEY || !AIRTABLE_BASE_ID) {
            console.error('Missing environment variables');
            return {
                statusCode: 500,
                headers,
                body: JSON.stringify({
                    error: 'Server configuration error',
                    message: 'Airtable credentials not configured'
                })
            };
        }

        // Determine which table to use
        let tableName;
        if (formType === 'crmWaitlist') {
            tableName = 'CRM Waitlist';
        } else if (formType === 'mobileEmail') {
            tableName = 'Mobile Email Capture';
        } else {
            return {
                statusCode: 400,
                headers,
                body: JSON.stringify({ error: 'Invalid form type' })
            };
        }

        // Submit to Airtable
        const airtableUrl = `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/${encodeURIComponent(tableName)}`;

        const response = await fetch(airtableUrl, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${AIRTABLE_API_KEY}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                fields: fields,
                typecast: true
            })
        });

        if (!response.ok) {
            const error = await response.json();
            console.error('Airtable API Error:', error);

            return {
                statusCode: response.status,
                headers,
                body: JSON.stringify({
                    error: 'Failed to save to Airtable',
                    message: error.error.message || 'Unknown error',
                    type: error.error.type
                })
            };
        }

        const result = await response.json();

        return {
            statusCode: 200,
            headers,
            body: JSON.stringify({
                success: true,
                id: result.id,
                createdTime: result.createdTime,
                message: 'Successfully saved to Airtable'
            })
        };

    } catch (error) {
        console.error('Function Error:', error);

        return {
            statusCode: 500,
            headers,
            body: JSON.stringify({
                error: 'Internal server error',
                message: error.message
            })
        };
    }
};
