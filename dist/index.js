"use strict";
const express = require('express');
const app = express();
const port = 3009;
app.get('/', (req, res) => {
    let helloWorld = 'Hello World!';
    res.send(helloWorld);
});
app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});
