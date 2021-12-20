import File from "./models/file.js";
import fs from "fs";
import connectDB from "./config/db.js";

connectDB();
const fetchData = async () => {
  const pastDate = new Date(Date.now() - 24 * 60 * 60 * 1000);
  const files = await File.find({ createdAt: { $lt: pastDate } });

  if (files.length) {
    for (const file of files) {
      try {
        fs.unlinkSync(file.path);
        await file.remove();
        console.log(`Successfully deleted ${file.filename}`);
      } catch (error) {
        console.log(`Error while deleting file ${err}`);
      }
    }
}
console.log("JOB DONE");
};

fetchData()
  .then((res) => {
    process.exit();
  })
  .catch((err) => {
    console.log(err);
  });
