var express = require("express");
var extend = require("util")._extend;


var OPTIONS_LIST = [
    { id: "1", name: "Option 1" },
    { id: "2", name: "Option 2" },
    { id: "3", name: "Option 3" }
];

function base64Encode(ascii) {
    return new Buffer(ascii).toString("base64");
}

function base64Decode(base64) {
    return new Buffer(base64, "base64").toString("ascii");
}

function findOptionByIdInList(optionId, list) {
    for (var n = 0, m = list.length; n < m; n++) {
        if (list[n].id === optionId) {
            return n;
        }
    }
    return false;
}

function getOptionsFromCode(code) {
    var options = [];
    code = code.split("|");

    for (var n = 0, m = code.length; n < m; n++) {
        var pos = findOptionByIdInList(code[n], OPTIONS_LIST);
        if (pos !== false) {
            options.push(OPTIONS_LIST[pos]);
        }
    }
    return options;
    //return extend({}, OPTIONS_LIST);
}
function getAvailableOptions(currentOptions) {
    var options = [];

    for (var n = 0, m = OPTIONS_LIST.length; n < m; n++) {
        var pos = findOptionByIdInList(OPTIONS_LIST[n].id, currentOptions);
        if (pos === false) {
            options.push(OPTIONS_LIST[n]);
        }
    }
    return options;

    //return extend({}, OPTIONS_LIST);
}
function getUnavailableOptions(currentOptions) {
    var options = [];

    for (var n = 0, m = OPTIONS_LIST.length; n < m; n++) {
        var pos = findOptionByIdInList(OPTIONS_LIST[n].id, currentOptions);
        if (pos !== false) {
            options.push(OPTIONS_LIST[n]);
        }
    }
    return options;
}


var pub = __dirname + '/../public';

var app = express();
app.use(express.static(pub));


app.set('views', __dirname + '/../views');
app.set('view engine', 'jade');


app.get("/", function(req, res) {
    res.redirect("/product");
});


app.get("/product/:code?", function(req, res) {
    var rawCode = req.params.code || "fA==";
    var code = base64Decode(rawCode);
    var currentOptions = getOptionsFromCode(code);

    res.render('index', {
        product: { name: "test", options: currentOptions },
        availableOptions: getAvailableOptions(currentOptions),
        unavailableOptions: getUnavailableOptions(currentOptions),
        code: rawCode
    });
});

app.get("/product/:code/add/:option", function(req, res) {
    var rawCode = req.params.code || "fA==";
    var code = base64Decode(rawCode);
    code = code + "|" + req.params.option;
    res.redirect("/product/" + base64Encode(code));
});

app.get("/product/:code/remove/:option", function(req, res) {
    var rawCode = req.params.code || "fA==";
    var code = base64Decode(rawCode);
    code = code.replace("|" + req.params.option, "");
    res.redirect("/product/" + base64Encode(code));
});

// change this to a better error handler in your code
// sending stacktrace to users in production is not good
app.use(function(err, req, res, next) {
  res.send(err.stack);
});

var server = app.listen(8081, function() {
    console.log("Listening on port %d", server.address().port);
});