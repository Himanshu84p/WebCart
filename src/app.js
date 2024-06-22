import express from "express";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: "true" }));
app.use(express.static("public"));

//importing routers
import userRouter from "../src/routes/user.route.js"
import cartRouter from "../src/routes/cart.route.js"
import productRouter from "../src/routes/product.route.js"

//Routes
app.use("/api/v1/users", userRouter)
app.use("/api/v1/cart", cartRouter)
app.use('/api/v1/products', productRouter);


export default app
