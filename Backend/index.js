import express from "express"
import "dotenv/config"
import cookieParser from "cookie-parser";
import cors from "cors"
import rateLimit from "express-rate-limit";

import { connectDB } from "./lib/db.js" 
import { verifyToken } from "./middlewares/auth.middleware.js";
import authRoute from "./routes/auth.route.js"
import reviewRoute from "./routes/review.route.js"
import serviceRoute from "./routes/service.route.js"
import userRoute from "./routes/user.route.js"

const app = express();
const PORT = process.env.PORT || 8000;

const limiter = rateLimit({
  windowMs: 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
});
const corsOptions = {
  origin: [
    "http://localhost:5173",
    process.env.FRONTEND_URL
  ].filter(Boolean),
  credentials: true,
  methods: ['GET', 'POST', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: [
    'Content-Type', 
    'Authorization', 
    'Cookie',
    'X-User-Password'
  ]
};

app.use(limiter);
app.use(cors(corsOptions));

app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({extended: false, limit: '1mb'}));
app.use(cookieParser());

app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK' });
});

app.use("/api/auth", authRoute);
app.use(verifyToken);
app.use("/api/services/:serviceId/reviews", reviewRoute);
app.use("/api/services", serviceRoute);
app.use("/api/user", userRoute);

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running at PORT ${PORT}`);
  connectDB();
});