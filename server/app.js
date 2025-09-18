const express = require('express');
const app = express();
const cors = require('cors');
const routes = require('./routes');

if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config({ path: '../.env' });
 }


app.use(cors());
app.use(express.urlencoded({extended: false}));
app.use(express.json());


app.use(routes);

module.exports = app;






