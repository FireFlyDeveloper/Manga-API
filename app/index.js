const express = require("express");
const app = express();
const routes = require("./routes");
const cors = require('cors');

app.use(express.json());
app.use("/api", routes);
app.use(cors());

const port = 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});