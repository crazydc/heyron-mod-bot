const { Client, GatewayIntentBits, Events, EmbedBuilder } = require('discord.js');
require('dotenv').config();

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});

// Command responses
const responses = {
  acc: {
    title: '📋 How to Get an Account',
    description: 'To get a Heyron account, visit **heyron.ai/signup**\n\nIf you need help, contact a mod in #support.',
  },
  ticket: {
    title: '🎫 How to Log a Ticket',
    description: 'To log a support ticket:\n• Go to **heyron.ai/support**\n• Or click "New Ticket" in your Heyron dashboard\n\nWe typically respond within 24 hours.',
  },
  tut: {
    title: '📚 Tutorials',
    description: 'Check out our documentation:',
    fields: [
      { name: 'Getting Started', value: 'heyron.ai/docs/start' },
      { name: 'API Setup', value: 'heyron.ai/docs/api' },
      { name: 'Troubleshooting', value: 'heyron.ai/docs/troubleshoot' },
    ],
  },
  ping: {
    title: '🏓 Pong!',
    description: 'Heyron Bot is alive and responding!',
  },
};

// Handle slash commands
client.on(Events.InteractionCreate, async (interaction) => {
  if (!interaction.isChatInputCommand()) return;

  const { commandName } = interaction;
  const response = responses[commandName];

  if (response) {
    const embed = new EmbedBuilder()
      .setTitle(response.title)
      .setDescription(response.description)
      .setColor(0x5865F2);

    if (response.fields) {
      embed.addFields(response.fields);
    }

    await interaction.reply({ embeds: [embed] });
  }
});

client.on(Events.ClientReady, () => {
  console.log(`🤖 Heyron Bot logged in as ${client.user.tag}`);
});

client.login(process.env.DISCORD_TOKEN);
