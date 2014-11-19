// polyglue.js


function polyglue(filepath, destPath){

  var _this = this;

  var $fs = require('fs');


  this.filepath = null;
  this.destPath = null;

  this.fileStub = null;
  this.fileDir = null;

  this.fileExt = null;
  this.fileTitle = null;

  this.fileJS = null;
  this.findCSS = null;

  this.matchJS = null;
  this.matchCSS = null;

  this.finalContent = null;



  this.spliceStr = function(str, index, count, add){
    return str.slice(0, index) + (add || "") + str.slice(index + count);
  };

  this.relativizeFilename = function(filename){
    if(filename[0] !== "/"){
      return this.fileDir + '/' + filename;
    }
    return filename;
  };


  this.getInitialFile = function(callback){
    $fs.readFile(this.filepath, 'utf8', function(err, content){
      if(!err){
        _this.finalContent = content;
        callback && callback(content);
      }else{
        console.log("ERROR: getInitialFile", err);
      }
    });
  };



  this.findMatch = function(toMatch, toSearch){
    console.log("TRYING TO MATCH:", toMatch);
    var match = toSearch.match(toMatch);
    if(match && match[0]){
      return {
        "match" : match[0],
        "filename" : match[2],
        "index" : match.index
      }
    }
    return false;
  };


  this.replace = function(matchObj, replacement){
    this.finalContent = this.spliceStr(this.finalContent, matchObj.index, matchObj.match.length, replacement);
  };


  this.replaceJSFile = function(callback){

    var getFile = this.relativizeFilename(this.matchJS.filename);

    console.log("About to replace JS File:", getFile);

    $fs.readFile(getFile, 'utf8', function(err, js){
      if(!err){
        var replacement = "<script>" + js + "</script>";
        _this.replace(_this.matchJS, replacement);
        callback && callback();
      }
      else{
        console.log("ERROR: replaceJSFile ", err);
      }
    });

  };


  this.replaceCSSFile = function(callback){

    var getFile = this.relativizeFilename(this.matchCSS.filename);

    console.log("About to replace CSS File:", getFile);

    $fs.readFile(getFile, 'utf8', function(err, css){
      if(!err){
        var replacement = "<style>" + css + "</style>";
        _this.replace(_this.matchCSS, replacement);
        console.log("FINAL");
        callback && callback();
      }
      else{
        console.log("ERROR: replaceCSSFile ", err);
      }
    });

  };



  this.findJSMatch = function(){
    return this.findMatch('<script(.*)?src="((.*)?' + this.fileJS + ')"(.*)?>(.*)?</script>', this.finalContent);
  };

  this.findCSSMatch = function(){
    return this.findMatch('<link(.*)?href="((.*)?' + this.fileCSS + ')"(.*)?/>', this.finalContent);
  };


  this.run = function(){
    
    console.log("ABOUT TO RUN!");

    this.getInitialFile(function(){

      _this.matchJS = _this.findJSMatch();
      _this.matchCSS = _this.findCSSMatch();

      // do js first, sinces its lower in file
      if(_this.matchJS && _this.matchJS.index > _this.matchCSS.index){
        _this.replaceJSFile(function(){
          _this.replaceCSSFile(_this.writeFile);
        });
      }

      // do css first (or JUST css), since its lower in file, or since js doesnt exist
      else if(_this.matchCSS){
        _this.replaceCSSFile(function(){
          if(_this.matchJS){
            _this.replaceJSFile(_this.writeFile);
          }
          else{
            _this.writeFile();
          }
        });
      }



    });

  };



  this.writeFile = function(){
    console.log("ABOUT to write to: ", _this.destPath);
    $fs.writeFile(_this.destPath, _this.finalContent, function(err){
      if(!err){
        console.log('file written!');
      }else{
        console.log('file not written');
      }
    });
  };


  this.construct = function(filepath, destPath){

    this.filepath = filepath;
    this.destPath = destPath || "polyglue.html";

    var filePieces = this.filepath.split('/');
    this.fileStub = filePieces.pop();
    this.fileDir = filePieces.join('/');

    var stubPieces = this.fileStub.split('.');
    this.fileExt = stubPieces.pop();
    this.fileTitle = stubPieces.join('.');

    this.fileJS = this.fileTitle + ".js";
    this.fileCSS = this.fileTitle + ".css";

    this.run();

  };


  if(filepath){
    return this.construct(filepath, destPath);
  }


};



module.exports = polyglue;












































