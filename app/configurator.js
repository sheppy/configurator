var express = require("express");


function base64Encode(ascii) {
    return new Buffer(ascii).toString("base64");
}

function base64Decode(base64) {
    return new Buffer(base64, "base64").toString("ascii");
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
    var code = base64Decode(req.params.code || "");
    res.render('index', {
        product: { name: "test", options: [] },
        availableOptions: [],
        unavailableOptions: [],
        code: code
    });
});

app.get("/product/:code/add/:option", function(req, res) {
    var code = base64Decode(req.params.code);
    res.redirect("/product/" + base64Encode(code));
});

app.get("/product/:code/remove/:option", function(req, res) {
    var code = base64Decode(req.params.code);
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