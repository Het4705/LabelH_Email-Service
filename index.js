const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const sendEmail = require('./emailService');
const {formatEmail,formatAdminEmail} = require('./formatEmail');

dotenv.config();

const app = express();
app.use(express.json());

const allowedOrigins = [
  'http://localhost:3000',
  'http://127.0.0.1:3000',
  ...(process.env.FRONTEND_URLS ? process.env.FRONTEND_URLS.split(',') : []),
  process.env.FRONTEND_URL
].filter(Boolean);

app.use(cors({
  origin: function(origin, callback) {
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    return callback(new Error('Not allowed by CORS'));
  },
  methods: ["GET", "POST"],
  credentials: true
}));

// app.options('/*', cors()); // Handle preflight requests for all routes
app.options('/', cors());
app.options('/send-order-confirmation', cors());

app.get("/", (req, res) => {
  console.log("Received a GET request to the root endpoint");
  res.send("Welcome to The Label H Email Service");
});

app.post('/send-order-confirmation', async (req, res) => {
  console.log("Received a Post request to the root endpoint");
  // console.log(req.body);
  const {
    user,
    order,
    products
  } = req.body;

  
  if (!user?.email || !order || !products?.length) {
    return res.status(400).json({
      error: 'Missing user, order, or products info'
    });
  }

  try {
    const html = formatEmail({
      user,
      order,
      products
    });

    const adminHtml = formatAdminEmail({
      user,
      order,
      products
    });

    console.log('Sending email to:', user.email);
    await sendEmail({
      to: user.email,
      replyTo: process.env.ADMIN_EMAIL,
      subject: `Order Confirmation - From The Label H`,
      html,
    });
    console.log('Email sent successfully to:', user.email);
    
    console.log('Email is being send to Admin');
    
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