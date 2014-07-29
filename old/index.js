var neo4j = require('neo4j');
var db = new neo4j.GraphDatabase('http://localhost:7474');
var async = require("async");

function bootstrap(c) {
	async.series([
		function (callback) {
			var query = [
				"CREATE (product:Product {data})",
				"RETURN product"
			].join("\n");
			var params = { data: { name: "Car" } };
			db.query(query, params, callback);
		},
		function (callback) {
                        var query = [
                                "CREATE (option:Option {data})",
                                "RETURN option"
                        ].join("\n");
                        var params = { data: { name: "Standard Wheels" } };
                        db.query(query, params, callback);
		}
	], function (err, results) {
		console.log("Finished");
		genericOutput(err, results);
		if (c) c();
	});
}

function wipe() {
	var query = [
//        	"REMOVE n:Product",
//		"REMOVE n:Option",
		"DELETE n"
	].join("\n");

	db.query(query, {}, genericOutput);
}

function genericOutput(err, results) {
	if (err) throw err;
	console.log(results);
}

bootstrap(wipe);

/*
var query = [
        "CREATE (user:User)",
        "RETURN user"
].join("\n");

db.query(query, function (err, results) {
        if (err) throw err;
        console.log(results);
});
*/


/*
// Get All Nodes
var query = [
	"MATCH (n)",
	"RETURN n"
].join("\n");

var params = {};

db.query(query, params, function (err, results) {
        if (err) throw err;
        console.log(results);
});
*/


/*
var data = {};
var node = db.createNode(data);
var query = [
	"CREATE (user:User {data})",
	"RETURN user"
].join("\n");
var params = { data: data };

// [ { user: { db: [Object], _request: [Object], _data: [Object] } } ]
db.query(query, params, function (err, results) {
	if (err) throw err;
	//var user = new User(results[0]['user']);
	//callback(null, user);
	console.log(results);
});
*/

/*
var query = [
  'START user=node({userId})',
  'MATCH (user) -[:likes]-> (other)',
  'RETURN other'
].join('\n');

var params = {
  userId: currentUser.id
};

db.query(query, params, function (err, results) {
  if (err) throw err;
  var likes = results.map(function (result) {
    return result['other'];
  });
  // ...
});

*/



