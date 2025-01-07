const express = require("express");
const cors = require("cors");
const Redis = require("redis");

const app = express();
app.use(cors());

// Config Redis Client
const redisClient = Redis.createClient();
const DEFAULT_EXPIRATION = 3600;

const PORT = 3000;

const data = {
  name: "needhichozhan",
  age: 23,
  role: "developer",
};

// TEST
app.get("/", (req, res) => {
  res.send("Hello World");
});

app.get("/api/user", (req, res) => {
  res.json(data);
});

// JSONPLACEHOLDER API
app.get("/api/photos", async (req, res) => {
  try {
    // Check if photos are cached in Redis
    redisClient.get("photos", async (err, photos) => {
      if (err) {
        console.error("Redis error:", err);
        return res.status(500).json({ error: "Internal server error" });
      }

      if (photos) {
        return res.json(JSON.parse(photos));
      } else {
        const response = await fetch(
          "https://jsonplaceholder.typicode.com/photos"
        );

        if (!response.ok) {
          throw new Error("Server Error!");
        }

        const serverData = await response.json();

        redisClient.setEx(
          "photos",
          DEFAULT_EXPIRATION,
          JSON.stringify(serverData)
        );

        return res.json(serverData);
      }
    });
  } catch (e) {
    console.error("Error fetching photos:", e);
    res.status(500).json({ error: e.message });
  }
});

app.listen(PORT, () => {
  console.log("Server running");
});
