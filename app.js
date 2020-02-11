var express = require("express");
var bodyParser = require('body-parser');
const app = express();

app.set('view engine', 'pug');
app.use(bodyParser.json());
app.use(express.static('public'));
require("./upload")(app, __dirname + "/uploads/");

app.get("/upload", (req, res) => {
    res.render("upload", {name:"Upload"})
});

app.listen(80, "0.0.0.0", (callback) => {
    if (callback) console.log(callback);
});