require('dotenv').config({ path: require('path').join(__dirname, '.env') });

const express = require("express");
const cors = require('cors');
const cookieParser = require('cookie-parser');
const app = express();
const PORT = process.env.PORT || 5000;


const authRoutes = require("./routes/authRoutes"); 
const bookingroutes = require('./routes/booking');
const tourRoutes = require("./routes/tourRoutes");
const profileRoutes = require("./routes/profileRoutes");
const managerRoutes = require("./routes/managerRoutes");
const reportRoutes = require("./routes/reportRoutes");
const verificationRoutes = require("./routes/verificationRoutes");
const pstroutes = require('./routes/postroutes');

const allowedOrigins = [
  'http://localhost:5173',
  'http://127.0.0.1:5173',
  'http://localhost:3000',
  'http://127.0.0.1:3000'
];

if (process.env.FRONTEND_URL) {
  const customOrigins = process.env.FRONTEND_URL.split(',').map(url => url.trim().replace(/\/$/, ''));
  allowedOrigins.push(...customOrigins);
}

app.use(cors({
  origin: (origin, callback) => {
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) return callback(null, true);
    // Allow vercel preview / production URLs
    if (origin.endsWith('.vercel.app') || origin.endsWith('.netlify.app')) return callback(null, true);
    return callback(new Error(`CORS blocked for origin: ${origin}`));
  },
  credentials: true,
}));

app.use(cookieParser());
// Increased payload size limit (Chadli)
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// mounting routes here :
app.use("/auth", authRoutes);
app.use('/api', bookingroutes)
app.use('/pst', pstroutes)
app.use("/tour", tourRoutes);
app.use("/profile1" , profileRoutes);
app.use("/manager" , managerRoutes);
app.use("/report" , reportRoutes);
app.use("/verification" , verificationRoutes);




app.get("/", (req, res) => {
  res.send("Hello from backend!");
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
