// Import the http library
var http = require('http');
var fs = require('fs');
var express = require('express');
var models = require('./models');
var bodyParser = require('body-parser')


// Create a server and provide it a callback to be executed for every HTTP request
// coming into localhost:3000.


var getplaylist = function(request,response){
	response.statusCode = 200;
    response.setHeader('Content-Type', 'text/html');
    response.setHeader('Cache-Control', 'max-age=1800');
		//console.log("playlist display");
    fs.readFile(__dirname + '/playlist.html', function(err,data){
    	response.end(data);
    });
}
var getStylesheet = function(request,response){
	response.statusCode=200;
	response.setHeader('Content-Type', 'text/css');
	response.setHeader('Cache-Control', 'max-age=1800');
    fs.readFile(__dirname + '/playlist.css', function(err,data){
    	response.end(data);
    });
}
var getRedirect = function(request,response){
	response.statusCode = 302;
    response.setHeader('Location','/playlists');
    response.setHeader('Cache-Control', 'max-age=1800');
    response.end();
}
var getMusicApp =function(request,response){
	response.statusCode=200;
	response.setHeader('Content-Type', 'text/javascript');
	response.setHeader('Cache-Control', 'max-age=1800');
    fs.readFile(__dirname + '/music-app.js', function(err,data){
    	response.end(data);
    });
}


//old one- direct from JSON file
// var getSongApi= function(request,response){
// 	var obj;
// 	response.statusCode=200;
// 	response.setHeader('Content-Type', 'text/json');
// 	fs.readFile(__dirname +'/songs.json','utf8',function(err,data){
//
// 		obj=JSON.stringify(JSON.parse(data));
//
// 		response.end(data);
// 	});
// };
// var getPlaylistsApi= function(request,response){
// 	var obj;
// 	response.statusCode=200;
// 	response.setHeader('Content-Type', 'text/json');
// 	fs.readFile(__dirname +'/playlists.json','utf8',function(err,data){
// 		//obj=JSON.stringify(JSON.parse(data));
// 		response.end(data);
// 	});
// };

// from database
var getPlaylistsApi= function(request,response){

	var array=[];
	var file=[];
	var count=0;
	var count2=0;
	var store=[];
	models.Playlist.findAll({
		attributes:['id','name']
	}).then(function(playlists){
			playlists.forEach(function(playlistInstance){
				//{attributes:['id'],joinTableAttributes:[]}
				//console.log("getPlaylistinstance!!!!!!!!!!!!!!!!!!: "+JSON.stringify(playlistInstance));
				store=[];
				playlistInstance.getSongs().then(function(songs){
					//console.log("!!!!!!!!!"+songs);
					//console.log("getsongs!!!!!!!!!!!!!!!!!!: "+JSON.stringify(songs));
					//console.log("getPlaylistinstance!!!!!!!!!!!!!!!!!!: "+JSON.stringify(playlistInstance));
					if (JSON.stringify(songs) === '[]'){
						store.push(playlistInstance.getDataValue('id'));
						//console.log("id pushed "+playlistInstance.getDataValue('id'));
					}

					array=[];
					var i=0;
					songs.forEach(function(songInstance){
						var output=songInstance.getDataValue('id');
						//console.log("empty array~~~~~~~!!!!" + output);
						//console.log("songInstance!!!!!!"+songInstance);
						//console.log("songs!!!!~~~!"+JSON.stringify(songInstance));
						i++;
						array.push(output);
					})

					// var tmp=JSON.stringify(playlistInstance);
					// var tmp2= tmp.substring(0,tmp.length-1);
					//
					// console.log("in the loop playlistInstance"+(count+1));
					// console.log("know id !!!!!!!!!!!"+playlistInstance.getDataValue('id'));
					//
					// if (playlistInstance.getDataValue('id') === (count+1) ){
					// 	file.push(tmp2);
					// 	file.push('"songs":['+array+']}');
					// 	count2++;
					// 	console.log(count2);
					// }
					// else{
					// 	for(var j=0;j<store.length;j++){
					// 		console.log("in the  store loop");
					// 		if(store[j] === (count+1)){
					// 			console.log(store[j]+" and " + (count+1));
					// 			file.push(tmp2);
					// 			file.push('"songs":['+array+']}');
					// 			count2++;
					// 			console.log(count2);
					// 			store.splice(j, 1);
					// 		}
					// 		else if (store[j] !== (count+1)){
					// 			console.log(store[j]+" different "+(count+1));
					// 		}
					// 	}
					// 	console.log("know array store "+store);
					// }

					var tmp=JSON.stringify(playlistInstance);
					//console.log("know id !!!!!!!!!!!"+playlistInstance.getDataValue('id'));
					var tmp2= tmp.substring(0,tmp.length-1);
					file.push(tmp2);
					file.push('"songs":['+array+']}');
					count2++;

					//count++;
					if (playlists.length === count2){
							response.end('{"playlists":['+file+"]}");
					};
				})
			})
		})
}

var getSongApi=function(request,response) {
	response.statusCode=200;
	response.setHeader('Content-Type', 'text/json');
	models.Song.findAll()
			.then(function(songs) {
					response.end('{"songs":'+JSON.stringify(songs.map(function(song){
							return song.get({plain: true})
					}))+"}");

			})
}

var postPlaylistsApi=function(request,response){
	models.Playlist.create({
		name:request.body.name
	})
	.then(function(playlistInstance){
		playlistInstance.addSong(request.body.songs);
		//console.log("after add!!!!!!!!!!!!!!!: " + JSON.stringify(playlistInstance));
		//console.log("request.body.songs!!!!!!!!!!!!!:"+JSON.stringify(request.body.songs));
		response.end(JSON.stringify(playlistInstance));
	})
	//getPlaylistsApi(request,response);
}

//post songs to playlists
var postAddSong= function(request,response){
	//console.log("id!!!!!!!!!!!!!"+ request.params['id']);
	models.Playlist.findOne({
		where: {
			id: request.params['id']
		}
	})
	.then(function(playlist){
		playlist.addSong(request.body.songs);
		//console.log("after add!!!!!!!!!!!!!!!: " + JSON.stringify(playlist));
		//console.log("request.body.songs!!!!!!!!!!!!!:"+request.body.songs);
		response.end(JSON.stringify(playlist));
		})
	//console.log("finnish!!!!!!");
	//getPlaylistsApi(request,response);
}

var deleteSong =function(request,response) {
	//console.log("id!!!!!!!!!!!!!"+ request.params['id']);
	models.Playlist.findOne({
		where: {
			id: request.params['id']
		}
	})
	.then(function(playlist){
		playlist.removeSong(request.body.songs);
		//console.log("after add!!!!!!!!!!!!!!!: " + JSON.stringify(playlist));
		//console.log("request.body.songs!!!!!!!!!!!!!:"+request.body.songs);
		})
	//console.log("finnish!!!!!!");
	getPlaylistsApi(request,response);
}



var server=express();
server.use(bodyParser.json());       // to support JSON-encoded bodies
server.use(bodyParser.urlencoded({   // to support URL-encoded bodies
    extended: true
}));
server.delete('/playlists/:id',function(request,response){
	deleteSong(request,response);
});

server.post('/api/playlists/:id',function(request,response){
	postAddSong(request,response);
});

server.post('/api/playlists',function(request,response){
	postPlaylistsApi(request,response);
});

server.get('/playlists',function(request,response){
	response.statusCode=200;
	response.setHeader('Content-Type', 'text/json');
	getplaylist(request,response);
});

server.get('/playlist.css',function(request,response){
	getStylesheet(request,response);
});

server.get('/',function(request,response){
	getRedirect(request,response);
});

server.get('/library',function(request,response){
	getplaylist(request,response);
});

server.get('/search',function(request,response){
	getplaylist(request,response);
});

server.get('/music-app.js',function(request,response){
	getMusicApp(request,response);
});

server.get('/api/playlists',function(request,response){
	getPlaylistsApi(request,response);
});

server.get('/api/songs',function(request,response){
	getSongApi(request,response);
});






// Start the server on port 3000
//models.sequelize.sync().then(function() {
	server.listen(3000, function() {
	    console.log('Amazing music app server listening on port 3000!')
	});
//});
