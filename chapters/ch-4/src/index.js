import restify from "restify"
import * as builder from "botbuilder"

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

const bot = new builder.UniversalBot(connector);

var luisAppUrl = "https://westus.api.cognitive.microsoft.com/luis/v2.0/apps/0906c5db-1a50-48cb-8988-676f354551d0?subscription-key=d3d4b77102dc4b07895c864325cb6820";
bot.recognizer(new builder.LuisRecognizer(luisAppUrl));


server.post("/api/messages", connector.listen())

// Handle the Hi intent
bot.dialog("Hi",((session,args) => {
  session.send("Hey there");
}).triggerAction({
  matches:"Hi"
}));

// Handle the How intent
bot.dialog("Get Nutrition",((session,args)=>{
  session.send("It’s very nutritious");
}).triggerAction({
  matches:"Get Nutrition"
}));

// Handle the Exercise intent
bot.dialog("Get Workout Info",((session,args) => {
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
}));


// Handle the Thanks intent
bot.dialog("Thanks",((session,args)=>{
  session.send("You are welcome");
}).triggerAction({
  matches:"Thanks"
}));

// Handle the Goodbye intent
bot.dialog("Bye",((session,args)=>{
  session.send("Bye");
}).triggerAction({
  matches:"Bye"
}));

