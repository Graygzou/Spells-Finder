/**
 * @authors : Gregoire Boiron <gregoire.boiron@gmail.com>, 
			  Theo Le Donne
 * @version : 0.1.0
 */
 
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

// Export module functions
exports.map = map;
exports.reduce = reduce;