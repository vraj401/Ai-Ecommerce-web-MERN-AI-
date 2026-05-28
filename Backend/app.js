import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import cors from 'cors';
const app = express();
import cookieParser from 'cookie-parser';
import connectToDb from './db/db.js';
import orderRoutes from "./routes/order.routes.js"
import userRoutes from "./routes/user.routes.js"
import cartRoutes from "./routes/cart.route.js"
import productRoutes from "./routes/product.routes.js"
import { Server } from "socket.io";
import aiRoutes from "./routes/ai.routes.js";

connectToDb();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended:true}))
app.use(cookieParser());

app.get('/', (req, res) => {
    res.send("Hello, World!");
});

app.use("/api/user",userRoutes)
app.use("/api/products",productRoutes)
app.use("/api/cart",cartRoutes)
app.use("/api/order",orderRoutes)
app.use("/api/ai", aiRoutes);
export default app;
