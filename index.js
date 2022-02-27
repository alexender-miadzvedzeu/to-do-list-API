const express = require('express');
const bodyParser = require('body-parser')
const app = express();
const PORT = 7777;
const path = require('path');

app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.get('/', (req, res) => {
  res.sendFile(`${__dirname}/public/index.html`)
});

app.listen(PORT, () => {
  console.log(`Application listening on port ${PORT}!`);
});

require('./modules/tasks')(app)