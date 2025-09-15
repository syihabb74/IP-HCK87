require('dotenv').config();
const express = require('express');
const app = express();
const routes = require('./routes');

const PORT = 3002;


app.use(express.urlencoded({extended: false}));
app.use(express.json());


app.use(routes);


app.listen(PORT, () => {

    console.log(`App listening on port ${PORT}`);

})