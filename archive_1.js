var fs = require('fs');
var mkdirp = require('./mkdirp');
var path = require('path');

var sourceDir = process.argv[2];	// source directory passed via command-line argument
var targetDir = process.argv[3];	// target directory passed via command-line argument

fs.readdir(sourceDir, function(error, files) {
	files.sort(function(a, b) {
		return fs.statSync(a).mtime > fs.statSync(b).mtime;
	});

	for (var I in files) {
		if (path.extname(files[I]) == '.csv') {
console.log(files[I]);
			
			fs.stat(files[I], function(error, stats) {
				oldFile = files[I];
				newFile = path.basename(files[I], '.csv');
				newFile = newFile.replace(/\d/g, '');

				thisTime = stats.mtime || new Date();

				newFile += thisTime.getUTCDate().toString();

				thisYear = thisTime.getUTCFullYear().toString();
				thisMonth = (thisTime.getUTCMonth() + 1).toString();
				newPath = path.join(targetDir, thisYear, thisMonth);
				newFile = path.join(newPath, newFile);

console.log(oldFile, newFile);

				mkdirp(newPath, function() {
					fs.readFile(oldFile, function(error, contents) {
						contents = contents.toString() || 'NO TEXT';
						fs.exists(newFile, function(error, doesExist) {
							if (doesExist) {
								fs.appendFileSync(newFile, contents);
								writeLogs(I, 'append', oldFile, newFile);
							} else {
								fs.writeFileSync(newFile, contents);
								writeLogs(I, 'write', oldFile, newFile);
							}
						});
					})
				})
			});
		}
	}
});

function writeLogs() {
	for (var X in arguments) console.log(X);
}
