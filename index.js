#!/usr/bin/env node


if(process.argv.length > 2){

  var filepath = process.argv[2] || null;
  var destPath = process.argv[3] || null;

  // if user specified a filepath as the first argument
  // after "polyglue", run it on that file
  if(filepath){
    var $polyglue = require('./polyglue');
    var stick = new $polyglue(filepath, destPath);
  }

}

