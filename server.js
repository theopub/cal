import dotenv from "dotenv";
import {S3Client} from "@aws-sdk/client-s3";
import express from "express";
import multer from "multer";
import multerS3 from "multer-s3";

dotenv.config();

let app = express();

app.use(express.json());

const s3Client = new S3Client({
  credentials: {
    accessKeyId: process.env.aws_access_key_id,
    secretAccessKey: process.env.aws_secret_access_key,
  },
  endpoint: "https://nyc3.digitaloceanspaces.com",
  region: "us-east-1",
});
const s3Storage = multerS3({
  s3: s3Client,
  bucket: "cal-red-space",
  acl: "public-read",
  metadata: (req, file, cb) => {
    cb(null, { fieldname: file.fieldname });
  },
  key: (req, file, cb) => {
    cb(null, Date.now().toString());
  },
});
const upload = multer({
  storage: s3Storage,
});

app.use(express.static("public"));

// uploads image to bucket via s3 middleware and adds to db
app.post("/upload", upload.single("image"), async (req, res) => {
  // req.body retrieves the data sent from the form
  // req.file.location is the url of the image in bucket
  res.redirect("/");
});

app.get("/weekly", (req, res) => {
  let testData = [
    {
      date: "1/1/25",
      img: "https://cal-red-space.nyc3.digitaloceanspaces.com/1739135708392",
    },
  ];
  res.json(testData);
});

app.get("/event", (req, res) => {
  let data = [{}];
  res.send(JSON.stringify(data));
});

app.listen(80, function () {
  console.log("Example app listening on port 80!");
});
