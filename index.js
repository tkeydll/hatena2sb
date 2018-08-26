var fs = require('fs');
var readline = require('readline');


var path = process.argv[2];
if (path == undefined)
{
    console.log("Usage: node index.js your_hatena_exported_file");
    console.log("");
    return;
}

var category = process.argv[3];

var reader = readline.createInterface({
    input: fs.createReadStream(path, 'utf8')
})

function CreateDocument()
{
    let o = new Object();
    o.title = '';
    o.lines = new Array();
    o.categories = new Array();
    return o;
}

var doc = new Object;
doc.pages = new Array();
var obj;
var isBody = false;

reader.on('line', (data) => {
    if (data.match('^(TITLE: )')) {
        obj = CreateDocument();
        obj.title = data.split(': ')[1];
        obj.lines.push(obj.title);
    }
    else if (data.match('^(BODY:)')) {
        isBody = true;
    }
    else if (data.match('^(COMMENT:)')) {
        obj.lines.push('');
        obj.lines.push('----');
        isBody = true;
    }
    else if (data.match('^(CATEGORY:)')) {
        obj.categories.push(data.split(': ')[1]);
    }
    else if (data.match('^(AUTHOR:)')) {}
    else if (data.match('^(IP:)')) {}
    else if (data.match('^(DATE:)')) {
        var date = data.split(': ')[1];
        
    }
    else if (data == '-----') {
        if (isBody == true) {
            isBody = false;
            // Add tag
            obj.lines.push('');
            obj.categories.forEach(element => {
                obj.lines.push('#' + element);
            });
        }
    }
    else if (data == '--------') {
        if (category == undefined) {
            doc.pages.push(obj);
        }
        else {
            if (obj.categories.includes(category)) {
                doc.pages.push(obj);
            }
        }
    }
    else {
        // Contents
        if (isBody == true) {
            obj.lines.push(data.trim());
        }
    }
});

reader.on('close', () => {
    var json = JSON.stringify(doc);
    console.log(json);
});
