import restify from 'restify'
import * as builder from 'botbuilder'

// Setting up the server
const server = restify.createServer()
server.listen(3978, () => {
  console.log('%s listening to %s', server.name, server.url)
})

// Create chat bot
const connector = new builder.ChatConnector({
  appId: '',
  appPassword: '',
})

const bot = new builder.UniversalBot(connector)

server.post('/api/messages', connector.listen())

bot.dialog('/', (session) => {
  // Edit more dialog here
  session.send('You said: ' + session.message.text);
})
