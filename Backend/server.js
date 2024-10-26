const express = require("express");

const app = express();

const PORT = process.env.PORT || 8888;

app.use(express.json());


app.listen(PORT, () => {
    console.log(`Running on port ${PORT}`);
});