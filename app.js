require("dotenv").config();
const express = require("express");
const app = express();
const routes = require("./routes/index");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const morgan = require("morgan");
const { testDBConnection } = require('./config/config');

app.use(cors());
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// morgan: common, tiny, short, dev, combined
app.use(morgan('tiny'));
app.use("/", routes);

app.get("/", (req, res) => {
  res.send("Hello World!");
});

const allowedOrigins = process.env.ALLOWED_ORIGINS.split(',');

app.use(cors({
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) === -1) {
      const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  },
  credentials: true,
}));

testDBConnection();

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

module.exports = app;