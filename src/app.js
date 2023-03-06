import express from "express";
import db from "./utils/connection.js";
import router from "./routes/UserRoutes.js";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import Users from "./models/UserModel.js";

dotenv.config({ path: "./.env" });

const app = express();

try {
  await db.authenticate();
  console.log("Database connected..");
} catch (error) {
  console.error(error);
}

app.use(cors({ credentials: true }));
app.use(cookieParser());
app.use(express.json());
app.use(router);

app.listen(5000, () => {
  console.log("Server running...");
});
