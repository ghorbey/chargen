const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const characterController = require('./controllers/Character.controller');
const userController = require('./controllers/User.controller');
const preferencesController = require('./controllers/Preferences.controller');

const app = express();
const port = process.env.PORT || 5000;

if (process.env.NODE_ENV !== 'production') {
  const cors = require('cors');
  app.use(cors());
}
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(characterController);
app.use(userController);
app.use(preferencesController);

if (process.env.NODE_ENV === 'production') {
  // Serve any static files
  app.use(express.static(path.join(__dirname, 'client/build')));

  // Handle React routing, return all requests to React app
  app.get('*', function (req, res) {
    res.sendFile(path.join(__dirname, 'client/build', 'index.html'));
  });
}

app.listen(port, () => console.log(`Listening on port ${port}`));