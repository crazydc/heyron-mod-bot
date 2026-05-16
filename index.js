const { Client, GatewayIntentBits, Events, EmbedBuilder, REST, Routes } = require('discord.js');
require('dotenv').config();

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});

// Role IDs that are allowed to use bot commands
// Add your mod role IDs here
const ALLOWED_ROLES = [
  '1505211482240188426', // Replace with your actual mod role IDs
];

// Command responses with clickable links
const responses = {
  acc: {
    title: '📋 How to Get an Account',
    description: 'To get a Heyron account, visit [heyron.ai/signup](https://heyron.ai/signup)\n\nIf you need help, contact a mod in #support.',
  },
  ticket: {
    title: '🎫 How to Log a Ticket',
    description: 'To log a support ticket:\n• Go to [heyron.ai/support](https://heyron.ai/support)\n• Or click "New Ticket" in your Heyron dashboard\n\nWe typically respond within 24 hours.',
  },
  tut: {
    title: '📚 Tutorials',
    description: 'Check out our documentation:',
    fields: [
      { name: 'Getting Started', value: '[heyron.ai/docs/start](https://heyron.ai/docs/start)' },
      { name: 'API Setup', value: '[heyron.ai/docs/api](https://heyron.ai/docs/api)' },
      { name: 'Troubleshooting', value: '[heyron.ai/docs/troubleshoot](https://heyron.ai/docs/troubleshoot)' },
    ],
  },
  ping: {
    title: '🏓 Pong!',
    description: 'Heyron Bot is alive and responding!',
  },
};

const commands = [
  { name: 'acc', description: 'How to get a Heyron account' },
  { name: 'ticket', description: 'How to log a support ticket' },
  { name: 'tut', description: 'List of tutorials and guides' },
  { name: 'ping', description: 'Check if bot is alive' },
];

const rest = new REST({ version: '10' }).setToken(process.env.DISCORD_TOKEN);

// Check if user has allowed role
function hasAllowedRole(member) {
  if (!member.roles) return false;
  const userRoles = member.roles.cache.map(r => r.id);
  return userRoles.some(roleId => ALLOWED_ROLES.includes(roleId));
}

async function registerCommands() {
  try {
    console.log('Registering slash commands...');
    await rest.put(
      Routes.applicationCommands(process.env.CLIENT_ID),
      { body: commands }
    );
    console.log('✅ Commands registered!');
  } catch (error) {
    console.error('Error registering commands:', error);
  }
}

client.on(Events.InteractionCreate, async (interaction) => {
  if (!interaction.isChatInputCommand()) return;

  // Check if user has allowed role
  const member = interaction.member;
  if (!hasAllowedRole(member)) {
    await interaction.reply({ content: '❌ You don\'t have permission to use this command.', ephemeral: true });
    return;
  }

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

client.on(Events.ClientReady, async () => {
  console.log(`🤖 Heyron Bot logged in as ${client.user.tag}`);
  await registerCommands();
});

client.login(process.env.DISCORD_TOKEN);
