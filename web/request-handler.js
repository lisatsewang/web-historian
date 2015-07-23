var path = require('path');
var archive = require('../helpers/archive-helpers');
var urlParser = require('url');
var fs = require('fs');
var qs = require('querystring');

var actions = {
  "GET": function(req, res, fileName) {
    console.log(fileName);
    fs.readFile( fileName, function(err, content) {
      if(err) {
        exports.sendResponse(res, err.message, 404);
      } else {
        exports.sendResponse(res, content, 200);
      }
    });
  },
  "POST": function(req, res) {
    var body ='';
    var data;
    req.on('data', function(data) {
      body = body + data;

    });
    req.on('end', function(){
      data = JSON.parse(body);
      console.log("post: ", data);
      archive.addUrlToList(res, data.url + "\n");
      sendResponse(res, data.url, 302);
    });
  } 
};

exports.handleRequest = function (req, res) {

  var fileName = urlParser.parse(req.url).pathname;
  if(fileName === '/') {
    fileName = archive.paths.siteAssets +'/index.html';
  } else {
    fileName = archive.paths.archivedSites +'/' + fileName;
  }

  var action = actions[req.method];
  if(action) {
    action(req, res, fileName);
  }
};



exports.sendResponse = sendResponse = function(response, data, statusCode){
  statusCode = statusCode || 200;
  response.writeHead(statusCode);
  response.end(data);
};
