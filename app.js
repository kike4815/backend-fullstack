const express = require("express");
const bodyParser = require("body-parser");

const app = express();
const { API_VERSION } = require("./config");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//Configure HTTP 
app.use((req,res,next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method"
    );
    res.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, DELETE");
    res.header("Allow", "GET, POST, OPTIONS, PUT, DELETE");
    next()
  })
  
  //Load Routings
const userRoutes = require("./routes/user");
const authRoutes = require('./routes/auth')
const menuRoutes = require('./routes/menu')
const newsletterRoutes = require('./routes/newsletter')
const courses = require('./routes/course')
const postsRoutes = require('./routes/posts')

//Routes Basic
app.use(`/api/${API_VERSION}`, userRoutes);
app.use(`/api/${API_VERSION}`, authRoutes);
app.use(`/api/${API_VERSION}`, menuRoutes)
app.use(`/api/${API_VERSION}`, newsletterRoutes)
app.use(`/api/${API_VERSION}`, courses)
app.use(`/api/${API_VERSION}`, postsRoutes)

module.exports = app;
