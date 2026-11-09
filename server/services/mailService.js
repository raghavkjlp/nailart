import nodemailer from "nodemailer";

let cachedTransporter = null;

/**
 * Creates and returns the active nodemailer transporter based on environment config
 */
async function getTransporter() {
  if (cachedTransporter) {
    return cachedTransporter;
  }

  // 1. Standard custom SMTP configuration
  if (process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS) {
    cachedTransporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT) || 587,
      secure: Number(process.env.SMTP_PORT) === 465,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
      }
    });
    return cachedTransporter;
  }

  // 2. Gmail / Google Workspace SMTP (using App Password)
  const emailUser = process.env.EMAIL_USER || process.env.GMAIL_USER;
  const emailPass = process.env.EMAIL_PASS || process.env.GMAIL_APP_PASSWORD;

  if (emailUser && emailPass) {
    cachedTransporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: emailUser,
        pass: emailPass
      }
    });
    return cachedTransporter;
  }

  // 3. Fallback / Test Account: create Ethereal test transporter for local development
  try {
    const testAccount = await nodemailer.createTestAccount();
    cachedTransporter = nodemailer.createTransport({
      host: "smtp.ethereal.email",
      port: 587,
      secure: false,
      auth: {
        user: testAccount.user,
        pass: testAccount.pass
      }
    });
    console.log("📧 Notice: Using Ethereal test mail transport. To send live emails, set EMAIL_USER & EMAIL_PASS in server/.env");
    return cachedTransporter;
  } catch (err) {
    console.warn("Could not create test mail account:", err.message);
    return null;
  }
}

/**
 * Sends the Spin the Wheel prize & coupon code email to the winner
 */
export async function sendSpinRewardEmail({
  email,
  result = "10% off on Cart Value",
  couponCode = "GLOSS10",
  fullName = ""
}) {
  if (!email) return { success: false, reason: "No email provided" };

  try {
    const transporter = await getTransporter();
    if (!transporter) {
      console.warn("No mail transporter available. Skipping email dispatch.");
      return { success: false, reason: "No mail service configured" };
    }

    const senderAddress =
      process.env.EMAIL_FROM ||
      process.env.EMAIL_USER ||
      `"Games of Gloss" <noreply@gamesofgloss.com>`;

    const greetingName = fullName ? fullName.trim() : "Gloss Babe";

    const htmlContent = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Your Games of Gloss Lucky Draw Reward!</title>
</head>
<body style="margin: 0; padding: 0; background-color: #FDF1F3; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; color: #242124;">
  <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #FDF1F3; padding: 30px 10px;">
    <tr>
      <td align="center">
        <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 540px; background-color: #FFFFFF; border-radius: 24px; overflow: hidden; box-shadow: 0 10px 30px rgba(122, 20, 38, 0.08); border: 1px solid #F8D7DA;">
          
          <!-- Header Banner -->
          <tr>
            <td align="center" style="background: linear-gradient(135deg, #7A1426 0%, #540D1A 100%); padding: 32px 24px;">
              <h1 style="margin: 0; color: #FFFFFF; font-family: Georgia, serif; font-size: 26px; font-weight: bold; letter-spacing: 2px;">
                GAMES OF GLOSS 💅🏻
              </h1>
              <p style="margin: 6px 0 0 0; color: #F3B6CB; font-size: 12px; letter-spacing: 1px; text-transform: uppercase;">
                A Little Gloss. A Lot of Glam.
              </p>
            </td>
          </tr>

          <!-- Main Body -->
          <tr>
            <td style="padding: 32px 28px; text-align: center;">
              <span style="display: inline-block; background-color: #FDF1F3; color: #7A1426; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 1.5px; padding: 5px 14px; border-radius: 20px; border: 1px solid #F8D7DA; margin-bottom: 12px;">
                🎉 Spin the Wheel Winner
              </span>

              <h2 style="margin: 0 0 10px 0; color: #7A1426; font-family: Georgia, serif; font-size: 22px; font-weight: bold;">
                Hey ${greetingName}, You've Won! ✨
              </h2>

              <p style="margin: 0 0 24px 0; color: #5A5255; font-size: 14px; line-height: 1.5;">
                Thank you for playing our lucky spin wheel! Here is your exclusive reward unlocked specially for your visit:
              </p>

              <!-- Prize Highlight Box -->
              <div style="background-color: #FFF6F7; border: 2px dashed #7A1426; border-radius: 16px; padding: 22px 16px; margin: 0 auto 24px auto;">
                <div style="font-size: 13px; color: #7A1426; font-weight: 600; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 6px;">
                  Your Unlocked Prize
                </div>
                <div style="font-size: 24px; font-family: Georgia, serif; color: #7A1426; font-weight: bold; margin-bottom: 12px;">
                  ${result}
                </div>

                ${
                  couponCode
                    ? `
                <div style="background-color: #FFFFFF; border: 1px solid #F8D7DA; border-radius: 10px; display: inline-block; padding: 10px 24px; margin-top: 6px;">
                  <span style="font-size: 11px; color: #8E8688; display: block; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 2px;">Coupon Code</span>
                  <span style="font-size: 20px; font-weight: bold; color: #7A1426; letter-spacing: 3px; font-family: monospace;">${couponCode}</span>
                </div>
                `
                    : ""
                }
              </div>

              <!-- How to Redeem -->
              <div style="text-align: left; background-color: #FDFBFA; border-radius: 12px; padding: 16px; margin-bottom: 26px; border: 1px solid #F0EAE8;">
                <div style="font-weight: 700; font-size: 12px; color: #7A1426; margin-bottom: 6px; text-transform: uppercase; letter-spacing: 0.5px;">
                  ✨ How to Redeem Your Reward:
                </div>
                <ul style="margin: 0; padding-left: 20px; color: #5A5255; font-size: 13px; line-height: 1.6;">
                  <li>Apply code <strong>${couponCode}</strong> during checkout on our online store.</li>
                  <li>Or send us a screenshot on our WhatsApp Concierge at <strong>+91 81781 87385</strong>.</li>
                  <li>Valid on all handcrafted press-on nails and dazzling fine jewellery.</li>
                </ul>
              </div>

              <!-- CTA Button -->
              <a href="https://gamesofgloss.com" target="_blank" style="display: inline-block; background-color: #7A1426; color: #FFFFFF; font-weight: bold; font-size: 14px; text-decoration: none; padding: 14px 34px; border-radius: 30px; box-shadow: 0 4px 15px rgba(122, 20, 38, 0.25);">
                Shop Now & Claim Reward 💅🏻
              </a>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color: #FDF1F3; padding: 20px; text-align: center; border-top: 1px solid #F8D7DA;">
              <p style="margin: 0 0 6px 0; color: #7A1426; font-size: 12px; font-weight: 600;">
                Games of Gloss • Handcrafted Luxury Press-On Nails & Fine Jewellery
              </p>
              <p style="margin: 0; color: #8E8688; font-size: 11px;">
                WhatsApp Concierge: +91 81781 87385 | Instagram: @games_of_gloss
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
    `;

    const info = await transporter.sendMail({
      from: senderAddress,
      to: email,
      subject: `✨ Your Lucky Reward: ${result} (Code: ${couponCode}) | Games of Gloss`,
      html: htmlContent
    });

    console.log(`✅ Spin reward email sent to ${email} (MessageId: ${info.messageId})`);
    if (nodemailer.getTestMessageUrl && info) {
      const previewUrl = nodemailer.getTestMessageUrl(info);
      if (previewUrl) {
        console.log(`🔗 Ethereal Email Preview: ${previewUrl}`);
      }
    }

    return {
      success: true,
      messageId: info.messageId,
      previewUrl: nodemailer.getTestMessageUrl ? nodemailer.getTestMessageUrl(info) : null
    };
  } catch (error) {
    console.error("Error sending spin reward email:", error.message);
    return {
      success: false,
      error: error.message
    };
  }
}

