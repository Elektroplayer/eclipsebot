import mongoose from "mongoose";
import Main from "./structures/Main.js";

mongoose.set('strictQuery', true);
mongoose.connect(process.env.MONGO_URI!)

let main = new Main();
