var Tweet = require('../models/Tweet');

module.exports = function(stream, io) {

  stream.on('data', function(data) {

    // When tweets get sent our way ...
    var tweet = {
      twid: data.id,
      active: false,
      author: data.user.name,
      avatar: data.user.profile_image_url,
      body: data.text,
      date: data.created_at,
      screenname: data.user.screen_name
    };

    // Create a new model instance with our object
    var tweetEntry = new Tweet(tweet);

    // Save it!
    tweetEntry.save(function(err){
      if (!err) {
        io.emit('tweet', tweet);
      }
    });

  });

};