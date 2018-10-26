var fs = require('fs');
var ocr = require('ng-ocr'); 

/*
 * Will display the filename and lines seperated by a \t from the train directory
 * run using: node train.js
 */
fs.readdirSync('./train/').forEach(function(file){
	ocr.decodeFile('./train/' + file, function(error, data){   
		if (error) console.error('Something went wrong decoding', error);
		console.log(file, "\t", data.split("\n").join("\t"));
	});
});
