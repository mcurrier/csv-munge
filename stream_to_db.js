var csv = require('csv-streamify');
var flatfile = require('flat-file-db');
var fs = require('fs');
var path = require('path');

var csvToJson = csv({objectMode: true});
var inputPath = process.argv[2];
var Transform = require('stream').Transform;

var dbName = inputPath.replace(/\d/g,'');
var dbPath = path.join('.', 'db', dbName) + '.db';
var outputPath = path.join('.', 'External', dbName);

var db = flatfile(dbPath);
var inputStream = fs.createReadStream(inputPath);
var outputStream = fs.createWriteStream(outputPath);
var parser = new Transform({objectMode: true});

parser._transform = function(data, encoding, done) {
	var key;
	var record;

	if (data[0] != '"VarName"') {
		key = data[0] + data[1];
		record = {
			value: data[3],
			valid: data[4],
			ms: data[5]
		};

		this.push(data);
		db.put(key, record, function() {
			done();
		});
	}
};

db.on('open', function() {
	inputStream
	.pipe(csvToJson)
	.pipe(parser);
});

parser.on('drain', function() {
	var data = {};
	var keys = db.keys();
	var record = [];

	for (var I in keys) {
		record[0] = keys[I];
		data = db.get(keys[I]);
		record[1] = data.valid;
		record[2] = data.value;
		record[3] = data.ms;

		outputStream.write(record.join(','));
	}

	db.close();
});

db.on('close', function() {
	console.log('records written');
});
