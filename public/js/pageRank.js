/**
 * @author : Theo Le Donne 
 * 
 * Execute "mongod" in a terminal then "node pageRank.js" in another terminal
 */


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

            var map = function() {
                var page = this._id;
                var pagerank = this.value.pagerank;
                var outlink_list = this.value.outlink_list;
                var linkPageRank = 0;

                /*print("-----Map-----");
                print("Page", page);
                print("Pagerank", pagerank);
                print("List", outlink_list);*/

                emit(page,outlink_list);

                for (var i=0, len=outlink_list.length; i<len; i++){
                    var outlink = outlink_list[i];
                    if (page!==outlink) var linkPageRank = pagerank/(outlink_list.length-1); //the default pageRank for the node itself is set to 0
                    //print("outlink", tojson(outlink))
                    //print("pagerank", tojson(linkPageRank));
                    emit(outlink,linkPageRank);

                }

            };
        
            var reduce = function(page,values){
                /*print("-----Reduce-----");
                print("key : " , tojson(page));
                print("values : ", tojson(values));*/

                var outlink_list = [];
                var pagerankSum = 0;
                var damping = 0.85;
                var nbOfNodes = this.insertedCount;
                var obj = {};
                
                for (var i=0, len=values.length; i<len; i++){
                    //print("values[i] : ", values[i]);
                    if (values[i] instanceof Array) {
                        outlink_list=values[i];}
                    else {                        
                        pagerankSum += values[i];
                    }
                }
                var newPageRank = 1 - damping + ( damping*pagerankSum );
                obj = {pagerank:newPageRank, outlink_list: outlink_list}
                //print("obj : " , tojson(obj));
                return obj;

            };

            function pageRank(i, max, end){
                dbo.collection("Pages").mapReduce(map,reduce, {out: {replace: "Pages"}}, function(err,fin) {
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
