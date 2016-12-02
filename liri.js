// commands for liri:
// >my-tweets
// >spotify-this-song
// >movie-this
// >do-what-it-says

var dataKeys = require("./keys.js");
var fs = require('fs'); //file system
var twitter = require('twitter');
var spotify = require('spotify');
var request = require('request'); //used for OMDB

// --- get Tweets function --- //
var getTweets = function() {
  console.log('tweet function');
// --- creating new variable with constructor --- //
  var client = new twitter(dataKeys.twitterKeys);

  var params = { screen_name: 'jessienyasha', count: 20 };

  client.get('statuses/user_timeline', params, function(error, tweets, response) {

    if (!error) {
      var data = []; //empty array to hold data
      for (var i = 0; i < tweets.length; i++) {
        data.push({
            'created at: ' : tweets[i].created_at,
            'Tweets: ' : tweets[i].text,
        });
      }
      console.log(data);
      writeToLog(data);
    }
  });
};
// --- part of getMeSpotify function to return artist name --- //
var getArtistNames = function(artist) {
  return artist.name;
};
// --- getMeSpotify function --- //
var getMeSpotify = function(songName) {
// --- If function does not find a song, find the Ace of Base song "The Sign" ---//
  if (songName === undefined) {
    songName = 'The Sign';
  };

  spotify.search({ type: 'track', query: songName }, function(err, data) {
    if (err) {
      console.log('Error occurred: ' + err);
      return;
    }
// --- organize returned data ---//
    var songs = data.tracks.items;
    var data = []; //empty array to hold data

    for (var i = 0; i < songs.length; i++) {
      data.push({
        // .map function applies the function to every element in the array
        'artist(s)': songs[i].artists.map(getArtistNames),
        'song name: ': songs[i].name,
        'preview song: ': songs[i].preview_url,
        'album: ': songs[i].album.name,
      });
    }
    console.log(data);
    writeToLog(data);
  });
};
// --- getMeMovie function --- //
var getMeMovie = function(movieName) {
// --- default --- //
  if (movieName === undefined) {
      movieName = 'Mr Nobody';
  }
// AJAX call via npm package
  var urlHit = "http://www.omdbapi.com/?t=" + movieName + "&y=&plot=full&tomatoes=true&r=json";

  request(urlHit, function(error, response, body) {
    if (!error && response.statusCode == 200) {
      var data = [];
      var jsonData = JSON.parse(body);

      data.push({
      'Title: ' : jsonData.Title,
      'Year: ' : jsonData.Year,
      'Rated: ' : jsonData.Rated,
      'IMDB Rating: ' : jsonData.imdbRating,
      'Country: ' : jsonData.Country,
      'Language: ' : jsonData.Language,
      'Plot: ' : jsonData.Plot,
      'Actors: ' : jsonData.Actors,
      'Rotten Tomatoes Rating: ' : jsonData.tomatoRating,
      'Rotton Tomatoes URL: ' : jsonData.tomatoURL,
  });
      console.log(data);
      writeToLog(data);
}
  });

}
// --- doWhatItSays function --- //
var doWhatItSays = function() {
  fs.readFile("random.txt", "utf8", function(error, data) {
    console.log(data);
    writeToLog(data);
    var dataArr = data.split(',')

    if (dataArr.length == 2) {
      pick(dataArr[0], dataArr[1]);
    } else if (dataArr.length == 1) {
      pick(dataArr[0]);
    }

  });
}
// --- pick function takes in data from user input and runs appropriate function ---//
var pick = function(caseData, functionData) {
  switch (caseData) {
    case 'my-tweets':
      getTweets();
      break;
    case 'spotify-this-song':
      getMeSpotify(functionData);
      break;
    case 'movie-this':
      getMeMovie(functionData);
      break;
    case 'do-what-it-says':
      doWhatItSays();
      break;
    default:
      console.log('LIRI doesn\'t know that');
  }
}
// --- writeToLog function uses var fs to send test to log.txt ---//
var writeToLog = function(data) {
  fs.appendFile("log.txt", '\r\n\r\n');

  fs.appendFile("log.txt", JSON.stringify(data), function(err) {
    if (err) {
      return console.log(err);
    }

    console.log("log.txt was updated!");
  });
};

// --- sends index values to pick function ---//
var runThis = function(argOne, argTwo) {
  pick(argOne, argTwo);
};
// --- takes in index values of 2 and 3 --- //
runThis(process.argv[2], process.argv[3]);
