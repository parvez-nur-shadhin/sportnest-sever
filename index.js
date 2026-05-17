const express = require('express');
const dotenv = require('dotenv');
dotenv.config();
const app = express();
const port = process.env.PORT;

app.get('/', (req, res) => {
    res.send("The Server is Open.");
})

app.listen(port, () => {
    console.log(`The server is running at ${port}`);
})