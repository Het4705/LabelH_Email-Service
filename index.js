const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const sendEmail = require('./emailService');
const { formatEmail, formatAdminEmail } = require('./formatEmail');

dotenv.config();

const app = express();
app.use(express.json());

// Define allowed origins
const allowedOrigins = [
  process.env.FRONTEND_URL
];

// CORS options
const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (like Postman, curl) only in non-production
    if (!origin && process.env.NODE_ENV !== 'production') {
      return callback(null, true);
    }

    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  }
};

// Use CORS middleware
app.use(cors(corsOptions));

// Production-only middleware to block disallowed origins
if (process.env.NODE_ENV === 'production') {
  app.use((req, res, next) => {
    const origin = req.get('origin') || req.get('referer');

    if (origin && !allowedOrigins.includes(origin)) {
      return res.status(403).send('Forbidden');
    }

    next();
  });
}

app.get('/', (req, res) => {
  res.send('Welcome to The Label H Email Service');
});

app.post('/send-order-confirmation', async (req, res) => {
  const { user, order, products } = req.body;

  if (!user?.email || !order || !products?.length) {
    return res.status(400).json({
      error: 'Missing user, order, or products info'
    });
  }

  try {
    const html = formatEmail({ user, order, products });
    const adminHtml = formatAdminEmail({ user, order, products });

    console.log('Sending email to:', user.email);
    await sendEmail({
      to: user.email,
      replyTo: process.env.ADMIN_EMAIL,
      subject: `Order Confirmation - From The Label H`,
      html,
    });
    console.log('Email sent successfully to:', user.email);

    console.log('Email is being sent to Admin');
    await sendEmail({
      to: process.env.ADMIN_EMAIL,
      subject: `New Order Placed by - ${user.name}`,
      html: adminHtml
    });

    console.log('Email sent successfully to Admin');

    res.status(200).json({
      message: 'Order confirmation email sent'
    });
  } catch (err) {
    console.error('Email error:', err);
    res.status(500).json({
      error: 'Failed to send email'
    });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
