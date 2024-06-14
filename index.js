import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
//import cors from "cors";
import postRoutes from "./routes/posts.js";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
dotenv.config();

app.use(bodyParser.json({ limit: "30mb", extended: true }));
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }));
//app.use(cors());
app.use("/posts", postRoutes);
app.use("/", postRoutes);

const PORT = process.env.PORT || 5000;

/* mongoose
  .connect(process.env.CONNECTION_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() =>
    app.listen(PORT, () => console.log(`Server running on port: ${PORT}`))
  )
  .catch((error) => console.log(error.message)); */

app.use(express.static(path.join(__dirname, "./client/build")));

app.get("*", function (_, res) {
  console.log("Hello i am here");
  res.sendFile(
    path.join(__dirname, "./client/build/index.html"),
    function (err) {
      res.status(500).send(err);
    }
  );
});

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(
      "mongodb+srv://akashSingh:mongoAkash@cluster0.lxy5jzc.mongodb.net/",
      {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      }
    );
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};

/* app.all("*", (req, res) => {
  res.json({ "every thing": "is awesome" });
}); */

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log("listening for requests");
  });
});
