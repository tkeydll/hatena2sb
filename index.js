
var fs = require('fs');
var readline = require('readline');

var path = process.argv[2];
if (path == undefined)
{
    console.log("Usage: node index.js your_hatena_exported_file");
    console.log("");
    return;
}

var reader = readline.createInterface({
    input: fs.createReadStream(path, 'utf8')
})

var doc = new Object;
doc.pages = new Array();
var obj;
var isBody = false;

reader.on('line', (data) => {
    if (data.match('^(TITLE: )')) {
        obj = new Object();
        obj.title = data.split(': ')[1];
        obj.lines = new Array();
        obj.lines.push(obj.title);
    }
    else if (data.match('^(BODY:)')) {
        isBody = true;
    }
    else if ((isBody == true) && (data == '-----')) {
        isBody = false;
    }
    else if (data == '--------') {
        doc.pages.push(obj);
    }
    else if (isBody == true) {
        obj.lines.push(data.trim());
    }
});

reader.on('close', () => {
    var json = JSON.stringify(doc);
    console.log(json);
});
