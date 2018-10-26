var ocr = require('ng-ocr'); 
var http = require('http');
var https = require('https');


var args = process.argv.slice(2);
levelsMap = {
	'_MYrt':      'nocert',
	'_|.':        'newbie',
	'E_|__':      'explorer',
	'E_|_':       'enthusiast',
	'___la_|':    'pro',
	'_lnlrtrrt_': 'admin',
	's_.':        'sage',
};
if (args.length > 0) {
	ocr.decodeFile(args[0], function(error, data){   
		if (error) console.error('Something went wrong decoding', error);
		// get the 4th line, trim any whitespaces
		var level = data.split("\n")[3].trim();
		if (!levelsMap[level]) 
			console.warn('unknown level:', level);
		else
			console.log(levelsMap[level]);
	});
}
else {
	http.createServer(function (req, res) {
		var username = req.url.substr(1);
		if (username.length === 0) {
			res.write('invalid username');
			res.end();
			return;
		}
		https.get('https://ipv6.he.net/certification/create_badge.php?badge=1&pass_name='+username, function(response) {
			//console.log(response['Content-type']);
			if (response.headers['content-type'] === 'image/png') response.on('data', function (d) {
				ocr.decodeBuffer(d, function(error, data){   
					if (error) console.error('Something went wrong decoding', error);
					// get the 4th line, trim any whitespaces
					var level = data.split("\n")[3].trim();
					if (!levelsMap[level])  {
						console.warn('unknown level:', level);
						res.write('unknown');
					}
					else
						res.write(levelsMap[level]);
					res.end();
				});
			});
			else {
				res.write('no');
				res.end();
			}
		}).on('error', function (e) {
			res.write('unknown');
			res.end();
		});
	}).listen(8080);
	console.log('listening on port 8080');
}