import express from 'express';
import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
import path from 'path'
import userRouter from './Routes/userRouter.js';
import adminRouter from './Routes/AdminRouter.js';
import connectDB from "./Config/dbConnection.js";
import { fileURLToPath } from 'url';
const __fileame = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__fileame)


const port = process.env.PORT || 4040
dotenv.config()
const app = express();
connectDB()

// middleware

app.use('/images',express.static(path.join(__dirname,'Public','images')));

app.use(express.json())
const corsOption = {
  origin: "http://localhost:5173",
  credentials: true,  
};

app.use(cors(corsOption))
app.use(cookieParser())


// api end points 
app.use('/api/user',userRouter)
app.use('/api/admin',adminRouter)



// server

app.listen(port,()=>{
  console.log(`server is running ${port}`);
  
})






