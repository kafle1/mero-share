import mongoose from "mongoose";
import dotenv from 'dotenv'

dotenv.config();
const connectDB = () => {
  //Database connection

  mongoose.connect(process.env.MONGODB_CONNECTION_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }).then((res)=> {
      console.log('Connected to database successfully!');
  }).catch((err)=> {
      console.log("Could not connect to Database, :(");
      console.log(err);
  });
 
};

export default connectDB;
