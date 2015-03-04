var D;
var data = '';
var filename = '';
var fs = require('fs');

for (var X=0; X<10; ++X) {
	data = '';
	for (var Y=33; Y<91; ++Y) {
		D = new Date();
		data += String.fromCharCode(Y) + '"test",data,"for",' + D.getTime() + '\n';
	}
	filename = 'A' + X + '.csv';
	fs.writeFileSync(filename, data);
};


for (var X=0; X<10; ++X) {
	data = '';
	for (var Y=33; Y<91; ++Y) {
		D = new Date();
		data += String.fromCharCode(Y) + '"test",data,"for",' + D.getTime() + '\n';
	}
	filename = 'B' + X + '.csv';
	fs.writeFileSync(filename, data);
};
