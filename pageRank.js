var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/"
MongoClient.connect(url,function(err,db) {
    if (err) throw err;
    console.log("Created");
    var dbo = db.db("BDR");

    dbo.createCollection("Pages", function(err,res){
        if (err) throw err;
        console.log("Collection created");
    })
    //var collection = db.collection('SSSP');

    var graph = [
        {_id:"A", value: {pagerank:1, outlink_list:["B","C"]} },
        {_id:"B", value: {pagerank:1, outlink_list:["C"]} },
        {_id:"C", value: {pagerank:1, outlink_list:["A"]} },
        {_id:"D", value: {pagerank:1, outlink_list:["C"]} }
    ];

    dbo.collection("Pages").removeMany();
    dbo.collection("Pages").insertMany(graph, function(err,res){
        if (err) throw err;
        console.log("Number of nodes : " + res.insertedCount)
    });/*.then(function(result){})*/

    
    var map = function() {
        var page = this._id;
        var pagerank = this.value.pagerank;
        var outlink_list = this.value.outlink_list;

        for (var i=0, len=outlink_list.length; i<len; i++){
            var outlink = outlink_list[i];
            emit(outlink,pagerank/outlink_list.length);
        }
        //emit(page,this.value);
    };

    var reduce = function(page,values){
        //print("Reduce, key : " + page + " , values : "+ values);
        //var page = this._id;
        // var list = [];
        var outlink_list = [];
        var pagerank = 0;
        var damping = 0.85;
        
        for (var i=0, len=values.length; i<len; i++){
            //var list_item = values[i];
            if (values[i] instanceof Array) 
                outlink_list=values[i];
            else 
                pagerank += values[i];
        }
        pagerank = 1 - damping + ( damping*pagerank )
        emit(page,pagerank);
    };


    function pageRank(max) {
        for (var j=0, nb=max; j<nb ; j++) {
            console.log("Iteration n° " + j);
            dbo.collection("Pages").mapReduce(map,reduce, {out: "mapReduce"}, function(err,fin) {
                if (err) throw err
                console.log(dbo.listCollections());
            });
        }
        console.log("End");
        db.close;
    }

    pageRank(20);


    /*dbo.collection("Pages").mapReduce(map,reduce, {out: "map reduce page rank"}, function(err,fin) {
        if (err) throw err
        console.log("End");
        db.close;
    });*/
    







    
})
