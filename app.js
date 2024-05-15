const express = require("express");

const morgan = require("morgan");
const cors = require("cors");
const createError = require("http-errors");
const userRoute = require("./Routes/userRoute");
const requestRoute = require("./Routes/requestRoute");
const imageRoute = require("./Routes/uploadImageRoute");
require("./Helpers/init_mongo");
require("dotenv").config();

const app = express();

app.use(morgan("dev"));
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use((err, req, res, next) => {
  res.status(err.status || 500).send({
    message: err.message,
    data: "",
    success: false,
  });
});
// app.use(`${process.env.Base_api}/auth`, authRoute);
app.use(`${process.env.Base_api}/user`, userRoute);
app.use(`${process.env.Base_api}/request`, requestRoute);
app.use(`${process.env.Base_api}/profile/image`, imageRoute);
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
