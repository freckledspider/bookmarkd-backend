// dependencies
require("dotenv").config();
const { PORT = 3000, DATABASE_URL } = process.env;
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const cors = require("cors");
const morgan = require("morgan");

// mongo
mongoose.connect(DATABASE_URL, {
  useUnifiedTopology: true,
  useNewUrlParser: true,
});

mongoose.connection
  .on("open", () => console.log("Your are connected to mongoose"))
  .on("close", () => console.log("Your are disconnected from mongoose"))
  .on("error", (error) => console.log(error));

// bookmarkd schema
const BookmarkSchema = new mongoose.Schema({
    title: String,
    url: String
});

const Bookmark = mongoose.model("Bookmark", BookmarkSchema);

// middleware
app.use(cors());
app.use(morgan("dev")); 
app.use(express.json());

//--------------------------------------
// routes
//--------------------------------------

app.get("/", (req, res) => {
  res.send("hello world");
});

app.get("/bookmarks", async (req, res) => {
  try {
    res.json(await Bookmark.find({}));
  } catch (error) {
    res.status(400).json(error);
  }
});

app.post("/bookmarks", async (req, res) => {
  try {
    res.json(await Bookmark.create(req.body));
  } catch (error) {
    res.status(400).json(error);
  }
});

app.put("/bookmarks/:id", async (req, res) => {
  try {
    res.json(
      await Bookmark.findByIdAndUpdate(req.params.id, req.body, { new: true })
    );
  } catch (error) {
    res.status(400).json(error);
  }
});

app.delete("/bookmarks/:id", async (req, res) => {
  try {
    res.json(await Bookmark.findByIdAndRemove(req.params.id));
  } catch (error) {
    res.status(400).json(error);
  }
});

app.get("/bookmarks/:id", async (req, res) => {
    try {
      res.json(await Bookmark.findById(req.params.id));
    } catch (error) {
      res.status(400).json(error);
    }
  });

//--------------------------------------

// listener
app.listen(PORT, () => console.log(`listening on PORT ${PORT}`));