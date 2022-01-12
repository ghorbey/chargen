const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const http = require('http');
const terminate = require('./common/terminate');
const dataController = require('./controllers/data.controller');
const characterController = require('./controllers/Character.controller');
const userController = require('./controllers/User.controller');
const preferencesController = require('./controllers/Preferences.controller');

const app = express();
const port = process.env.PORT || 5001;
if (process.env.NODE_ENV !== 'production') {
  const cors = require('cors');
  app.use(cors());
}
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(characterController);
app.use(userController);
app.use(preferencesController);
app.use(dataController);

const server = http.createServer(app);

if (process.env.NODE_ENV === 'production') {
  // Serve any static files
  app.use(express.static(path.join(__dirname, 'client/build')));

  // Handle React routing, return all requests to React app
  app.get('*', function (req, res) {
    res.sendFile(path.join(__dirname, 'client/build', 'index.html'));
  });
}

const exitHandler = terminate(server, {
  coredump: false,
  timeout: 500
});

process.on('uncaughtException', exitHandler(1, 'Unexpected Error'));
process.on('unhandledRejection', exitHandler(1, 'Unhandled Promise'));
process.on('SIGTERM', exitHandler(0, 'SIGTERM'));
process.on('SIGINT', exitHandler(0, 'SIGINT'));

app.listen(port, () => console.log(`Listening on port ${port}`));