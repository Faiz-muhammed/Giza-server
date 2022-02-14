const express = require("express");
var cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const env = require("dotenv");
const db = require("./config/connection");
const cors = require("cors");

const memberRouter = require("./routes/memberRoute");
const ProjectmanagerRoute = require("./routes/Projectmanager.js");

env.config();

// server setup
const PORT = process.env.PORT || 3001;

const app = express();




app.use(express.json());
app.use(express.urlencoded());
app.use(cookieParser());
app.use(
  cors({
    origin: ["http://localhost:3000"],
    credentials: true,
  })
);

db.connect((err) => {
  if(err){
    console.log("error in db connection");
    console.log(err)
  }
  else{

    console.log("database connected succesfully");
  }
});

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());

app.use("/api/member",memberRouter)
app.use("/api/manager",ProjectmanagerRoute)


app.listen(PORT, (err) => {
  console.log(`listening at :${PORT}`);
});

module.exports = app;
