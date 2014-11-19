#!/usr/bin/env node


var filepath = process.argv[2] || null;

console.log(filepath, process.argv);

if(filepath){
  var $polyglue = require('./polyglue');
  var stick = new $polyglue(filepath);
}