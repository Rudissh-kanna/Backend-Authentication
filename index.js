const express = require('express');
const app = express();
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const { urlencoded } = require('body-parser');
const userRoutes = require('./routes/userRoutes');
const postRoutes = require('./routes/postRoutes');

mongoose.connect("mongodb://localhost/assignment")
.then(() => {app.listen(3000, () => {console.log("Server up and running")})});

const db = mongoose.connection;

db.once('open', () => {console.log("Connected to database")});

// middleware
app.use(express.json());
app.use(bodyParser(urlencoded({extended: false})));

app.use('/', userRoutes);
app.use('/', postRoutes);


