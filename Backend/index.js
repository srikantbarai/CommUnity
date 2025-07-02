import express from "express"
import "dotenv/config"
import cookieParser from "cookie-parser";

import { connectDB } from "./lib/db.js" 
import { verifyToken } from "./middlewares/auth.middleware.js";
import authRoute from "./routes/auth.route.js"
import reviewRoute from "./routes/review.route.js"
import serviceRoute from "./routes/service.route.js"
import userRoute from "./routes/user.route.js"

const app = express();
const PORT = process.env.PORT;

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(cookieParser());

app.use("/api/auth",authRoute);

app.use(verifyToken);

app.use("/api/services/:serviceId/reviews", reviewRoute);
app.use("/api/services", serviceRoute);
app.use("/api/user", userRoute);

app.listen(PORT, ()=> {
    console.log(`Server running at PORT ${PORT}`);
    connectDB();
})