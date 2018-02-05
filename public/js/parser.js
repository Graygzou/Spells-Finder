/**
 * @author : Grégoire Boiron <gregoire.boiron@gmail.com>
 * @version : 0.1.0
 */

//'http://www.tibia.com/community/?subtopic=worlds'

module.exports = function(websiteUrl) {
  interval: 1000,
  getSample: websiteUrl,
  get: websiteUrl,
  preview: 0,
  extractors: [
    {
      selector: '.TableContentContainer table.TableContent tr',
      callback: function(err, html, url, response){
        console.log('Crawled url:');
        console.log(url);
        // console.log(response); // If you need see more details about request 
        if(!err){
          data = {};
          data.world = html.children('td').eq(0).children('a').attr('href');
          if(typeof data.world == 'undefined'){
            delete data.world;
          }
          console.log(data);
        }else{
          console.log(err);
        }
      }
    }
  ]
}

//crawlerjs(worlds);