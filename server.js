
// const http = require('http');
// const hostname = '127.0.0.1';
const port = 3000;
var express = require('express');
var path = require('path');
var webpack = require('webpack');
var webpackHotMiddleware = require('webpack-hot-middleware');
var webpackDevMiddleware = require("webpack-dev-middleware")
var config = require('./webpack.config');

var app = new express();
var compiler = webpack(config);

app.use(webpackHotMiddleware(compiler));

app.use(
  webpackDevMiddleware(compiler, {
    noInfo: true,
    publicPath: config.output.publicPath
  })
);
app.use(express.static(path.join(__dirname, 'public')));
app.get("/", function(req, res) {
  res.sendFile(__dirname + '/index1.html')
});
app.get("/index", function(req, res) {
  res.sendFile(__dirname + '/index.html')
});

app.get("/views/*", function(req, res) {
  res.sendFile(__dirname + req.originalUrl)
});
app.get("/js/*", function(req, res) {
  res.sendFile(__dirname + req.originalUrl)
});
app.get("/torrent/*", function(req, res) {
  res.sendFile(__dirname + req.originalUrl)
});
app.get("/dist/*", function(req, res) {
	console.log('dist====:', req.originalUrl);
  res.sendFile(__dirname + req.originalUrl)
});
app.get("/css/*", function(req, res) {
  res.sendFile(__dirname + req.originalUrl)
});


app.listen(port, 'demo.com', function(error) {
  if (error) {
    console.error(error)
  } else {
    console.info("==> 🌎  Listening on port %s. ", port)
  }
});
