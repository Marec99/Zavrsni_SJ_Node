const express = require('express');
const app = express();
let armaturaRouter = require("./routes/armatura.js")

app.use(express.json())

var bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get('/', (req, res) => {
    res.send('Zdravo!! :)');
});

app.use("/api", armaturaRouter);

app.listen(8080, () => {
    console.log("Server listen on port: ", 8080);
});