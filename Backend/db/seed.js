import mongoose from "mongoose";
import dotenv from "dotenv";
import fs from "fs";
import Product from "../models/product.model.js";
const products = JSON.parse(
  fs.readFileSync(new URL("../data/products.json", import.meta.url))
);

dotenv.config();

console.log("env",process.env.DB_CONNECT);
mongoose
  .connect(process.env.DB_CONNECT)
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.log(err));

const importData = async () => {
  try {
    // delete old products
    await Product.deleteMany();

    // insert new products
    await Product.insertMany(products);

    console.log("Products Imported Successfully");

    process.exit();
  } catch (error) {
    console.log(error);

    process.exit(1);
  }
};

importData();