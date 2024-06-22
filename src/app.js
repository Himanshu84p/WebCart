import express from "express";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: "true" }));
app.use(express.static("public"));

//importing routers
import userRouter from "../src/routes/user.route.js"
import cartRouter from "../src/routes/cart.route.js"

app.use("/api/v1/users", userRouter)
app.use("/api/v1/cart", cartRouter)



export default app
