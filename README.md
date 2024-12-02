
# 🎉 **Discord Ticketing System Bot** 🎉

## 🚀 **General Overview**

The bot provides a user-friendly mechanism for:

- ✨ **Submitting content** (such as cyber-related news, posts, or resources) through a simple form.
- 📊 **Logging ticket details** and tracking activities for each submission.
- 🗂️ **Creating a ticketing system** to manage and follow-up on content submissions.
- 🔒 **Allowing specific users** to manage and close tickets when submissions are resolved.

---

## 🔑 **Key Features**

### 1️⃣ **Setting Up**

The bot is initialized with **necessary intents** and **partials** to:
- 📩 Monitor incoming messages.
- 🛠️ Handle interactions such as button clicks.
- 🔐 Manage permissions for ticketing channels.

It also defines several **constants**:
- 📂 Category and channel IDs
- 🖼️ Path to the logo used in embeds
- 📜 Log file paths for tracking bot activities
- 🔑 List of **authorized users** who can close tickets.

---

### 2️⃣ **Posting an Announcement Message**

When a user sends the `!applymessage` command in the designated channel, the bot:

- Sends an **embedded message** containing:
  - **Accepted content types** (e.g., cyber security, tech posts).
  - **Platforms** (Instagram, YouTube, etc.).
  - **Submission guidelines**.
- Includes buttons for the user to choose between:
  - 📸 **Post on Instagram**
  - 🎥 **Post on YouTube**

---

### 3️⃣ **Handling User Interactions**

#### 🖱️ **Button Interaction**:

- Clicking a button (e.g., "Post on Insta" or "Post on YouTube") prompts the user with a **modal form** to provide their submission details:
  - 🎓 **Registration Number**
  - 🏫 **Department**
  - 📅 **Academic Year**
  - 🔗 **Drive URL**
  - 📝 **Description of the Post**

#### ✍️ **Modal Submission**:

- After submitting the form, the bot creates a **ticket channel** to track the content submission.
- The ticket details are:
  - 📑 Saved in a local file (`ticket.txt`).
  - 🗒️ Logged in another file (`bot.txt`).
- The bot notifies the user that their ticket was successfully created.

---

### 4️⃣ **Ticket Management**

- The **ticket channel** is created with specific permission overwrites:
  - 🔒 Only the user and bot have access.
  - ❌ Other guild members cannot view the ticket.
- A **Close Ticket** button is included in the ticket channel.
  - When clicked:
    - The bot verifies if the user is **authorized** to close the ticket.
    - Logs the closure and **deletes** the ticket channel after notifying the user.

---

### 5️⃣ **Logging and File Management**

- 📜 **Logs** all bot activity (ticket creation, closure) into a **log file** (`bot.txt`).
- 💾 **Saves ticket details** (user data, content description) to a separate file (`ticket.txt`) for record-keeping and auditing.

---

## ⚠️ **Error Handling**

The bot includes error handling for:
- 📝 **Logging issues** (e.g., failing to write to files).
- 🚫 **Failures during ticket creation** (e.g., category not found).
- 📬 **Failed direct messages** to users (e.g., user DM settings).
- ❌ **Ticket closure errors** (e.g., user not authorized).

---

## 🔐 **Security Considerations**

- 🔑 **Token Exposure**: The bot token is included in the code and must be kept **private** to avoid unauthorized access.
- 👥 **User Permissions**: Only predefined users (admins, moderators) can close tickets, ensuring better control over the ticketing system.
- 💾 **File Handling**: Ensures that logs and ticket data are safely **stored** and **append-only** to prevent accidental data loss.

---

## 🛠️ **How It Works**

1. A user starts the process by typing `!applymessage` in the designated channel.
2. The bot sends an **interactive embed** with buttons for post submissions.
3. Users click a button to open a form where they can provide their content details.
4. The bot creates a **private ticket channel** and logs the submission.
5. Authorized users can **close the ticket** once it is resolved.

---

## 🌱 **Potential Improvements**

- 🛡️ **Token Security**: Use **environment variables** to securely store the bot token.
- 📣 **Enhanced Error Handling**: Notify server administrators of any critical issues via a dedicated log channel.
- 🗄️ **Data Persistence**: Consider using a **database** instead of text files for more scalable storage and easier data retrieval.
- 🔒 **Input Validation**: Add stricter validation for form fields (e.g., validating the **Drive URL** format).

---

## 🎯 **Conclusion**

This bot creates a **structured workflow** for managing content submissions, providing a seamless experience for users and moderators alike. It ensures that contributions are tracked, logged, and resolved efficiently while keeping the system secure and organized. ✨

---

## 📚 **Log Files**

- **`bot.txt`**: Logs bot activities like ticket creation and closure.
- **`ticket.txt`**: Contains ticket details (user data, content information).

---

## 💻 **How to Download and Use the Bot**

To use this Discord bot, follow these steps:

### Step 1: **Clone the Repository**

Clone the bot repository from GitHub using the following command:
```bash
git clone https://github.com/Akilash-A/Discord-Bot.git
```

### Step 2: **Navigate to the Bot Folder**

Change into the bot directory:
```bash
cd Discord-Bot
```

### Step 3: **Install Dependencies**

The bot requires several dependencies to run. You can install them based on your Linux distribution:

- **For Ubuntu/Debian**:
    ```bash
    sudo apt update
    sudo apt install nodejs npm
    ```

- **For Fedora**:
    ```bash
    sudo dnf install nodejs npm
    ```

- **For Arch Linux**:
    ```bash
    sudo pacman -S nodejs npm
    ```

### Step 4: **Install Required Packages**

After installing Node.js and npm, run the following command to install the necessary packages for the bot:
```bash
npm install
```

### Step 5: **Run the Bot**

Once everything is set up, you can start the bot with the following command:
```bash
node bot.js
```

---

### 💬 **Ready to Start?**

Activate the bot today and let it streamline your content submission process! 🚀
