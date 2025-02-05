const express = require("express");

const path = require("path");

const hbs = require("hbs");

const geocode = require("./utils/geocode.js");

const forecast = require("./utils/forecast.js");

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
try{
  const city = req.query.address;
  const coords=req.query.coords;
  if (coords){
    const results = await forecast(city,coords);
    return res.send(results);

  }
  if (!city) {
    return res.send({
        error:"please enter a valid address"
    })
  } else {
    const results = await forecast(city,coords);
    res.send(results);
  }
}catch(e){
console.error(e)
res.redirect("")
}
});

app.listen(port, () => {
  console.log(`The server is listening to port ${port}`);
});
