require("dotenv").config();
const express = require('express');
const app = express();
const port = 3000;
const cors = require("cors");
const morgan = require("morgan");
const bodyParser = require("body-parser");

require("./services/mongo"); 

app.use(morgan("tiny"));
app.use(cors({ credentials: true, origin: "*" }));
app.use(bodyParser.json({ limit: "50mb" }));
app.use(bodyParser.urlencoded({ extended: true }));


app.use("/user", require("./controller/user"));
app.use("/list", require("./controller/list"));
app.use("/task", require("./controller/task"));

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})