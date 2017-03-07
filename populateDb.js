var fs = require('fs');
var models = require('./models');

models.sequelize.sync({force: true}).then(function() {

    fs.readFile('./playlists.json', function(err, data) {
        var music_data = JSON.parse(data);
        var playlists = music_data['playlists'];

        playlists.forEach(function(playlist) {
            //console.log(playlist);
            models.Playlist.create({
                name: playlist.name,
            })
            .then(function(playlistInstance){
              //console.log(playlistInstance);
              //console.log("part!!!!!!!"+JSON.stringify(playlist.songs));
              //console.log("after add!!!!!!!!!!!!!!!: " + JSON.stringify(playlistInstance));
              playlistInstance.addSong(playlist.songs)
              //console.log("after add: " + playlistInstance);
            })

        });
    });

    fs.readFile('./songs.json', function(err, data) {
        var music_data = JSON.parse(data);
        var songs = music_data['songs'];

        songs.forEach(function(song) {
            //console.log(song);
            models.Song.create({
                title: song.title,
                album: song.album,
                artist: song.artist,
                duration: song.duration,
            });
        });
    });

});
