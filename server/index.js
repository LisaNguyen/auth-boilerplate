const express = require('express');
const http = require('http');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const morgan = require('morgan');
const router = require('./router');
const config = require('./config');

// DB setup
const URI = `mongodb+srv://${config.mongoDbPassword}:${config.mongoDbPassword}@cluster0.2r0fr.mongodb.net/auth?retryWrites=true&w=majority`;
mongoose.connect(URI, { useNewUrlParser: true, useUnifiedTopology: true });

// APP setup
const app = express();
app.use(morgan('combined'));
app.use(bodyParser.json({ type: '*/*' }));
router(app);

// SERVER setup
const PORT = process.env.PORT || 8080;

// create a HTTP server that knows how to receive reqs and forward to app
const server = http.createServer(app);

server.listen(PORT);
console.log('Listening on port: ', PORT);