/**
 * @author : Theo Le Donne
 *			 Gregoire Boiron <gregoire.boiron@gmail.com>
 * 
 * Execute "mongod" in a terminal then "node pageRank.js" in another terminal
 */

// Get the mapReduceModule
var mapReduce = require('./public/js/mapReduceModule');

var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/"
MongoClient.connect(url,function(err,db) {
    if (err) throw err;
    console.log("Created");
    var dbo = db.db("BDR");

    dbo.createCollection("Pages", function(err,res){
        if (err) throw err;
        console.log("Collection created");
        var graph = [ // Each outlink list of a node contains the node itself in order to execute the reduce function properly
            // but is not used for the pageRank calculation
            {_id:"A", value: {pagerank:1, outlink_list:["A","B","C"]} },
            {_id:"B", value: {pagerank:1, outlink_list:["B","C"]} },
            {_id:"C", value: {pagerank:1, outlink_list:["C","A"]} },
            {_id:"D", value: {pagerank:1, outlink_list:["D","C"]} }
        ];
    
        dbo.collection("Pages").removeMany();
        dbo.collection("Pages").insertMany(graph, function(err,res){
            if (err) throw err;
            console.log("Number of nodes : " + res.insertedCount)

            function pageRank(i, max, end){
                dbo.collection("Pages").mapReduce(mapReduce.map, mapReduce.reduce, {out: {replace: "Pages"}}, function(err,fin) {
                    if (err) throw err
                    if (i==max) end();
                    
                    else {
                        console.log("  ");
                        console.log("  ");
                        console.log("Iteration n° " + i);
                        fin.findOne({"_id" : "A"}, function(err, result){
                            console.log(result);
                        });
                        fin.findOne({"_id" : "B"}, function(err, result){
                            console.log(result);
                        });
                        fin.findOne({"_id" : "C"}, function(err, result){
                            console.log(result);
                        });
                        fin.findOne({"_id" : "D"}, function(err, result){
                            console.log(result);
                        });
                        console.log("  ");
                        pageRank(i+1,max,end);
                    }
                });

            }
        
            pageRank(0,21,function end() {
                console.log("End");
                db.close;
            });

        });//insertMany
    
    });//createCollection

});//connect
