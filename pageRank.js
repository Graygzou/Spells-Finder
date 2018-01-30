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
        {_id:"PageA", value: {pagerank:1, outlink_list:["B","C"]} },
        {_id:"PageB", value: {pagerank:1, outlink_list:["C"]} },
        {_id:"PageC", value: {pagerank:1, outlink_list:["A"]} },
        {_id:"PageD", value: {pagerank:1, outlink_list:["C"]} }
    ];

    dbo.collection("Pages").removeMany();
    dbo.collection("Pages").insertMany(graph, function(err,res){
        if (err) throw err;
        console.log("Number of nodes : " + res.insertedCount)
    });/*.then(function(result){})*/

    //pageRank(20);
    console.log("End");
    db.close;

    var map = function() {
        var page = this._id;
        var pagerank = this.pagerank;
        var outlink_list = this.outlink_list;

        for (var i=0, len=outlink_list.length; i<len; i++){
            var outlink = outlink_list[i];
            emit(outlink,pagerank/size(outlink_list));
        }
        emit(page,outlink_list);
        console.log("End Map");
    };

    var reduce = function(){
        var page = this._id;
        // var list = [];
        var outlink_list = [];
        var pagerank = 0;
        var damping = 0.85;

        for (var i=0, len=list.length; i<len; i++){
            var list_item = list[i];
            if (isArray(list_item)) 
                outlink_list=list_item;
            else 
                pagerank += list_item;
        }

        pagerank = 1 - damping + ( damping*pagerank )
        emit(page,outlink_list);
        console.log("End Reduce");
    };


    function pageRank(max) {
        for (var j=0, nb=max; j<nb ; j++) {
            console.log("Iteration n° " + j);
            dbo.collection("Pages").mapReduce(map,reduce, {out: {replace: "BDR"}});
        }
    }







    
})
