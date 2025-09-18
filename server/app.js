const express = require('express');
const app = express();
const cors = require('cors');
const routes = require('./routes');
const PORT = process.env.PORT || 3003;
if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config({ path: '../.env' });
 }


app.use(cors());
app.use(express.urlencoded({extended: false}));
app.use(express.json());


app.use(routes);

app.listen(PORT, () => {
    console.log(`App running on port ${PORT}`);
});






