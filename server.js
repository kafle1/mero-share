import express from "express";
import path, { dirname } from "path";
import connectDB from "./config/db.js";
import {files} from "./routes/files.js";
import show from "./routes/show.js";
import { fileURLToPath } from 'url';
import download from "./routes/download.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const app = express();

//Use static files 
app.use(express.static('public'))

//Parse json data
app.use(express.json())

//Connect to database
connectDB();

//Cors
app.use(cors(corsOptions));
const corsOptions = {
  origin: process.env.ALLOWED_CLIENTS.split(',')
}

//Template engine
app.set("views", path.join(__dirname, "/views"));
app.set("view engine", 'ejs');

//Routes
app.use("/api/files", files);
app.use("/files", show);
app.use("/files/download", download);

//Listen to server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(
    `Listening on port ${PORT}, Server running on http://localhost:${PORT}`
  );
});
