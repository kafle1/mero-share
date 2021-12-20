import express from "express";
import { v4 as uuid } from "uuid";
const router = express.Router();
import multer from "multer";
import path from "path";
import File from "../models/file.js";
import dotenv from "dotenv";
import sendMail from "../services/emailService.js";
import emailTemplate from "../services/emailTemplate.js";

dotenv.config();
let storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    const uniqueName = `${Date.now()}-${Math.round(
      Math.random() * 1e9
    )}${path.extname(file.originalname)}`;
    cb(null, uniqueName);
  },
});

let upload = multer({
  storage,
  limits: { fileSize: 1000000 * 100 },
}).single("myfile");

const files = router.post("/", (req, res) => {
  //Store in uploads
  upload(req, res, async (err) => {
    //Validate request
    if (!req.file) {
      return res.json({ error: "File not uploaded. Please upload the file." });
    }
    if (err) {
      return res.status(500).send({ error: err.message });
    }
    //Store in db
    const file = new File({
      filename: req.file.filename,
      uuid: uuid(),
      path: req.file.path,
      size: req.file.size,
    });

    const response = await file.save();
    return res.json({
      file: `${process.env.APP_BASE_URL}/files/${response.uuid}`,
    });
  });

  //Response
});

const send = router.post("/send", async (req, res) => {
  const { uuid, emailTo, emailFrom } = req.body;

  //Validate
  if (!uuid || !emailFrom || !emailTo) {
    return res.status(422).send({ error: "All fields are required." });
  }

  //Get data from database

  const file = await File.findOne({ uuid: uuid });
  if (file.sender) {
    return res.status(422).send({ error: "Email has been already sent." });
  }

  file.sender = emailFrom;
  file.receiver = emailTo;

  const response = await file.save();

  //Send email
  sendMail({
    from: emailFrom,
    to: emailTo,
    subject: "Mero Share - File Sharing",
    text: `${emailFrom} shared a file with you`,
    html: emailTemplate({
      emailFrom: emailFrom,
      downloadLink: `${process.env.APP_BASE_URL}/files/${file.uuid}`,
      size: parseInt(file.size / 1000) + "KB",
      expires: "24 Hours",
    }),
  });

  return res.send({success: true})
});

export { files, send };
