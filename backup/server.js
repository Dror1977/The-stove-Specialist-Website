// Simple Email API Server for The Stove Specialist
const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = 7000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('.'));

// Email configuration - you'll need to update these with actual credentials
const transporter = nodemailer.createTransport({
    service: 'gmail', // or your email provider
    auth: {
        user: 'your-email@gmail.com', // Your Gmail account
        pass: 'your-app-password'     // Gmail App Password (not regular password)
    }
});

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

        // Email options
        const mailOptions = {
            from: '"The Stove Specialist Website" <your-email@gmail.com>',
            to: 'info@thestovespecialist.com.au',
            subject: `New Service Inquiry - ${appliance_type} in ${customer_suburb}`,
            html: emailHTML,
            text: `
New service inquiry from ${customer_name}

Customer Details:
- Name: ${customer_name}
- Phone: ${customer_phone}
- Email: ${customer_email || 'Not provided'}
- Suburb: ${customer_suburb}

Service Request:
- Appliance: ${appliance_type}
- Preferred Date: ${preferred_date || 'As soon as possible'}

Issue Description:
${issue_description}

Please contact the customer as soon as possible.
            `
        };

        // Send email
        await transporter.sendMail(mailOptions);
        
        console.log('Email sent successfully');
        res.json({ success: true, message: 'Email sent successfully' });

    } catch (error) {
        console.error('Email sending error:', error);
        res.status(500).json({ error: 'Failed to send email' });
    }
});

// Serve the website
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Start server
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
    console.log('Email API available at /api/send-email');
});

module.exports = app;