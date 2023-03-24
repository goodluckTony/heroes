const express = require("express");
const app = express();
const db = require("./db");
const objectId = require("mongodb").ObjectId;
const base64Img = require("base64-img");
// const dateFormat = require('dateformat');
// const now = new Date();

const bodyParser = require("body-parser");
const cors = require("cors");
const { ObjectId } = require("mongodb");
app.use(cors());
app.use(bodyParser.json());
app.use(express.static("public"));

app.post("/api/heroes", async (req, res) => {
  const hero = req.body;
  const existingHero = await db
    .collection("heroes")
    .findOne({ name: hero.name, power: hero.power });
  const photoBase64 = req.body.photo;
  const photoName = "temp_" + new Date().getTime();
  if (!existingHero) {
    console.log("Hero is valid");
    base64Img.img(
      `data:image/png;base64,${photoBase64}`,
      "public/img",
      photoName,
      async function (err, filepath) {
        if (err) {
          console.error(err);
          res.status(500).send("Failed to save photo");
        }
        const src = filepath.slice(7, filepath.length);
        const result = await db.collection("heroes").insertOne({
          img: src,
          name: hero.name,
          power: hero.power,
          age: hero.age,
          gender: hero.gender,
        });
        res.status(200).send({ id: result.insertedId });
      }
    );
  } else if (
    hero.name.value === "" ||
    hero.power.value === "" ||
    hero.age.value === "" ||
    hero.gender.value === ""
  ) {
    console.log("This hero is invalid");
    res.status(400).send({ errorMessage: "This hero is invalid" });
  } else {
    console.log("This hero is invalid");
    res.status(400).send({ errorMessage: "This hero is invalid" });
  }
});

//add hero id to comment and save to new collection
app.post("/api/heroes/:id/comments", async (req, res) => {
  const heroId = req.params.id;
  const sendedData = req.body;
  const date = new Date();
  // const formattedDate = dateFormat(now, "dddd, mmmm dS, yyyy, h:MM:ss TT");

  const hero = await db
    .collection("heroes")
    .findOne({ _id: new objectId(heroId) });
  if (!hero) {
    return res
      .status(404)
      .send({ errorMessage: `Hero with id ${heroId} not found` });
  } else {
    let comment = {
      heroId,
      date,
      name: sendedData.name,
      comment: sendedData.comment,
    };
    const result = await db.collection("comments").insertOne(comment);
    console.log(result);
    comment._id = result._id;
    res.status(201).send(comment);
  }
});


app.get("/api/heroes/:id", async (req, res) => {
  const id = req.params.id;
  if (!id) {
    res.status(400).send("id cannot be empty");
  }
  console.log(id);
  const hero = await db.collection("heroes").findOne({ _id: new objectId(id) });
  if (hero) {
    res.status(200).send(hero);
  } else {
    console.log("Could not retrieve hero ID");
    return res.status(500).send("Could not retrieve hero ID");
  }
});

// extract comments to hero-details page
app.get("/api/heroes/:id/comments", async (req, res) => {
  const heroId = req.params.id;
  if (!heroId) {
    res.status(404).send({ errorMessage: "the hero has no comments" });
  }
  const heroData = await db
    .collection("comments")
    .find({ heroId: heroId })
    .sort({ date: 1 })
    .toArray();
 
  if (heroData) {
    res.status(200).send(heroData);
  }
});

// sort extracted heroes by age
app.get("/api/heroes", async (req, res) => {
  const heroesList = await db
    .collection("heroes")
    .find({})
    .sort({ age: -1 })
    .toArray();
  // const countHeroComments = await db.collection("comments").countDocuments({heroId: heroId})
  for (let i in heroesList) {
    heroesList[i].commentsCount = await db
      .collection("comments")
      .countDocuments({heroId: heroesList[i]._id.toString()})
  }
  console.log("heroesList", heroesList);
  res.status(200).send(heroesList);
});

// remove comment by hero id
app.delete("/api/heroes/:heroId/comments/:id", async (req, res) => {
  const id = req.params.id;
  const heroId = req.params.heroId;
  const heroComment = await db
    .collection("comments")
    .deleteOne({ _id: new objectId(id), heroId: heroId });
  if (heroComment) {
    res.status(200).send("hero comment removed successfully");
  }
});

// remove hero by hero id
app.delete("/api/heroes/:id", async (req, res) => {
  const id = req.params.id;
  const hero = await db
    .collection("heroes")
    .deleteOne({ _id: new objectId(id) });
  // const removeHeroById = await hero.(id);
  if (hero) {
    res.status(200).send("User removed successfully");
  } else {
    res.status(404).send("User not found");
  }
});

const heroPort = 3500;
app.listen(heroPort, () => console.log(`Server started on port ${heroPort}`));
