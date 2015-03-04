var filer = require('fs');	// the file-system library
var mkdirp = require('./mkdirp');

var exists = false;
var files;
var newFile = '';
var newPath = '';
var oldFile = '';
var path = require('path');	// path/file naming library
var sourceDir = process.argv[2];	// source directory passed via command-line argument
var stats;
var targetDir = process.argv[3];	// target directory passed via command-line argument
var thisMonth = '';
var thisTime;
var thisYear = '';

files = filer.readdirSync(sourceDir);

// sort the array by the modify-time
files.sort(function(a, b) {
	return filer.statSync(path.join(sourceDir, a)).mtime.getTime() - 
		filer.statSync(path.join(sourceDir, b)).mtime.getTime();
});

for (var I in files) {
	if (path.extname(files[I]) == '.csv') {
		oldFile = path.join(sourceDir, files[I]);
		stats = filer.statSync(oldFile);
		newFile = path.basename(files[I], '.csv');	// strip the file extension
		newFile = newFile.replace(/\d/g, '');	// strip numeric characters

		thisTime = stats.mtime || new Date();	// if the modify-time isn't available then use an arbitrary default

		newFile += thisTime.getUTCDate().toString() + '.csv';

		thisYear = thisTime.getUTCFullYear().toString();
		thisMonth = (thisTime.getUTCMonth() + 1).toString();

		newPath = path.join(targetDir, thisYear, thisMonth);
		newFile = path.join(newPath, newFile);

		contents = filer.readFileSync(oldFile).toString();
		exists = filer.existsSync(newFile);

		mkdirp.sync(newPath);
		if (exists) {
			filer.appendFileSync(newFile, contents);
			console.log('append', I, oldFile, newFile);
		} else {
			filer.writeFileSync(newFile, contents);
			console.log('write', I, oldFile, newFile);
		};
	}
}
