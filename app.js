var restify = require('restify');
var builder = require('botbuilder');
var math = require('math');
var mathjs = require('mathjs');
var jp = require('jsonpath');
var sys = require('sys'); 

// Setup Restify Server
var server = restify.createServer();
server.listen(process.env.port || process.env.PORT || 3978, function () {
   console.log('%s listening to %s', server.name, server.url); 
});
  
// Create chat connector for communicating with the Bot Framework Service
if (process.env.BotEnv !== "prod") {    
    require('dotenv-extended').load();
};
var connector = new builder.ChatConnector({
    appId: process.env.MicrosoftAppId,
    appPassword: process.env.MicrosoftAppPassword,
    stateEndpoint: process.env.BotStateEndpoint,
    openIdMetadata: process.env.BotOpenIdMetadata 
});
// Add this line to test locally;
server.post('/api/messages', connector.listen());

// Change to new endpoint
const LuisModelUrl = 'https://westus.api.cognitive.microsoft.com/luis/v2.0/apps/61af1be8-6944-4792-a97a-4c35d379d688?subscription-key=b72a520fefa2406495257b6bc09d5f65&spellCheck=true&verbose=true&timezoneOffset=-8.0';


/*----------------------------------------------------------------------------------------
* Today's date
* ---------------------------------------------------------------------------------------- */

var dateNow = new Date();
var dd = dateNow.getDate();
var monthSingleDigit = dateNow.getMonth() + 1,
    mm = monthSingleDigit < 10 ? '0' + monthSingleDigit : monthSingleDigit;
var yy = dateNow.getFullYear().toString().substr(2);
var formattedDate = mm + '/' + dd + '/' + yy;


/*----------------------------------------------------------------------------------------
* Create bot 
* ---------------------------------------------------------------------------------------- */

// Create your bot with a function to receive messages from the user
var bot = new builder.UniversalBot(connector); 
bot.on('conversationUpdate', function (message) {
    if (message.membersAdded) {
        message.membersAdded.forEach(function (identity) {
            if (identity.id === message.address.bot.id) {
                bot.send(new builder.Message()
                    .address(message.address)
                    .text("**Hello,  how can I help you?** \n \n \n **You may ask me:** \n \n \n show me list of comedy movies\n \n "));
            }
        });
    }
});

var recognizer = new builder.LuisRecognizer(LuisModelUrl);
bot.recognizer(recognizer);

var idks = ["I'm sorry, but I don't understand.",
"I'm sorry, but that question is beyond me. I'd happy to help you with questions related to your movie genres.",
"I'm sorry, I didn't get that. Please ask me about list  of movies"]


// Add dialogs
bot.dialog("/", function(session){
        var ikd = idks[Math.floor(Math.random()*idks.length)];
        session.send(ikd);
});

bot.dialog('movie', require('./movie')
).triggerAction({
    matches: 'movie'
});



