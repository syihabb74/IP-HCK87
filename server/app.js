require('dotenv').config({ path: '../.env' });
const express = require('express');
const app = express();
const cors = require('cors');
const routes = require('./routes');

const PORT = 3003;

app.use(cors());
app.use(express.urlencoded({extended: false}));
app.use(express.json());


app.use(routes);


app.listen(PORT, () => {

    console.log(`App listening on port ${PORT}`);

})