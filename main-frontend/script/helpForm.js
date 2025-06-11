const express = require("express");
const nodemailer = require("nodemailer");
const bodyParser = require("body-parser");

const app = express();

app.use(bodyParser.json());

app.post("/contact", async (req, res) => {
  try {
    const { title, content, email } = req.body;
    const sanitizedTitle = String(title);
    const sanitizedContent = String(content);
    const sanitizedEmail = String(email);

   
    let transporter = nodemailer.createTransport({
      host: "smtp.example.com", // e.g., smtp.gmail.com for Gmail
      port: 587, // 465 for secure or 587 for non-secure connections
      secure: false, // true for port 465, false for other ports
      auth: {
        user: "yourusername@example.com", // your email username
        pass: "yourpassword",               // your email password
      },
    });

    
    const mailOptions = {
      from: "noreply@example.com",
      to: "teaduskook@tlu.ee",
      subject: `Kontaktivorm: ${sanitizedTitle}`,
      text: `Sõnum:\n${sanitizedContent}\n\nSaatja e-post: ${sanitizedEmail}`,
      headers: {
        "Reply-To": sanitizedEmail,
        "Content-Type": "text/plain; charset=UTF-8",
      },
    };

    await transporter.sendMail(mailOptions);

    res.send("Kiri saadeti edukalt!");
  } catch (error) {
    console.error("Mail sending error:", error);
    res.status(500).send("Meili saatmine ebaõnnestus.");
  }
});

app.use((req, res) => {
  res.status(400).send("Vigane päring.");
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
