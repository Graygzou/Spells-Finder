# Spells-Finder
Website developed for class [*Distributed Databases* **(8INF803)**](http://cours.uqac.ca/8INF803) at [UQAC](https://uqac.ca) (QC, CA).

The main objective is to use the MapReduce algorithm on a database (containing spells) to filter them and find the right one.

# Prerequisites

To be able to play with our application, you need to have both a [MongoDB](https://www.mongodb.com/) and a [SQlite](https://www.sqlite.org//index.html) databases available. Those twos services are already included into the application dependencies, but you need to install in into your desktop to be able to work properly.

To Launch a mongodb database, you need to create severals folders and execute some commands. Good tutorials can be found online. Once you settup MongoDB, you can go the bin folder and enter in the Windows command line :

`> mongod.exe`

If you install it properly, you should be able to see the "`Waiting for connections on port 27017`" message at the end.

------
**Debug Hint:** If you want to check what's inside the MongoDB database, you only have to start another Windows command line and enter `mongo` to access the MongoDB shell. Afterward, a wide set of commands are available [here](https://docs.mongodb.com/v3.0/tutorial/getting-started-with-the-mongo-shell/) to print data and execute queries.

# Getting started
Once you have pull the project, you first have to launch the server.
You have to open a Windows command line and enter the following command :

`> node server.js`

The server will be ready to receive clients requests. To do so, go to your favorite browser and visit `localhost:8080` webpage.

Here is the list of webpages that this application has :

* *index.html* : The main page that contains basic informations. Just a beautiful introduction of the subject.

* *choixBDD.html* : A page that offers the possibility to crawl a given site to get spells informations. Right now, only the [dxcontent](http://www.dxcontent.com/) website is available.

* *formulaire.html* : Let the user enter information to find the spell that he needs. This final page takes care of getting inputs from the user, process it, and print the results.

------
**Debug Hint:** Don't forget to, sometimes, check the server console which will be printed inside the terminal. Right now, every time you refresh the webpage a new client request will be made to the server.

Right now, the server doesn't update himself when you made changes. You have to manually restart the server to take in account your changes in any scripts.

## Map-Reduce
This application were made to learn the Map-Reduce algorithm and implements a small one. If you have no clue what's the Map-Reduce algorithm, you can take a look at this [blog](http://thejackalofjavascript.com/mapreduce-in-mongodb/) that describes exactly what we did to collect and filter spells.

## SQLite
We also used a SQLite database to validate our algorithm. A brief introduction to our schema and further explanations are available in the *.pdf* attach to the root of the project. Feel free to take a look at it.

# Documentation
If you still have questions about some aspects of this project, take a look at the *.pdf*. A quick tutorial is also available to make the application works properly. 

# Dependencies
The following list is all the node.js modules we installed to make our application works.
* [express](https://npmjs.com/package/express) : famous node.js framework that simplify development. 
* [crawler](https://npmjs.com/package/crawler) : module used to crawl webpages. it works with a queue of requests.
* [socket.io](https://npmjs.com:package/socket.io) : module used to allow communication between the client-side and the server-side. (mainly used to send spell information and events)
* [mongodb](https://www.npmjs.com/package/mongodb) : MongoDB module used to execute the Map-Reduce algorithm.
* [sqlite3](https://www.npmjs.com/package/sqlite3) : SQLite module used to validate the results obtained with the Map-Reduce approach.

# Contributors
* [Grégoire Boiron](https://github.com/Graygzou)
* [Théo Le Donné](https://github.com/Theo-Le-Donne)
* [Florian Vidal](https://github.com/FlorianVidal66)
