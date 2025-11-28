const express = require("express");
const cors = require('cors');
const app = express();
const PORT = 5000;


const authRoutes = require("./routes/authRoutes"); 
const bookingroutes = require('./routes/booking');
const tourRoutes = require("./routes/tourRoutes");
const profileRoutes = require("./routes/profileRoutes");
const managerRoutes = require("./routes/managerRoutes");



app.use(cors());
app.use(express.json());

// mounting routes here :
app.use("/auth", authRoutes);
app.use('/api', bookingroutes)
app.use("/tour", tourRoutes);
app.use("/profile1" , profileRoutes);
app.use("/manager" , managerRoutes);



app.get("/", (req, res) => {
  res.send("Hello from backend!");
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
