# Spells-Finder
Website developed for class [*Distributed Databases* **(8INF803)**](http://cours.uqac.ca/8INF803) at [UQAC](https://uqac.ca) (QC, CA).

The main objective is to use the MapReduce algorithm on a database (containing spells) to filter them and find the right one.

# Prerequisites

To be able to play with our application, you need to have both a [MongoDB](https://www.mongodb.com/) and a [SQlite](https://www.sqlite.org//index.html) databases available. Those twos services are already included into the application dependencies, but you need to install in into your desktop to be able to work properly.

To Launch a mongodb database, you need to create severals folders and execute some commands. Good tutorials can be found online. Once you settup MongoDB, you can go the bin folder and enter in the Windows command line :

`> mongod.exe`

If you install it properly, you should be able to see the "`Waiting for connections on port 27017`" message at the end.

**Debug Hint:** If you want to check what's inside the MongoDB database, you only have to start another Windows command line and enter `mongo` to access the MongoDB shell. Afterward, a wide set of commands are available [here](https://docs.mongodb.com/v3.0/tutorial/getting-started-with-the-mongo-shell/) to print data and execute queries.

# Getting started
Once you have pull the project, you first have to launch the server.
You have to open a Windows command line and enter the following command :

`> node server.js`

The server will be ready to receive clients requests. To do so, go to your favorite browser and visit *localhost:8080* webpage.

Don't forget to, sometimes, check the server console which will be printed inside the terminal. Right now, every time you refresh the webpage a new client request will be made to the server.

**Debug Hint:** Right now, the server doesn't update himself when you made changes. You have to manually restart the server to take in account your changes.

# Dependencies
The following list is all the node.js modules we installed to make our application works.
* [express](https://npmjs.com/package/express)
* [crawler](https://npmjs.com/package/crawler)
* [socket.io](https://npmjs.com:package/socket.io)
* [mongodb](https://www.npmjs.com/package/mongodb)
* [sqlite3](https://www.npmjs.com/package/sqlite3)

# Contributors
* [Grégoire Boiron](https://github.com/Graygzou)
* [Théo Le Donné](https://github.com/Theo-Le-Donne)
* [Florian Vidal](https://github.com/FlorianVidal66)
* [Théo Debay]
