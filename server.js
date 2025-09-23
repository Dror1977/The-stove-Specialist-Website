// Simple Email API Server for The Stove Specialist
const express = require('express');
const { Resend } = require('resend');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Email configuration - you'll need to update with your Resend API key
const resend = new Resend('re_avy1wLzr_LgbuXaAqahqw7exJZENY1kso');

// API endpoint to send emails
app.post('/api/send-email', async (req, res) => {
    try {
        const {
            customer_name,
            customer_phone,
            customer_email,
            customer_suburb,
            appliance_type,
            preferred_date,
            issue_description
        } = req.body;

        // Validate required fields
        if (!customer_name || !customer_phone || !customer_suburb || !appliance_type || !issue_description) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        // Email content
        const emailHTML = `
        <!DOCTYPE html>
        <html>
        <head>
            <style>
                body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                .header { background: #1e3566; color: white; padding: 20px; text-align: center; }
                .content { padding: 20px; }
                .field { margin-bottom: 15px; }
                .label { font-weight: bold; color: #1e3566; }
                .value { margin-left: 10px; }
                .description { background: #f8fafc; border-left: 4px solid #84cc16; padding: 15px; margin-top: 10px; }
                .footer { background: #f1f5f9; padding: 15px; text-align: center; font-size: 14px; color: #64748b; }
            </style>
        </head>
        <body>
            <div class="header">
                <h1>New Service Inquiry</h1>
                <p>The Stove Specialist - Appliance Repair Sydney</p>
            </div>
            
            <div class="content">
                <h2>Customer Details</h2>
                
                <div class="field">
                    <span class="label">Name:</span>
                    <span class="value">${customer_name}</span>
                </div>
                
                <div class="field">
                    <span class="label">Phone:</span>
                    <span class="value">${customer_phone}</span>
                </div>
                
                <div class="field">
                    <span class="label">Email:</span>
                    <span class="value">${customer_email || 'Not provided'}</span>
                </div>
                
                <div class="field">
                    <span class="label">Suburb:</span>
                    <span class="value">${customer_suburb}</span>
                </div>
                
                <h2>Service Request</h2>
                
                <div class="field">
                    <span class="label">Appliance:</span>
                    <span class="value">${appliance_type}</span>
                </div>
                
                <div class="field">
                    <span class="label">Preferred Date:</span>
                    <span class="value">${preferred_date || 'As soon as possible'}</span>
                </div>
                
                <div class="field">
                    <span class="label">Issue Description:</span>
                    <div class="description">${issue_description}</div>
                </div>
                
                <div class="field">
                    <span class="label">Inquiry Date:</span>
                    <span class="value">${new Date().toLocaleString('en-AU')}</span>
                </div>
            </div>
            
            <div class="footer">
                <p><strong>The Stove Specialist</strong> | Sydney's Premier Appliance Repair Service</p>
                <p>Please respond promptly during business hours: Monday-Friday, 8AM-4PM</p>
                <p>Phone: 02 9365 2508</p>
            </div>
        </body>
        </html>
        `;

        // Send email using Resend
        const { data, error } = await resend.emails.send({
            from: 'The Stove Specialist <onboarding@resend.dev>',
            to: ['info@thestovespecialist.com.au'],
            subject: `New Service Inquiry - ${appliance_type} in ${customer_suburb}`,
            html: emailHTML
        });

        if (error) {
            throw new Error(`Resend error: ${error.message}`);
        }
        
        console.log('Email sent successfully');
        res.json({ success: true, message: 'Email sent successfully' });

    } catch (error) {
        console.error('Email sending error:', error);
        res.status(500).json({ error: 'Failed to send email' });
    }
});

// Health check endpoint for Vercel
app.get('/api/health', (_, res) => {
    res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Start server
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
    console.log('Email API available at /api/send-email');
});

module.exports = app;