import express from 'express';
import http from 'http';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import compression from 'compression';
import cors from 'cors';
import mongoose from "mongoose";
import * as dotenv from 'dotenv';


const app = express()

const router = express.Router()

app.use(cors({
    credentials: true,
}))

app.use(compression())
app.use(cookieParser())
app.use(bodyParser.json())
dotenv.config();
const server = http.createServer(app)
server.listen(8080, () => {
    console.log("server running on http://localhost:8080/")
})

const MONGO_URL = process.env.MONGODB_URI
const MONGO_LOCAL = 'mongodb://localhost:27017'
mongoose.Promise = Promise;
mongoose.connect(MONGO_LOCAL);
mongoose.connection.on('error', (error: Error) => {
    console.log(error)
})
// mongoose.connection.on('connected',()=>{})

app.use('/', router)