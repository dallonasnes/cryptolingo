const express = require('express');
const app = express();
const port = 3033;

app.get('/', (req, res) => {
    res.send("hello world");
})

app.listen(port, () => {
    console.log(`Web server listening on port ${port}`);
})