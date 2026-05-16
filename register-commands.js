const { REST, Routes } = require('discord.js');
require('dotenv').config();

const commands = [
  { name: 'acc', description: 'How to get a Heyron account' },
  { name: 'ticket', description: 'How to log a support ticket' },
  { name: 'tut', description: 'List of tutorials and guides' },
  { name: 'ping', description: 'Check if bot is alive' },
];

const rest = new REST({ version: '10' }).setToken(process.env.DISCORD_TOKEN);

async function registerCommands() {
  try {
    console.log('Registering commands...');
    await rest.put(
      Routes.applicationCommands(process.env.CLIENT_ID),
      { body: commands }
    );
    console.log('✅ Commands registered!');
  } catch (error) {
    console.error('Error:', error);
  }
}

registerCommands();
