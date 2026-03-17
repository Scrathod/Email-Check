require("dotenv").config();

const cron = require("node-cron");
const nodemailer = require("nodemailer");

// 🔐 Transporter (Gmail)
const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

// ✅ Verify transporter at startup
transporter.verify((error) => {
    if (error) {
        console.error("SMTP Error:", error);
    } else {
        console.log("SMTP Ready ✅");
    }
});

// 📧 Send Normal Mail
async function sendMail(subject, message) {
    try {
        const info = await transporter.sendMail({
            from: `"Sachin Rathod" <${process.env.EMAIL_USER}>`,
            to: process.env.TO_EMAIL,
            subject,
            text: message
        });

        console.log("✅ Mail sent:", info.messageId);

    } catch (error) {
        console.error("❌ Mail Error:", error);
        await sendErrorMail(error);
    }
}

// 🚨 Send Error Alert Mail
async function sendErrorMail(error) {
    try {
        await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: process.env.ALERT_EMAIL,
            subject: "🚨 Mailer Error Alert",
            text: `
Error occurred in scheduler:

${error.message}

Stack:
${error.stack}
            `
        });

        console.log("⚠️ Error alert sent");

    } catch (err) {
        console.error("❌ Failed to send error alert:", err);
    }
}

// 🌞 Morning Mail - 10:00 AM
cron.schedule("0 10 * * *", async () => {
    console.log("⏰ Running Morning Job");

    const message = `
Good Morning ❤️

I hope you woke up with a smile today 😊  
Just wanted to remind you that you mean a lot to me.

Have a beautiful day ahead 🌸

— Sachin
`;

    await sendMail("Something from Sachin Rathod", message);
}, {
    timezone: "Asia/Kolkata"
});

// 🌙 Night Mail - 10:30 PM
cron.schedule("30 22 * * *", async () => {
    console.log("⏰ Running Night Job");

    const message = `
Good Night ❤️

I hope your day went well.  
Now it's time to relax and let all the stress go.

Sleep peacefully and dream something beautiful 😴

— Sachin
`;

    await sendMail("Something from Sachin Rathod", message);
}, {
    timezone: "Asia/Kolkata"
});

// 🧠 Health Check (Optional endpoint for Render)
const http = require("http");

http.createServer((req, res) => {
    res.writeHead(200);
    res.end("Mailer running...");
}).listen(process.env.PORT || 3000);

console.log("🚀 Scheduler started...");


