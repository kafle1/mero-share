import express from "express";
const router = express.Router();
import dotenv from "dotenv";
import { fileURLToPath } from 'url';
import path, { dirname } from "path";
import File from "../models/file.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
dotenv.config();

const download = router.get("/:uuid", async (req, res) => {
  const file = await File.findOne({ uuid: req.params.uuid });
  if (!file) {
    return res.render("download", { error: "Link has been expired" });
  }
//   const filePath = `${__dirname}/../${file.path}`;
 
const filePath = path.resolve(`${__dirname}`,'..', `${file.path}`) ;
  
  res.download(filePath);
});

export default download;
