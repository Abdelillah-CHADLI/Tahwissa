const express = require("express");
const cors = require('cors');
const app = express();
const PORT = 5000;


const authRoutes = require("./routes/authRoutes"); 
const bookingroutes = require('./routes/booking');
const tourRoutes = require("./routes/tourRoutes");
const profileRoutes = require("./routes/profileRoutes");
const managerRoutes = require("./routes/managerRoutes");
const reportRoutes = require("./routes/reportRoutes");
const verificationRoutes = require("./routes/verificationRoutes");
const pstroutes = require('./routes/postroutes');


app.use(cors());
app.use(express.json());

// mounting routes here :
app.use("/auth", authRoutes);
app.use('/api', bookingroutes)
app.use('/pst', pstroutes)
app.use("/tour", tourRoutes);
app.use("/profile1" , profileRoutes);
app.use("/manager" , managerRoutes);
app.use("/report" , reportRoutes);
app.use("/verification" , verificationRoutes);




app.get("/", (req, res) => {
  res.send("Hello from backend!");
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
