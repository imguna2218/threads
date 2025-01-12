import express from 'express';
import dotenv from "dotenv";
import connectDB from './db/connectdb.js';
import cookieParser from 'cookie-parser';
import userRoutes from './routes/userRoutes.js';
import cors from "cors";
import postRoutes from "./routes/postRoutes.js";
import messageRoutes from "./routes/messageRoutes.js";
import { v2 as cloudinary } from "cloudinary";
import { app, server } from './socket/socket.js';


dotenv.config();
connectDB();
const port = process.env.PORT || 5000;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(cors({
  origin: 'http://localhost:3000',
  methods: 'GET,POST,PUT,DELETE',
  allowedHeaders: 'Content-Type,Authorization',
  credentials: true
}));

// Routes
app.use('/api/users', userRoutes);
app.use('/api/posts/', postRoutes);
app.use("/api/messages", messageRoutes);

server.listen(port, () => console.log(`listening on ${port} port hey`));
