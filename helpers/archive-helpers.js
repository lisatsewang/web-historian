var fs = require('fs');
var path = require('path');
var _ = require('underscore');
var requestHandler = require('../web/request-handler');
var httpRequest = require('http-request');

/*
 * You will need to reuse the same paths many times over in the course of this sprint.
 * Consider using the `paths` object below to store frequently used file paths. This way,
 * if you move any files, you'll only need to change your code in one place! Feel free to
 * customize it in any way you wish.
 */

exports.paths = paths = {
  siteAssets: path.join(__dirname, '../web/public'),
  archivedSites: path.join(__dirname, '../archives/sites'),
  list: path.join(__dirname, '../archives/sites.txt')
};

// Used for stubbing paths for tests, do not modify
exports.initialize = function(pathsObj){
  _.each(pathsObj, function(path, type) {
    exports.paths[type] = path;
  });
};

// The following function names are provided to you to suggest how you might
// modularize your code. Keep it clean!

exports.readListOfUrls = readListOfUrls = function(callback){
  fs.readFile(exports.paths.list, "utf8", function(err, content) {
    callback(content.split('\n'));
  })
};

exports.isUrlInList = isUrlInList = function(url, callback){
  var existUrlArray = readListOfUrls(function(array) {
    callback(array.indexOf(url) !== -1);
  });
};

exports.addUrlToList = function(url, callback){
  var writeStream = fs.createWriteStream(exports.paths.list,  {'flags': 'a'});
  writeStream.write(url);
  writeStream.end();
  callback();
};

exports.isUrlArchived = function(url, callback){
  fs.readdir(paths.archivedSites, function(err, files){
    callback(files.indexOf(url) !== -1);
  })
};

// exports.downloadUrls = function(urlArray){
//   for (var i = 0; i < urlArray.length; i++) {
//     var file = fs.createWriteStream(paths.archivedSites  + "/" + urlArray[i]);
//     var request = httpRequest.get(urlArray[i], function(response) {
//       response.pipe(file);
//     });
//   }

// };


exports.downloadUrls = function(list) {
  list.forEach(function(url){
    exports.isUrlArchived(url, function(exists){
      if(!exists) {
        httpRequest.get({url: url}, path.join(exports.paths.archivedSites, url), function() {});
      }
    });
  });
};

// var file = fs.createWriteStream("file.jpg");
// var request = http.get("http://i3.ytimg.com/vi/J---aiyznGQ/mqdefault.jpg", function(response) {
//   response.pipe(file);
// });







