var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/"
MongoClient.connect(url,function(err,db) {
    if (err) throw err;
    console.log("Created");
    var dbo = db.db("BDR");

    dbo.createCollection("Pages", function(err,res){
        if (err) throw err;
        console.log("Collection created");
        var graph = [
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
                print("-----Map-----");
                var page = this._id;
                var pagerank = this.value.pagerank;
                var outlink_list = this.value.outlink_list;

                print("Page", page);
                print("Pagerank", pagerank);
                print("List", outlink_list);

                //var value = {pagerank:pagerank, outlink_list: outlink_list}
                //emit(page,value);
                emit(page,outlink_list);

                for (var i=0, len=outlink_list.length; i<len; i++){
                    var outlink = outlink_list[i];
                    //var obj = {pagerank:1, outlink_list:["C"]};
                    print("outlink", tojson(outlink))
                    print("pagerank", tojson(pagerank/outlink_list.length));
                    emit(outlink,pagerank/outlink_list.length);
                    //var objet = {pagerank:pagerank/outlink_list.length, outlink_list: outlink_list};
                    //emit(outlink,objet);
                }

            };
        
            var reduce = function(page,values){
                print("-----Reduce-----");
                print("key : " , tojson(page));
                print("values : ", tojson(values));
                //var page = this._id;
                // var list = [];
                var outlink_list = [];
                var pagerank = 0;
                var damping = 0.85;
                var obj = {};
                
                for (var i=0, len=values.length; i<len; i++){
                    //var list_item = values[i];
                    print("values[i] : ", values[i]);
                    if (values[i] instanceof Array) {
                        print("Array ");
                        outlink_list=values[i];}
                    else {
                        print("Not Array ");
                        pagerank += values[i];
                    }
                }
                pagerank = 1 - damping + ( damping*pagerank );
                obj = {pagerank:pagerank, outlink_list: outlink_list}
                print("obj : " , tojson(obj));
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
        
            //pageRank(10);
            pageRank(1,21,function end() {
                console.log("End");
                db.close;
            });

        });//insertMany
    
    });//createCollection

});//connect


    //var collection = db.collection('SSSP');

    


    /*dbo.collection("Pages").mapReduce(map,reduce, {out: "map reduce page rank"}, function(err,fin) {
        if (err) throw err
        console.log("End");
        db.close;
    });*/


    /*function pageRank(max) {
                for (var j=0, nb=max; j<nb ; j++) {
                    console.log("Iteration n° " + j);
                    dbo.collection("Pages").mapReduce(map,reduce, {out: {replace: "Pages"}}, function(err,fin) {
                        if (err) throw err
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
                        
                    });
                }
                console.log("End");
                db.close;
            }*/
    
