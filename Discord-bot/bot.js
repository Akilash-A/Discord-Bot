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

const config = require('./config.json');

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMessageReactions,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildPresences,
  ],
  partials: [Partials.Message, Partials.Channel, Partials.Reaction],
});

// Constants
const CATEGORY_ID = config.categoryId;
const CHANNEL_ID = config.channelId;
const ALLOWED_CLOSERS = config.allowedClosers;
const LOGO_PATH = './image1.jpeg';
const LOG_FILE = './bot.txt';
const TICKET_FILE = './ticket.txt';

// Helper Functions
function logToFile(message) {
  const timestamp = new Date().toLocaleString();
  const logMessage = `[${timestamp}] ${message}\n`;
  fs.appendFile(LOG_FILE, logMessage, (err) => {
    if (err) console.error('Error writing to log file:', err);
  });
}

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
    if (err) console.error('Error writing ticket details to file:', err);
  });
}

// Bot Ready Event
client.once('ready', () => {
  console.log(`Logged in as ${client.user.tag}`);
  console.log('Bot is ready to handle tickets!');
});

// Message Command Handler
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
        { name: 'Note', value: "Share knowledge here, and we'll make a post for you.", inline: false }
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

    try {
      await message.channel.send({ embeds: [embed], components: [row], files: [LOGO_PATH] });
    } catch (error) {
      console.error('Error sending application message:', error);
    }
  }
});

// Interaction Handler
client.on('interactionCreate', async (interaction) => {
  try {
    // Button Interactions
    if (interaction.isButton()) {
      // Handle Post buttons
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
          .setPlaceholder('Enter the URL of your drive')
          .setRequired(true);

        const aboutPostInput = new TextInputBuilder()
          .setCustomId('about_post')
          .setLabel('About the Post')
          .setStyle(TextInputStyle.Paragraph)
          .setPlaceholder('Describe your post content')
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

      // Handle Close Ticket button
      if (interaction.customId === 'close_ticket') {
        if (!ALLOWED_CLOSERS.includes(interaction.user.id)) {
          return await interaction.reply({
            content: '❌ You are not authorized to close tickets. Only staff members can close tickets.',
            ephemeral: true
          });
        }

        await interaction.deferReply({ ephemeral: true });

        const ticketNumber = interaction.channel.name.split('-')[1];
        logToFile(`Ticket #${ticketNumber} closed by ${interaction.user.tag} (${interaction.user.id})`);

        try {
          const ticketCreator = interaction.channel.permissionOverwrites.cache
            .find(overwrite =>
              overwrite.type === 'member' &&
              overwrite.id !== interaction.user.id &&
              !ALLOWED_CLOSERS.includes(overwrite.id)
            );

          if (ticketCreator) {
            const user = await interaction.client.users.fetch(ticketCreator.id);
            await user.send(`Your ticket #${ticketNumber} has been closed by a staff member.`).catch(() => {});
          }
        } catch (dmError) {
          console.error('Error sending DM:', dmError);
        }

        await interaction.followUp({
          content: '🔒 Closing ticket... This channel will be deleted in 3 seconds.',
          ephemeral: true
        });

        setTimeout(() => {
          interaction.channel.delete()
            .catch(error => console.error('Error deleting ticket channel:', error));
        }, 3000);
      }
    }

    // Modal Submit Handler
    if (interaction.isModalSubmit() && interaction.customId === 'submission_form') {
      try {
        await interaction.deferReply({ ephemeral: true });

        const registrationNumber = interaction.fields.getTextInputValue('registration_number');
        const department = interaction.fields.getTextInputValue('department');
        const year = interaction.fields.getTextInputValue('year');
        const driveUrl = interaction.fields.getTextInputValue('drive_url');
        const aboutPost = interaction.fields.getTextInputValue('about_post');

        const category = interaction.guild.channels.cache.get(CATEGORY_ID);
        if (!category) {
          return await interaction.followUp({
            content: 'Category not found. Please contact an administrator.',
            ephemeral: true
          });
        }

        const randomNumber = Math.floor(1000 + Math.random() * 9000);

        const permissionOverwrites = [
          {
            id: interaction.guild.id,
            deny: [PermissionsBitField.Flags.ViewChannel],
          },
          {
            id: interaction.user.id,
            allow: [
              PermissionsBitField.Flags.ViewChannel,
              PermissionsBitField.Flags.SendMessages,
              PermissionsBitField.Flags.ReadMessageHistory,
            ],
          }
        ];

        for (const closerId of ALLOWED_CLOSERS) {
          try {
            const user = await interaction.client.users.fetch(closerId).catch(() => null);
            if (user) {
              permissionOverwrites.push({
                id: closerId,
                allow: [
                  PermissionsBitField.Flags.ViewChannel,
                  PermissionsBitField.Flags.SendMessages,
                  PermissionsBitField.Flags.ReadMessageHistory,
                  PermissionsBitField.Flags.ManageChannels,
                ],
              });
            }
          } catch (error) {
            console.error(`Invalid user ID in ALLOWED_CLOSERS: ${closerId}`);
            continue;
          }
        }

        const ticketChannel = await interaction.guild.channels.create({
          name: `ticket-${randomNumber}`,
          type: ChannelType.GuildText,
          parent: category.id,
          permissionOverwrites: permissionOverwrites,
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
          .setTitle(`Ticket #${randomNumber}`)
          .setColor('Blue')
          .setDescription(
            `**User:** ${interaction.user.tag}\n` +
            `**Registration Number:** ${registrationNumber}\n` +
            `**Department:** ${department}\n` +
            `**Year:** ${year}\n` +
            `**Drive URL:** ${driveUrl}\n` +
            `**About the Post:** ${aboutPost}`
          )
          .setTimestamp()
          .setFooter({ text: 'Only authorized staff can close this ticket.' });

        const closeButton = new ActionRowBuilder()
          .addComponents(
            new ButtonBuilder()
              .setCustomId('close_ticket')
              .setLabel('Close Ticket')
              .setStyle(ButtonStyle.Danger)
              .setEmoji('🎫')
          );

        await ticketChannel.send({
          content: `Welcome <@${interaction.user.id}>!\nSupport team will be with you shortly.`,
          embeds: [embed],
          components: [closeButton]
        });

        await interaction.followUp({
          content: `Your ticket has been created: ${ticketChannel}`,
          ephemeral: true
        });

      } catch (error) {
        console.error('Error creating ticket:', error);
        try {
          await interaction.followUp({
            content: 'An error occurred while creating the ticket. Please try again or contact an administrator.',
            ephemeral: true
          });
        } catch (followUpError) {
          console.error('Error sending followUp:', followUpError);
        }
      }
    }
  } catch (error) {
    console.error('Interaction error:', error);
  }
});

// Error handling
client.on('error', error => {
  console.error('Discord client error:', error);
});

// Login
client.login(config.token).catch(error => {
  console.error('Error logging in:', error);
});