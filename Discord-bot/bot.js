const fs = require('fs');
const {
  Client,
  GatewayIntentBits,
  Partials,
  EmbedBuilder,
  ButtonBuilder,
  ButtonStyle,
  ActionRowBuilder,
  ModalBuilder,
  TextInputBuilder,
  TextInputStyle,
  ChannelType,
  PermissionsBitField,
} = require('discord.js');

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMessageReactions,
    GatewayIntentBits.GuildMembers,
  ],
  partials: [Partials.Message, Partials.Reaction],
});

// Constants
const CATEGORY_ID = '1300372341348972596'; // Replace with your category ID
const CHANNEL_ID = '13003763323201484359'; // Replace with your channel ID
const LOGO_PATH = './image1.jpeg'; // Ensure the logo file is in the same directory
const LOG_FILE = './bot.txt'; // Log file to record bot activity
const TICKET_FILE = './ticket.txt'; // File to save ticket details

// Allowed User IDs to close tickets
const ALLOWED_CLOSERS = [
  '124947930676263027', // Replace with valid Discord user IDs
  '234567890123456789',
  '345678901234567890',
  '456789012345678901',
  '567890123456789012',
];

// Helper function to write logs to file
function logToFile(message) {
  const timestamp = new Date().toLocaleString();
  const logMessage = `[${timestamp}] ${message}\n`;
  fs.appendFile(LOG_FILE, logMessage, (err) => {
    if (err) console.error('Error writing to log file:', err);
  });
}

// Helper function to save ticket details to ticket.txt
function saveTicketDetailsToFile(ticketDetails) {
  const timestamp = new Date().toLocaleString();
  const ticketLog = `
Timestamp: ${timestamp}
Ticket Number: ${ticketDetails.ticketNumber}
User: ${ticketDetails.user}
Registration Number: ${ticketDetails.registrationNumber}
Department: ${ticketDetails.department}
Year: ${ticketDetails.year}
Drive URL: ${ticketDetails.driveUrl}
About the Post: ${ticketDetails.aboutPost}
-----------------
`;

  fs.appendFile(TICKET_FILE, ticketLog, (err) => {
    if (err) {
      console.error('Error writing ticket details to file:', err);
    }
  });
}

client.once('ready', () => {
  console.log(`Logged in as ${client.user.tag}`);
});

client.on('messageCreate', async (message) => {
  if (message.content === '!applymessage' && message.channel.id === CHANNEL_ID) {
    const embed = new EmbedBuilder()
      .setTitle('Post On Social Platforms')
      .setDescription('Contribute any cyber-related content/news for Whitehatians social media')
      .setColor('Blue')
      .addFields(
        { name: 'Accepted Content', value: 'Content must be related to Technology or Cyber Security.', inline: false },
        { name: 'Type of Content', value: 'Posts, reels, and videos', inline: false },
        { name: 'Social Platforms', value: 'Instagram, Facebook, and YouTube', inline: false },
        { name: 'Note', value: 'Share knowledge here, and we’ll make a post for you.', inline: false }
      )
      .setFooter({
        text: `Whitehatians Srmvec • ${new Date().toLocaleString()}`,
        iconURL: 'attachment://image1.jpeg',
      });

    const row = new ActionRowBuilder()
      .addComponents(
        new ButtonBuilder()
          .setCustomId('post_on_insta')
          .setLabel('Post On Insta')
          .setStyle(ButtonStyle.Success)
          .setEmoji('📸'),
        new ButtonBuilder()
          .setCustomId('post_on_youtube')
          .setLabel('Post On YouTube')
          .setStyle(ButtonStyle.Danger)
          .setEmoji('🎥')
      );

    await message.channel.send({ embeds: [embed], components: [row], files: [LOGO_PATH] });
  }
});

client.on('interactionCreate', async (interaction) => {
  if (interaction.isButton()) {
    if (interaction.customId === 'post_on_insta' || interaction.customId === 'post_on_youtube') {
      const modal = new ModalBuilder()
        .setCustomId('submission_form')
        .setTitle('Submit Your Post Details');

      const registrationInput = new TextInputBuilder()
        .setCustomId('registration_number')
        .setLabel('Registration Number')
        .setStyle(TextInputStyle.Short)
        .setPlaceholder('Enter your registration number')
        .setRequired(true);

      const departmentInput = new TextInputBuilder()
        .setCustomId('department')
        .setLabel('Department')
        .setStyle(TextInputStyle.Short)
        .setPlaceholder('Enter your department')
        .setRequired(true);

      const yearInput = new TextInputBuilder()
        .setCustomId('year')
        .setLabel('Year')
        .setStyle(TextInputStyle.Short)
        .setPlaceholder('Enter your year')
        .setRequired(true);

      const driveUrlInput = new TextInputBuilder()
        .setCustomId('drive_url')
        .setLabel('Drive URL')
        .setStyle(TextInputStyle.Short)
        .setPlaceholder('Enter the URL of your drive (e.g., for resources)')
        .setRequired(true);

      const aboutPostInput = new TextInputBuilder()
        .setCustomId('about_post')
        .setLabel('About the Post')
        .setStyle(TextInputStyle.Paragraph)
        .setPlaceholder('Describe the content of the post you want to share')
        .setRequired(true);

      modal.addComponents(
        new ActionRowBuilder().addComponents(registrationInput),
        new ActionRowBuilder().addComponents(departmentInput),
        new ActionRowBuilder().addComponents(yearInput),
        new ActionRowBuilder().addComponents(driveUrlInput),
        new ActionRowBuilder().addComponents(aboutPostInput)
      );

      await interaction.showModal(modal);
    }
  } else if (interaction.isModalSubmit()) {
    if (interaction.customId === 'submission_form') {
      await interaction.deferReply({ ephemeral: true });

      const registrationNumber = interaction.fields.getTextInputValue('registration_number');
      const department = interaction.fields.getTextInputValue('department');
      const year = interaction.fields.getTextInputValue('year');
      const driveUrl = interaction.fields.getTextInputValue('drive_url');
      const aboutPost = interaction.fields.getTextInputValue('about_post');

      const category = interaction.guild.channels.cache.get(CATEGORY_ID);
      if (!category) {
        return interaction.followUp({ content: 'Category not found.', ephemeral: true });
      }

      try {
        const randomNumber = Math.floor(1000 + Math.random() * 9000);
        const ticketChannel = await interaction.guild.channels.create({
          name: `ticket-${randomNumber}`,
          type: ChannelType.GuildText,
          parent: category.id,
          permissionOverwrites: [
            {
              id: interaction.guild.id,
              deny: [PermissionsBitField.Flags.ViewChannel],
            },
            {
              id: interaction.user.id,
              allow: [PermissionsBitField.Flags.ViewChannel, PermissionsBitField.Flags.SendMessages],
            },
          ],
        });

        const ticketDetails = {
          ticketNumber: randomNumber,
          user: `${interaction.user.tag} (${interaction.user.id})`,
          registrationNumber,
          department,
          year,
          driveUrl,
          aboutPost,
        };

        saveTicketDetailsToFile(ticketDetails);
        logToFile(`Ticket #${randomNumber} created by ${interaction.user.tag} (${interaction.user.id})`);

        const embed = new EmbedBuilder()
          .setTitle('Your ticket has been created:')
          .setColor('Red')
          .setDescription(
            `**Registration Number:** ${registrationNumber}\n` +
            `**Department:** ${department}\n` +
            `**Year:** ${year}\n` +
            `**Drive URL:** ${driveUrl}\n` +
            `**About the Post:** ${aboutPost}`
          )
          .setFooter({ text: 'Click the button below to close the ticket.' });

        const closeButton = new ActionRowBuilder()
          .addComponents(
            new ButtonBuilder()
              .setCustomId('close_ticket')
              .setLabel('Close Ticket')
              .setStyle(ButtonStyle.Danger)
              .setEmoji('🎫')
          );

        await ticketChannel.send({ embeds: [embed], components: [closeButton] });

        await interaction.followUp({ content: `Your ticket has been created: ${ticketChannel}`, ephemeral: true });
      } catch (error) {
        console.error('Error creating ticket channel:', error);
        await interaction.followUp({ content: 'An error occurred while creating the ticket. Please try again.', ephemeral: true });
      }
    }
  }

  if (interaction.isButton()) {
    if (interaction.customId === 'close_ticket') {
      if (!ALLOWED_CLOSERS.includes(interaction.user.id)) {
        return interaction.reply({ content: 'You are not authorized to close this ticket.', ephemeral: true });
      }

      const ticketNumber = interaction.channel.name.split('-')[1];
      console.log(`Closing ticket: ${interaction.channel.name}`);

      try {
        await interaction.reply({ content: 'Closing ticket...', ephemeral: true });

        logToFile(`Ticket #${ticketNumber} closed by ${interaction.user.tag} (${interaction.user.id})`);

        try {
          await interaction.user.send(`❌ Your ticket has been closed: ${interaction.channel.name}. Thank you for your submission!`);
        } catch (error) {
          console.error('Error sending DM:', error);
        }

        setTimeout(() => {
          interaction.channel.delete().catch((error) => {
            console.error('Error deleting ticket channel:', error);
          });
        }, 3000);
      } catch (error) {
        console.error('Error closing the ticket:', error);
        await interaction.reply({ content: 'There was an error closing the ticket. Please try again later.', ephemeral: true });
      }
    }
  }
});

client.login('DISCORD_BOT_TOKEN');
