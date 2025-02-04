const express = require("express");

const path = require("path");

const hbs = require("hbs");

const geocode = require("./utils/geocode");

const forecast = require("./utils/forecast");

const viewsPath = path.join(__dirname, "../public/templates/views");

app = express();

app.use(express.static(path.join(__dirname, "../public")));

app.set("view engine", "hbs");

app.set("views", viewsPath);

const port = process.env.PORT || 3000;

app.get("", (req, res) => {
  res.render("home.hbs");
});

app.get("/weather", async (req, res) => {
  const city = req.query.address;
  if (!city) {
    return res.send({
        error:"please enter a valid address"
    })
  } else {
    const results = await forecast(city);
    res.send(results);
  }
});

app.listen(port, () => {
  console.log(`The server is listening to port ${port}`);
});
