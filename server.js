const express = require("express");
const http = require('http');
const path = require('path');
const app = express();
const cors = require("cors");
app.use(cors());
app.use(express.json());
const database = require("./database");
database.createTable();

app.use("/", express.static(path.join(__dirname, "public")));
app.post("/insert-type", async (req, res) => {
  const name  = req.body;
  console.log(name.name)
  if (!name) {
      return res.status(400).json({ result: "ko", error: "Name is required" });
  }

  try {
      await database.insertType(name.name);
      res.json({ result: "ok" });
  } catch (e) {
      res.status(500).json({ result: "ko" });
  }
});
app.get("/types", async (req, res) => {
  try {
      const list = await database.selectTypes();
      res.json(list);
  } catch (e) {
      res.status(500).json({ result: "ko" });
  }
});
app.post("/insert-booking", async (req, res) => {
  const booking = req.body.booking;
  console.log(booking)
  try {
    await database.insertBooking(booking);
    res.json({ result: "ok" });
  } catch (e) {
    res.status(500).json({ result: "ko"});
  }
});
app.get("/bookings", async (req, res) => {
  try {
    const list = await database.selectAllBookings();
    res.json(list);
  } catch (e) {
    res.status(500).json({ result: "ko" });
  }
});
app.get("/bookings/date/:date", async (req, res) => {
  try {
    const list = await database.selectBookingsByDate(req.params.date);
    res.json(list);
  } catch (e) {
    res.status(500).json({ result: "ko", error: e.message });
  }
});
app.delete("/delete-booking/:id", async (req, res) => {
  try {
    await database.deleteBooking(req.params.id);
    res.json({ result: "ok" });
  } catch (e) {
    res.status(500).json({ result: "ko", error: e.message });
  }
});
app.delete("/drop-tables", async (req, res) => {
  try {
    await database.dropTables();
    res.json({ result: "ok" });
  } catch (e) {
    res.status(500).json({ result: "ko", error: e.message });
  }
});
app.delete("/truncate-tables", async (req, res) => {
  try {
    await database.truncateTables();
    res.json({ result: "ok" });
  } catch (e) {
    res.status(500).json({ result: "ko", error: e.message });
  }
});

const server = http.createServer(app);
const port = 5600;
server.listen(port, () => {
  console.log("- server running on port: " + port);
});