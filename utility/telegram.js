const axios = require("axios");

const postJobToTelegram = async (job) => {
  const message = `
🚀 *${job.title}*

🏢 *Company:* ${job.company || "Not specified"}
📍 *Location:* ${job.location || "Not specified"}
💼 *Job Type:* ${job.jobType || "Not specified"}
🎓 *Experience:* ${job.experience || "Not specified"}

🔎 *Skills:* ${
    Array.isArray(job.skills)
      ? job.skills.join(", ")
      : "Not specified"
  }

👇 Click below to view the complete job and apply.
`;

  const url = `https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/sendMessage`;

  await axios.post(url, {
    chat_id: process.env.TELEGRAM_CHANNEL_ID,
    text: message,
    parse_mode: "Markdown",
    reply_markup: {
      inline_keyboard: [
        [
          {
            text: "🚀 View Job & Apply",
            url: `https://techby.in/jobs/${job.slug}`,
          },
        ],
      ],
    },
  });
};

module.exports = {
  postJobToTelegram,
};