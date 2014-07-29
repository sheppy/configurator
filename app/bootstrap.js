var neo4j = require("neo4j");
var db = new neo4j.GraphDatabase("http://localhost:7474");
var async = require("async");


function createProduct(data, callback) {
    var query = [
        "CREATE (product:Product {data})",
        "RETURN product;"
    ].join("\n");

    var params = { data: data };
    db.query(query, params, callback);
}

function createOption(data, callback) {
    var query = [
        "CREATE (option:Option {data})",
        "RETURN option;"
    ].join("\n");

    var params = { data: data };
    db.query(query, params, callback);
}

function addOptionToProduct(productName, optionName, callback) {
    var query = [
        "MATCH (product:Product {product}), (option:Option {option})",
        "CREATE UNIQUE (option)-[r:AVAILABLE]->(product)",
        "RETURN r;"
    ].join("\n");

    var params = {
        product: {name: productName},
        option: {name: optionName}
    };
    db.query(query, params, callback);
}

function addIncompatability(option1Name, option2Name, callback) {
    var query = [
        "MATCH (option1:Option {option1}), (option2:Option {option2})",
        "CREATE UNIQUE (option1)-[r1:INCOMPATIBLE]->(option2)",
        "CREATE UNIQUE (option2)-[r2:INCOMPATIBLE]->(option1)",
        "RETURN r1, r2;"
    ].join("\n");

    var params = {
        option1: {name: option1Name},
        option2: {name: option2Name}
    };
    db.query(query, params, callback);
}



function bootstrap(c) {
    async.series([
        function (callback) {
            createProduct({ id: 1, name: "Car" }, callback);
        },

        // Add Wheels
        function (callback) {
            createOption({ id: 100, name: "Standard Wheels" }, callback);
        },
        function (callback) {
            createOption({ id: 101, name: "Sports Wheels" }, callback);
        },

        // Add Interiors
        function (callback) {
            createOption({ id: 200, name: "Red Interior" }, callback);
        },
        function (callback) {
            createOption({ id: 201, name: "Black Interior" }, callback);
        },
        function (callback) {
            createOption({ id: 202, name: "White Interior" }, callback);
        },

        // Add Exteriors
        function (callback) {
            createOption({ id: 300, name: "Red Exterior" }, callback);
        },
        function (callback) {
            createOption({ id: 301, name: "Black Exterior" }, callback);
        },
        function (callback) {
            createOption({ id: 302, name: "White Exterior" }, callback);
        },

        // Make options available for product
        function (callback) {
            addOptionToProduct("Car", "Standard Wheels", callback);
        },
        function (callback) {
            addOptionToProduct("Car", "Sports Wheels", callback);
        },
        function (callback) {
            addOptionToProduct("Car", "Red Interior", callback);
        },
        function (callback) {
            addOptionToProduct("Car", "Black Interio", callback);
        },
        function (callback) {
            addOptionToProduct("Car", "White Interior", callback);
        },
        function (callback) {
            addOptionToProduct("Car", "Red Exterior", callback);
        },
        function (callback) {
            addOptionToProduct("Car", "Black Exterior", callback);
        },
        function (callback) {
            addOptionToProduct("Car", "White Exterior", callback);
        },

        // Add incompatabilities
        function (callback) {
            addIncompatability("Red Interior", "Red Exterior", callback);
        }
    ], function (err, results) {
        console.log("Finished");
        genericOutput(err, results);
        if (c) c();
    });
}

function wipe() {
    var query = [
        //"REMOVE n:Product",
        //"REMOVE n:Option",
        "DELETE n;"
    ].join("\n");

    db.query(query, {}, genericOutput);
}

function genericOutput(err, results) {
    if (err) throw err;
    console.log(results);
}

bootstrap(wipe);
