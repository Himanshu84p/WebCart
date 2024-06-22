import dotenv from "dotenv";
import connectDB from "./config/db/index.js";
import app from "./app.js";

dotenv.config({
  path: "./env",
});

connectDB()
  .then(() => {
    app.on("error", (err) => {
      console.log("Error occured while running the server", err);
    });
    app.listen(process.env.PORT || 3000, () => {
      console.log("Server is listening on the port", process.env.PORT);
    });
  })
  .catch((err) => {
    console.log("Server error", err);
  });