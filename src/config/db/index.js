import mongoose from "mongoose";
import { DB_NAME } from "../../constant.js";

//function to connect db
const connectDB = async () => {
  try {
    // saving connection instance for check which db is connected
    const connectionInstance = await mongoose.connect(
      `${process.env.MONGO_URI}/${DB_NAME}`
    );
    console.log("Successfully connected to the db", connectionInstance.connection.host);
  } catch (error) {
    console.log("MongoDB connection failed", error);

    // Calling process.exit() will force the process to exit as quickly as possible even if there are still asynchronous operations pending that have not yet completed fully, including I/O operations to process.stdout and process.stderr

    process.exit(1);
  }
};

export default connectDB;