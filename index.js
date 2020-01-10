const Discord = require('discord.js')
const config = require('./config')

async function playFile(connection, filePath) {
  return new Promise((resolve, reject) => {
    const dispatcher = connection.play(filePath)
    dispatcher.setVolume(0)
    dispatcher.on('start', () => {
      console.log('Playing')
    })
    dispatcher.on('end', () => {
      resolve()
    })
    dispatcher.on('error', (error) => {
      console.error(error)
      reject(error)
    })
  })
}

const discordClient = new Discord.Client()

discordClient.on('ready', () => {
  console.log(`Logged in as ${discordClient.user.tag}!`)
})

discordClient.on('message', message => {
	if (message.content === '!ping') {
		message.channel.send('Pong.');
	}
})

discordClient.on('presenceUpdate', async (oldPresence, newPresence) => {
  console.log('New Presence:')

  const member = newPresence.member
  const presence = newPresence
	const memberVoiceChannel = member.voice.channel
	
	// console.log(member.voice.channel)

  if (!presence || !memberVoiceChannel) {
    return
  }

	const connection = await memberVoiceChannel.join()

  await playFile(connection, 'audio/wrongChannelEn.mp3')

  // setTimeout(() => {
  //   memberVoiceChannel.leave()
  // }, 30000)

  connection.on('speaking', (user, speaking) => {
		if (speaking) {
			console.log(`Te violaron de chiquito ${user.username}?`);
			// console.dir(.send(`Te violaron de chiquito ${user.username}?`));
			user.presence.guild.channels
				.find(
					(channel) => channel.name === "general")
					.send(`Te violaron de chiquito ${user.username}?`
				);
    }
  })
})

discordClient.login(config.discordApiToken)