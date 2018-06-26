import restify from "restify"
import * as builder from "botbuilder"
import azure from 'botbuilder-azure';
// Setting up the server
const server = restify.createServer()
server.listen(3978, () => {
  console.log("%s listening to %s", server.name, server.url)
})

// Create chat bot
const connector = new builder.ChatConnector({
  appId: "",
  appPassword: "",
})

var documentDbOptions = {
    host: '<Azure-DocumentDB-URI>', 
    masterKey: '<Azure-DocumentDB-Key>', 
    database: 'healthassistdocs',   
    collection: 'healthassistdata'		
};

var docDbClient = new azure.DocumentDbClient(documentDbOptions);
var cosmosStorage = new azure.AzureBotStorage({gzip:false}, docDbClient);

const bot = new builder.UniversalBot(connector).set('storage',cosmosStorage);

var luisAppUrl = "https://westus.api.cognitive.microsoft.com/luis/v2.0/apps/0906c5db-1a50-48cb-8988-676f354551d0?subscription-key=d3d4b77102dc4b07895c864325cb6820";
bot.recognizer(new builder.LuisRecognizer(luisAppUrl));





server.post("/api/messages", connector.listen())

// Handle the Hi intent
bot.dialog("Hi",function(session,args){
  session.send("Hey there");
}).triggerAction({
  matches:"Hi"
});

// Handle the How intent
bot.dialog("Get Nutrition",((session,args) => {
  var nutritions = ["fat","protein","carbohydrates","minerals","water","vitamins"];
 var nutrition_attr_obj = builder.EntityRecognizer.findEntity(args.intent.entities, 'nutrition attributes');
    var nutrition_attr = "noAttr";
    if (nutrition_attr_obj != null){
        nutrition_attr = nutrition_attr_obj.entity;

        if (nutritions.indexOf(nutrition_attr) == -1){
            nutrition_attr = "noAttr";
        }
    }
    session.beginDialog(nutrition_attr+"Nutrition")
}).triggerAction({
matches:"Get Nutrition"
}));

bot.dialog("noAttrNutrition", ((session,args)=>{
  session.endDialog("What nutrition attribute do you want to know about?");
})); 


// Handle the Exercise intent
bot.dialog("Get Workout Info",function(session,args){
  var intent = args.intent;
  var entity = builder.EntityRecognizer.findEntity(intent.entities, "exercise"); 

  if (entity){
      var exercise = entity.entity;
      
      if (exercise == "pushup" || exercise == "push up"){ 
          session.send("Put your hands about shoulder width apart. Put your shoulder down and back like you were trying to hold a tennis ball between your shoulder blades.");
      } else if (exercise == "pullup" || exercise == "pull up"){
          session.send("Grip the bar shoulder-width apart with straight arms. Pull yourself up by pulling your elbows to the floor. Keep pulling until your chin passes the bar. Lower yourself all the way down until your arms are straight. Then pull yourself up again.");
      }
  }
}).triggerAction({
  matches:"Get Workout Info"
});


// Handle the Thanks intent
bot.dialog("Thanks",function(session,args){
  session.send("You are welcome");
}).triggerAction({
  matches:"Thanks"
});

// Handle the Goodbye intent
bot.dialog("Bye",function(session,args){
  session.send("Bye");
}).triggerAction({
  matches:"Bye"
});

