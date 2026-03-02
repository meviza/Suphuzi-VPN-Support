const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const validator = require('validator');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Security middleware
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
      fontSrc: ["'self'", "https://fonts.gstatic.com"],
      imgSrc: ["'self'", "data:", "https:"],
      scriptSrc: ["'self'"],
    },
  },
}));

// CORS configuration
app.use(cors({
  origin: ['https://meviza.github.io', 'http://localhost:8000', 'https://suphuzi-vpn.com'],
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // limit each IP to 5 requests per windowMs
  message: {
    error: 'Too many requests from this IP, please try again after 15 minutes.',
    retryAfter: 15 * 60 * 1000
  },
  standardHeaders: true,
  legacyHeaders: false,
});

app.use('/api/', limiter);

// Email transporter configuration
const createTransporter = () => {
  // For production, use a real SMTP service
  return nodemailer.createTransporter({
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: process.env.SMTP_PORT || 587,
    secure: false,
    auth: {
      user: process.env.SMTP_USER || 'your-email@gmail.com',
      pass: process.env.SMTP_PASS || 'your-app-password'
    }
  });
};

// Data validation
const validateEnterpriseDemo = (data) => {
  const errors = [];
  
  // Required fields validation
  const requiredFields = [
    'company_name', 'industry', 'company_size', 'country',
    'contact_name', 'job_title', 'email', 'user_count', 'package_type', 'use_case'
  ];
  
  requiredFields.forEach(field => {
    if (!data[field] || validator.isEmpty(data[field].toString().trim())) {
      errors.push(`${field.replace('_', ' ')} is required`);
    }
  });
  
  // Email validation
  if (data.email && !validator.isEmail(data.email)) {
    errors.push('Valid email address is required');
  }
  
  // Phone validation (optional)
  if (data.phone && !validator.isMobilePhone(data.phone, 'any')) {
    errors.push('Valid phone number is required');
  }
  
  // Company size validation
  const validSizes = ['1-10', '11-50', '51-200', '201-500', '501-1000', '1000+'];
  if (data.company_size && !validSizes.includes(data.company_size)) {
    errors.push('Invalid company size');
  }
  
  // User count validation
  const validUserCounts = ['1-10', '11-50', '51-100', '101-250', '251-500', '500+'];
  if (data.user_count && !validUserCounts.includes(data.user_count)) {
    errors.push('Invalid user count');
  }
  
  // Package type validation
  const validPackages = [
    'monthly_premium', 'monthly_per_user', 'annual_premium', 
    'annual_per_user', 'custom'
  ];
  if (data.package_type && !validPackages.includes(data.package_type)) {
    errors.push('Invalid package type');
  }
  
  return errors;
};

// Email templates
const createEnterpriseDemoEmail = (data) => {
  const packageTypeMap = {
    'monthly_premium': 'Monthly Premium Subscription',
    'monthly_per_user': 'Monthly Per-User Quota',
    'annual_premium': 'Annual Premium Subscription',
    'annual_per_user': 'Annual Per-User Quota',
    'custom': 'Custom Enterprise Solution'
  };
  
  const industryMap = {
    'technology': 'Technology',
    'finance': 'Financial Services',
    'healthcare': 'Healthcare',
    'government': 'Government/Military',
    'education': 'Education',
    'retail': 'Retail/E-commerce',
    'manufacturing': 'Manufacturing',
    'legal': 'Legal',
    'consulting': 'Consulting',
    'other': 'Other'
  };
  
  const useCaseMap = {
    'remote_work': 'Remote Work Security',
    'data_protection': 'Data Protection & Privacy',
    'secure_communications': 'Secure Communications',
    'compliance': 'Regulatory Compliance',
    'geo_access': 'Geographic Content Access',
    'cybersecurity': 'Cybersecurity Enhancement',
    'other': 'Other'
  };
  
  return `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Enterprise Demo Request - Suphuzi VPN</title>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
        .content { background: #f8f9fa; padding: 30px; border-radius: 0 0 10px 10px; }
        .section { margin-bottom: 25px; padding: 20px; background: white; border-radius: 8px; border-left: 4px solid #3b82f6; }
        .field { margin-bottom: 10px; }
        .label { font-weight: bold; color: #555; display: inline-block; width: 150px; }
        .value { color: #333; }
        .priority { background: #fff3cd; border-left-color: #ffc107; }
        .footer { text-align: center; margin-top: 30px; color: #666; font-size: 12px; }
        .badge { background: #3b82f6; color: white; padding: 4px 8px; border-radius: 4px; font-size: 12px; }
    </style>
</head>
<body>
    <div class="header">
        <h1>🛡️ Enterprise Demo Request</h1>
        <h2>Suphuzi VPN - Military-Grade Security</h2>
    </div>
    
    <div class="content">
        <div class="section">
            <h3>🏢 Company Information</h3>
            <div class="field"><span class="label">Company Name:</span> <span class="value">${data.company_name}</span></div>
            <div class="field"><span class="label">Industry:</span> <span class="value">${industryMap[data.industry] || data.industry}</span></div>
            <div class="field"><span class="label">Company Size:</span> <span class="value">${data.company_size} employees</span></div>
            <div class="field"><span class="label">Country:</span> <span class="value">${data.country}</span></div>
        </div>
        
        <div class="section">
            <h3>👤 Contact Information</h3>
            <div class="field"><span class="label">Name:</span> <span class="value">${data.contact_name}</span></div>
            <div class="field"><span class="label">Job Title:</span> <span class="value">${data.job_title}</span></div>
            <div class="field"><span class="label">Email:</span> <span class="value">${data.email}</span></div>
            <div class="field"><span class="label">Phone:</span> <span class="value">${data.phone || 'Not provided'}</span></div>
        </div>
        
        <div class="section priority">
            <h3>🎯 Requirements <span class="badge">HIGH PRIORITY</span></h3>
            <div class="field"><span class="label">User Count:</span> <span class="value">${data.user_count} users</span></div>
            <div class="field"><span class="label">Package Type:</span> <span class="value">${packageTypeMap[data.package_type]}</span></div>
            ${data.user_quota ? `<div class="field"><span class="label">User Quota:</span> <span class="value">${data.user_quota} GB per user</span></div>` : ''}
            <div class="field"><span class="label">Use Case:</span> <span class="value">${useCaseMap[data.use_case]}</span></div>
        </div>
        
        ${data.requirements ? `
        <div class="section">
            <h3>📝 Specific Requirements</h3>
            <div class="field"><span class="value">${data.requirements}</span></div>
        </div>
        ` : ''}
        
        ${data.preferred_date ? `
        <div class="section">
            <h3>📅 Preferred Demo Time</h3>
            <div class="field"><span class="value">${data.preferred_date}</span></div>
        </div>
        ` : ''}
        
        <div class="section">
            <h3>📊 Additional Information</h3>
            <div class="field"><span class="label">Referral Source:</span> <span class="value">${data.referral || 'Not specified'}</span></div>
            <div class="field"><span class="label">Newsletter:</span> <span class="value">${data.newsletter ? 'Yes' : 'No'}</span></div>
            <div class="field"><span class="label">Request Time:</span> <span class="value">${new Date().toLocaleString()}</span></div>
        </div>
    </div>
    
    <div class="footer">
        <p>This request was submitted via the Suphuzi VPN Enterprise Demo form.</p>
        <p>Please respond within 24 hours to provide excellent customer service.</p>
        <p>📧 Contact: kerem.newton571@gmail.com | antempostudios@gmail.com</p>
    </div>
</body>
</html>
  `;
};

const createConfirmationEmail = (data) => {
  return `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Enterprise Demo Request Confirmation - Suphuzi VPN</title>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
        .content { background: #f8f9fa; padding: 30px; border-radius: 0 0 10px 10px; }
        .info-box { background: white; padding: 20px; border-radius: 8px; margin-bottom: 20px; border-left: 4px solid #3b82f6; }
        .footer { text-align: center; margin-top: 30px; color: #666; font-size: 12px; }
        .btn { display: inline-block; background: #3b82f6; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin: 10px 0; }
    </style>
</head>
<body>
    <div class="header">
        <h1>🛡️ Demo Request Received!</h1>
        <h2>Thank you for your interest in Suphuzi VPN Enterprise</h2>
    </div>
    
    <div class="content">
        <div class="info-box">
            <h3>Request Summary</h3>
            <p><strong>Company:</strong> ${data.company_name}</p>
            <p><strong>Contact:</strong> ${data.contact_name} (${data.email})</p>
            <p><strong>Users:</strong> ${data.user_count}</p>
            <p><strong>Package:</strong> ${data.package_type.replace('_', ' ').toUpperCase()}</p>
        </div>
        
        <div class="info-box">
            <h3>What Happens Next?</h3>
            <ol>
                <li>Our enterprise team will review your request</li>
                <li>We'll contact you within 24 hours</li>
                <li>We'll schedule a personalized demo for your organization</li>
                <li>We'll provide a custom quote based on your requirements</li>
            </ol>
        </div>
        
        <div class="info-box">
            <h3>Need Immediate Assistance?</h3>
            <p>Feel free to reach out directly to our enterprise team:</p>
            <p>📧 <strong>kerem.newton571@gmail.com</strong></p>
            <p>📞 <strong>Response Time:</strong> Within 24 business hours</p>
        </div>
        
        <div style="text-align: center;">
            <a href="https://meviza.github.io/Suphuzi-VPN-Support/" class="btn">Visit Our Website</a>
            <a href="mailto:kerem.newton571@gmail.com" class="btn">Contact Enterprise Team</a>
        </div>
    </div>
    
    <div class="footer">
        <p>Suphuzi VPN - Military-Grade Privacy Protection</p>
        <p>🌐 https://suphuzi-vpn.com | 📧 support@suphuzi-vpn.com</p>
    </div>
</body>
</html>
  `;
};

// API Routes
app.post('/api/enterprise-demo-request', async (req, res) => {
  try {
    // Validate input data
    const validationErrors = validateEnterpriseDemo(req.body);
    if (validationErrors.length > 0) {
      return res.status(400).json({
        success: false,
        error: 'Validation failed',
        details: validationErrors
      });
    }
    
    const data = req.body;
    
    // Create email transporter
    const transporter = createTransporter();
    
    // Send email to enterprise team
    const enterpriseEmailOptions = {
      from: process.env.SMTP_USER || 'noreply@suphuzi-vpn.com',
      to: 'kerem.newton571@gmail.com',
      cc: 'antempostudios@gmail.com',
      subject: `🚀 Enterprise Demo Request: ${data.company_name} (${data.user_count} users)`,
      html: createEnterpriseDemoEmail(data),
      priority: 'high'
    };
    
    // Send confirmation email to customer
    const confirmationEmailOptions = {
      from: process.env.SMTP_USER || 'noreply@suphuzi-vpn.com',
      to: data.email,
      subject: 'Your Suphuzi VPN Enterprise Demo Request - Confirmation',
      html: createConfirmationEmail(data)
    };
    
    // Send emails
    await transporter.sendMail(enterpriseEmailOptions);
    await transporter.sendMail(confirmationEmailOptions);
    
    // Log the request (for analytics)
    console.log(`Enterprise demo request from ${data.company_name} (${data.email}) - ${data.user_count} users`);
    
    // Store in database (if you have one)
    // await saveDemoRequest(data);
    
    res.json({
      success: true,
      message: 'Demo request submitted successfully',
      requestId: `demo-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
    });
    
  } catch (error) {
    console.error('Enterprise demo request error:', error);
    
    res.status(500).json({
      success: false,
      error: 'Failed to process demo request',
      message: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// Serve static files (for production)
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, 'public')));
  
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
  });
}

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    error: 'Something went wrong!',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: 'Endpoint not found'
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Suphuzi VPN Enterprise API Server running on port ${PORT}`);
  console.log(`📧 Email service configured for: ${process.env.SMTP_USER || 'demo mode'}`);
  console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('SIGINT received, shutting down gracefully');
  process.exit(0);
});

module.exports = app;
