import express from "express";
import cors from "cors";
import error from "./middleware/error";
import { settings } from "./config/settings";
import userRoutes from "./routes/userRoutes";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors(settings.cors));
app.use(express.static("public"));

app.use(settings.api_prefix, userRoutes);

app.use(error);

export default app;
