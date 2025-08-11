const app = require("./app");
const mongoose = require("mongoose");
require("dotenv").config();
const cors = require("cors");
const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
