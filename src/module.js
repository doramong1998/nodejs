var sqlite3 = require('sqlite3').verbose();
var fs = require('fs');
var dbFile = '../db.sqlite3';
var dbExists = fs.existsSync(dbFile);

if (!dbExists) {
    fs.openSync(dbFile, 'w');
}

var db = new sqlite3.Database(dbFile);

if (!dbExists) {
    console.log('--------------Bye---------------')
}
db.close();
