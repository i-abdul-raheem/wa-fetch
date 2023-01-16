const express = require("express");
const cors = require("cors");
var fileupload = require("express-fileupload");
const bodyParser = require("body-parser");
const app = express();
const mongoose = require("mongoose");
const { File, PhoneNumber } = require("./model/models");
const fs = require("fs"); // Import File system modules
const axios = require("axios"); // Import Axios

mongoose.set("strictQuery", false);
mongoose.connect(
  "mongodb+srv://arhex:hEllfun0300@arhex.arsz5at.mongodb.net/wa-fetch?retryWrites=true&w=majority",
  {
    useNewUrlParser: true,
  }
);
const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error: "));
db.once("open", function () {
  console.log("Connected successfully");
});

// Set PORT
require("dotenv").config({ path: "../.env" });
const PORT = process.env.REACT_APP_API || 5000;

// SET APIS
const API1 = process.env.API1; // Import API 1 key
const API2 = process.env.API2; // Import API 2 key

// Middlewares
app.use(cors());
app.use(fileupload());
app.use(express.static("../files"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", async (req, res) => {
  res.send("Hello");
});

app.post("/upload", async (req, res) => {
  if (!req.body.fileName) {
    return res
      .status(403)
      .send({ message: "File name is required", code: 403 });
  }
  if (!req.files || !req.files.file) {
    return res.status(403).send({ message: "File is required", code: 403 });
  }
  const file = req.files.file;
  const filename = req.body.fileName;
  const fileNameExist = await File.find({
    $or: [{ fileName: filename }, { filePath: `../files/${filename}` }],
  });
  if (fileNameExist.length > 0) {
    return res
      .status(403)
      .send({ message: "File name already exist", code: 403 });
  }
  const addNewFile = new File({
    fileName: filename,
    filePath: `../files/${filename}`,
  });
  const added = await addNewFile.save();
  if (added._id) {
  }
  file.mv(`../files/${filename}`, (err) => {
    if (err) {
      return res.status(500).send({ message: "File upload failed", code: 500 });
    }
    return res.status(200).send({ message: "File Uploaded", code: 200 });
  });
});

app.get("/files", async (req, res) => {
  const myFiles = await File.find({});
  res.status(200).send({ message: myFiles, code: 200 });
});

app.post("/scan", async (req, res) => {
  if (!req.body.phone) {
    return res
      .status(403)
      .send({ message: "Phone number is required", code: 403 });
  }
  if (!req.body.api) {
    return res.status(403).send({ message: "API is required", code: 403 });
  }
  const myPhone = req.body.phone;
  const api = req.body.api;
  try {
    const myData = await axios.get(api + myPhone).then((i) => i.data[0]);
    if (!myData.phone) {
      return res.status(403).send({ message: myData, code: 403 });
    }
    res.status(200).send({ message: myData, code: 200 });
  } catch {
    res.status(200).send({ message: {}, code: 200 });
  }
});

app.get("/open/:file", async (req, res) => {
  const filePath = `../files/${req.params.file}`;
  const data = fs.readFileSync(filePath, { encoding: "utf-8" });
  const newData = data.split("\r\n");
  newData.shift();
  newData.map((i, index) => {
    newData[index] = "+1" + newData[index];
  });
  newData.pop();
  res.status(200).send({ message: newData, code: 200 });
});

app.post("/save", async (req, res) => {
  const data = {
    fileName: req.body.fileName,
    isActive: req.body.result,
    phoneNumber: req.body.phone,
  };
  const newData = new PhoneNumber(data);
  await newData.save();
  res.send("Added");
});

app.get("/all", async (req, res) => {
  const response = await PhoneNumber.find({});
  res.send(response);
});

app.post("/all", async (req, res) => {
  if (!req.body.fileName) {
    return res.send("Invalid Format");
  }
  const response = await PhoneNumber.find({ fileName: req.body.fileName });
  res.send(response);
});

app.get("/export", async (req, res) => {
  const response = await PhoneNumber.find({});
  let str = "";
  for (let i = 0; i < response.length; i++) {
    str = `${str}${response[i].phoneNumber},${response[i].isActive}\r\n`;
  }
  var createStream = fs.createWriteStream("export.csv");
  createStream.end();
  var writeStream = fs.createWriteStream("export.csv");
  writeStream.write(str);
  writeStream.end();
  res.download("export.csv");
});

app.listen(PORT, () => {
  console.log(`Server Started: http://localhost:${PORT}`);
});
