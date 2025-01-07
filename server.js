const express = require("express");
const cors = require("cors")

const app = express();
app.use(cors())

const PORT = 3000;


const data = {
    "name": "needhichozhan",
    "age": 23,
    "role": "developer"
};

// TEST
app.get("/", (req, res) => {
    res.send("Hello World")
})

app.get("/api/user", (req, res) => {
    res.json(data);
})

// JSONPLACEHOLDER API
app.get("/api/photos", async (req, res) => {
    const response = await fetch("https://jsonplaceholder.typicode.com/photos");
    const data = await response.json()
    res.json(data);
})

app.listen(PORT, () => {
    console.log("Server running");
})