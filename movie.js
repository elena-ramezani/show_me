var builder = require('botbuilder');
var movieProfile = require("./movie_data.json");


module.exports = [
function (session, args, next) {

        var genres = builder.EntityRecognizer.findEntity(args.intent.entities, "genres");

        if( genres !== undefined && genres!== null ){
            session.privateConversationData.genres = genres;
            next({response: genres});
        }else{
            session.replaceDialog('/');
        };
    },
    function(session, results){

        var genres = results.response.entity;
        
        if(session.privateConversationData.genres === undefined  || session.privateConversationData.genres=== null ){
            session.privateConversationData.genres = genres;
        };

        var profile = movieProfile.filter(function(obj){
                return obj.genres === genres ;
            })[0];
        var message = "name: %s \n\n genre: %s ";
        var link = 'https://en.wikipedia.org/wiki/' +profile["name"];
        //session.send(message, profile["name"], profile["genres"]);

        var reply = new builder.Message().address(session.message.address);

        reply.addAttachment(new builder.HeroCard(session)
                .title(genres.toUpperCase())
                .text(message, profile["name"], profile["genres"])
                .buttons([
                    builder.CardAction.openUrl(session, link, 'View Details')
                ])
        );
        session.send(reply);
        session.send("You may also ask me about it showtime.");
        session.endDialog();
    }
];

