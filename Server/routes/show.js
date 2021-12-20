import express from "express";
const router = express.Router();
import dotenv from "dotenv";
import File from "../models/file.js";

dotenv.config();

const show = router.get("/:uuid", async (req, res) => {
  try {
    const file = await File.findOne({ uuid: req.params.uuid });
    if (!file) {
      return res.render("download", { error: "Link has been expired." });
    }

    return res.render("download", {
      uuid: file.uuid,
      fileName: file.filename,
      fileSize: file.size,
      downloadLink: `${process.env.APP_BASE_URL}/files/download/${file.uuid}`,
    });
  } catch (error) {
    return res.render("download", { error: "Something went wrong." });
  }
});

export default show;
