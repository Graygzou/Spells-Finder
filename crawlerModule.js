/**
 * @author : Grégoire Boiron <gregoire.boiron@gmail.com>
 * @version : 0.1.0
 */

// import the specific package
var Crawler = require('crawler');
var fs = require('fs');

// Function that get the page and return Cheerio to crawl the HTML body
var crawlerPage = function(url) {
    console.log('URl : ' + url);
	var crawler = new Crawler({
		rateLimit: 100000000, // `maxConnections` will be forced to 1
		// This will be called for each crawled page
		callback : function (error, res, done) {
			if(error) {
				console.log(error);
			} else {
				var $ = res.$;
				// $ is Cheerio by default
				//a lean implementation of core jQuery designed specifically for the server
				//console.log($('body').find('script').eq(7).text());
				console.log($('.article-content').find('p').text());
				//console.log($('.article_center').find('p'));
				console.log($('.article-content').find('p').length);
				//fs.writeFileSync("monFichier", $('body').find('script').eq(7).text(), "UTF-8");
				//console.log($("table").text());
				//socket.emit('response', res.body);
				//console.log($("title").text());
			}
			done();
		}
	});
	crawler.queue(url);
}

// Export the function of the module
exports.crawlerPage = crawlerPage;