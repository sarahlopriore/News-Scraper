var express = require("express");
var mongoose = require("mongoose");
var axios = require("axios");
var cheerio = require("cheerio");
var logger = require("morgan");
var bodyParser = require("body-parser");

var db = require("./models");

var PORT = process.env.PORT || 7500;

var app = express();

app.use(express.static("public"));
app.use(logger("dev"));
app.use(bodyParser.urlencoded({ extended: true }))


var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/News";

mongoose.connect(MONGODB_URI);


app.get("/scrape", function (req, res) {

    axios.get("https://www.bostonglobe.com/").then(function (response) {
        
        var $ = cheerio.load(response.data);

        
        $("div .story").each(function (i, element) {
            
            var result = {};
            var storyTitle =  $(this).children(".story-title").text().trim()
            if (!storyTitle) {
                return null;
            }
            result.title = storyTitle
            console.log("Title: " + result.title)

            storyLink = $(this).children(".story-title").children("a").attr("href");
            if (storyLink.includes("http")) {
                result.link = storyLink
            } else {
                result.link = "https://www.bostonglobe.com" + storyLink;
            }
            console.log("Link: " + result.link)

            storySummary = $(this).children(".excerpt").children("p").text().trim();
            console.log("Summary: " + storySummary);
            result.summary = storySummary;

            db.Article.create(result)
                .then(function (dbArticle) {
                    console.log(dbArticle);
                })
                .catch(function (err) {
                    return res.json(err);
                });
        });

        res.send("<a href='/'>Return to main page</a>");
    });
});


app.get("/articles", function (req, res) {
    db.Article.find({})
        .then(function (dbArticle) {
            res.json(dbArticle);
        })
        .catch(function (err) {
            res.json(err);
        });
});


app.get("/articles/:id", function (req, res) {
    db.Article.findOne({
            _id: req.params.id
        }).populate("comment").then(function (dbArticle) {
            res.json(dbArticle);
        })
        .catch(function (err) {
            res.json(err);
        });
});


app.post("/articles/:id", function (req, res) {
    db.Comment.create(req.body)
        .then(function (dbComment) {
            return db.Article.findOneAndUpdate({
                _id: req.params.id
            }, {
                comment: dbComment._id
            }, {
                new: true
            });
        })
        .then(function (dbArticle) {
            res.json(dbArticle);
        })
        .catch(function (err) {
            res.json(err);
        });
});


app.listen(PORT, function () {
    console.log("App running on port " + PORT)
})