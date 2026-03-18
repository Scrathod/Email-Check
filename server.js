require("dotenv").config();

const cron = require("node-cron");
const nodemailer = require("nodemailer");
const http = require("http");

// 🔐 Transporter (Gmail)
const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

// ✅ Verify SMTP connection
transporter.verify((error) => {
    if (error) {
        console.error("❌ SMTP Error:", error);
    } else {
        console.log("✅ SMTP Ready");
    }
});

// 💛 Random Messages
const morningMessages = [
`Good Morning ❤️

I hope you woke up with a smile today 😊  
Just wanted to remind you that you mean a lot to me.

Have a beautiful day ahead 🌸

— Sachin`,

`Good Morning Love ❤️

Another day, another reason to be thankful that you're in my life.  
I hope your day is filled with happiness and smiles 😊

— Yours, Sachin`,

`Good Morning ☀️

Wake up sleepyhead 😄  
I wish I could be there to annoy you.

Have an amazing day 💛

— Sachin`
];

const nightMessages = [
`Good Night ❤️

I hope your day went well.  
Now relax and let all stress go.

Sleep peacefully 😴

— Sachin`,

`Good Night Love 🌙

No matter how the day was, you're always special to me ❤️  

Sweet dreams 😊

— Yours, Sachin`,

`Good Night 😄

Stop using your phone and sleep 😄  
Dream about me okay?

— Sachin`
];

// 📧 Send Mail
async function sendMail(subject, message) {
    try {
        console.log("📤 Sending email...");

        const info = await transporter.sendMail({
            from: `"Sachin Rathod" <${process.env.EMAIL_USER}>`,
            to: process.env.TO_EMAIL,
            subject,
            text: message
        });

        console.log("✅ Mail sent:", info.response);

    } catch (error) {
        console.error("❌ Mail Error:", error);
        await sendErrorMail(error);
    }
}

// 🚨 Error Mail
async function sendErrorMail(error) {
    try {
        await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: process.env.ALERT_EMAIL,
            subject: "🚨 Mailer Error Alert",
            text: `
Error occurred:

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

// 🌞 Morning Job
cron.schedule("0 10 * * *", async () => {
    console.log("⏰ Morning Job Triggered");

    const message = morningMessages[Math.floor(Math.random() * morningMessages.length)];

    await sendMail("Something from Sachin Rathod 💛", message);

}, {
    timezone: "Asia/Kolkata"
});

// 🌙 Night Job
cron.schedule("30 22 * * *", async () => {
    console.log("⏰ Night Job Triggered");

    const message = nightMessages[Math.floor(Math.random() * nightMessages.length)];

    await sendMail("Something from Sachin Rathod 💛", message);

}, {
    timezone: "Asia/Kolkata"
});

// 🧪 FORCE TEST EMAIL ON START (VERY IMPORTANT)
(async () => {
    console.log("🧪 Running test email...");

    await sendMail(
        "TEST EMAIL 🚀",
        `Your mailer is working perfectly ✅

Time: ${new Date().toString()}

— Sachin`
    );
})();

// 🌐 Health Check Server (Render requirement)
http.createServer((req, res) => {
    res.writeHead(200);
    res.end("Mailer running...");
}).listen(process.env.PORT || 3000);

console.log("🚀 Scheduler started...");