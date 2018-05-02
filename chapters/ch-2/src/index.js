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

const bot = new builder.UniversalBot(connector)

server.post("/api/messages", connector.listen())

bot.dialog("/", (session) => {
  // Edit more dialog here
  var message = session.message.text.toLowerCase();

  if (message == "hi"){
    session.send("Hey there");
  }else if (message == "thanks"){
    session.send("You are welcome");
  }else if (message == "goodbye"){
    session.send("Bye!");
  }else if (message == "how to do a pushup?"){
    session.send("Follow the standard procedure");
  }else if (message == "what is the fat content in a cheese burger?"){
    session.send("It is not very healthy");
  }else{
    session.send("Sorry, I could not understand that.");
  }
});
