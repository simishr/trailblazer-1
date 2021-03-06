var models = require('../models');
var unirest = require('unirest');
const routes = require('express').Router();



/*routes*/
module.exports = function(app) {
    app.get("/api/:latitude/:longitude", function(req, res) {
        console.log()
        var latitude = req.params.latitude;
        var longitude = req.params.longitude;
        unirest.get("https://trailapi-trailapi.p.mashape.com/?lat=" + latitude + "&limit=25&lon=" + longitude + "&q[activities_activity_type_name_eq]=hiking&radius=50")
            .header("X-Mashape-Key", "1EUZc9Yh0Dmsh3NULqLjzLCBf7rsp1iedcgjsnE14nUri24ZVA")
            .header("Accept", "text/plain")
            .end(function(result) {

                var trailList = result.body.places;

                var trails = [];
                if (trailList.length > 0) {
                    trailList.forEach(function(arrayItem) {
                        var trail = {
                            trail_name: arrayItem.activities[0].name,
                            description: arrayItem.activities[0].description,
                            distance: arrayItem.activities[0].length,
                            url: arrayItem.activities[0].url,
                            latitude: arrayItem.lat,
                            longitude: arrayItem.lon
                        }
                        trails.push(trail);
                    })
                } else {
                    var trail = {
                        trail_name: "There are no trails at this park!!",
                    }
                    trails.push(trail);
                }

                res.render("trails", { results: trails });

            });

    });

    app.post('/favorites', function(req, res) {
        db.User.find({ where: { username: req.username } }).then(function(user) {
            if (user) {
                db.UserFavorites.create({ username: req.body.username,fav_trail:req.body.trail_name}).then(function(fav) {
                   res.redirect("/trails")

                }).catch(function(err) {
                    res.redirect('/signup');
                });
            }
        });
    });
}
