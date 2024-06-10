const express = require('express');
const app = express();
const routes = require('./routes/index');


app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/', routes);

app.get("/", (req, res) => {
  res.send("Hello World!")
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

module.exports = app;
