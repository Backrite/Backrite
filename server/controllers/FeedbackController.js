import nodemailer from "nodemailer";
import asyncHandler from "express-async-handler";
import dotenv from "dotenv";
dotenv.config();

console.log("EMAIL_USER:", process.env.EMAIL_USER);
console.log("EMAIL_APP_PASSWORD:", process.env.EMAIL_APP_PASSWORD);

// Create nodemailer transporter
const transporter = nodemailer.createTransport({
  service: "gmail", // or your preferred email service
  auth: {
    user: process.env.EMAIL_USER, // Your email
    pass: process.env.EMAIL_APP_PASSWORD, // Your app-specific password
  },
});

// Verify transporter configuration
transporter.verify((error, success) => {
  if (error) {
    console.error("Email transporter error:", error);
  } else {
    console.log("Email server is ready to take our messages");
  }
});

// API endpoint for handling feedback
export const feedbackgenerator = asyncHandler(async (req, res) => {
  try {
    const { type, rating, name, email, subject, message, timestamp } = req.body;

    // Validate required fields
    if (!type || !rating || !name || !email || !subject || !message) {
      return res.status(400).json({
        error: "All fields are required",
      });
    }

    // Email to admin (you)
    const adminMailOptions = {
      from: process.env.EMAIL_USER,
      to: "aryanv380@gmail.com",
      replyTo: email,
      subject: `🔔 New BackRite Feedback: ${subject}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #f8f9fa; padding: 20px; border-radius: 10px;">
          <div style="background-color: #ffffff; padding: 30px; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
            <h1 style="color: #2563eb; margin-bottom: 20px; font-size: 24px;">📝 New Feedback Received</h1>
            
            <div style="background-color: #f1f5f9; padding: 20px; border-radius: 6px; margin-bottom: 20px;">
              <h2 style="color: #1e293b; margin-top: 0; font-size: 18px;">Feedback Details</h2>
              <table style="width: 100%; border-collapse: collapse;">
                <tr>
                  <td style="padding: 8px 0; font-weight: bold; color: #475569;">Type:</td>
                  <td style="padding: 8px 0; color: #1e293b;">${
                    type.charAt(0).toUpperCase() + type.slice(1)
                  }</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; font-weight: bold; color: #475569;">Rating:</td>
                  <td style="padding: 8px 0; color: #1e293b;">${"⭐".repeat(
                    rating
                  )} (${rating}/5 stars)</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; font-weight: bold; color: #475569;">Name:</td>
                  <td style="padding: 8px 0; color: #1e293b;">${name}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; font-weight: bold; color: #475569;">Email:</td>
                  <td style="padding: 8px 0; color: #1e293b;"><a href="mailto:${email}" style="color: #2563eb;">${email}</a></td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; font-weight: bold; color: #475569;">Subject:</td>
                  <td style="padding: 8px 0; color: #1e293b;">${subject}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; font-weight: bold; color: #475569;">Submitted:</td>
                  <td style="padding: 8px 0; color: #1e293b;">${new Date(
                    timestamp
                  ).toLocaleString()}</td>
                </tr>
              </table>
            </div>

            <div style="background-color: #fefefe; border-left: 4px solid #2563eb; padding: 20px; margin: 20px 0;">
              <h3 style="color: #1e293b; margin-top: 0;">Message:</h3>
              <p style="color: #475569; line-height: 1.6; margin: 0;">${message}</p>
            </div>

            <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #e2e8f0;">
              <p style="color: #64748b; font-size: 14px; margin: 0;">
                💡 You can reply directly to this email to respond to the user.
              </p>
            </div>
          </div>
        </div>
      `,
    };

    // Email to user (confirmation)
    const userMailOptions = {
      from: '"BackRite Team" <' + process.env.EMAIL_USER + ">",
      to: email,
      subject: "✅ Thank you for your feedback!",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #f8f9fa; padding: 20px; border-radius: 10px;">
          <div style="background-color: #ffffff; padding: 30px; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
            <div style="text-align: center; margin-bottom: 30px;">
              <h1 style="color: #2563eb; margin-bottom: 10px; font-size: 28px;">🙏 Thank You!</h1>
              <p style="color: #64748b; font-size: 16px; margin: 0;">We received your feedback and truly appreciate it.</p>
            </div>
            
            <div style="background-color: #f1f5f9; padding: 20px; border-radius: 6px; margin-bottom: 25px;">
              <h2 style="color: #1e293b; margin-top: 0; font-size: 18px;">Your Feedback Summary</h2>
              <table style="width: 100%; border-collapse: collapse;">
                <tr>
                  <td style="padding: 6px 0; font-weight: bold; color: #475569;">Type:</td>
                  <td style="padding: 6px 0; color: #1e293b;">${
                    type.charAt(0).toUpperCase() + type.slice(1)
                  }</td>
                </tr>
                <tr>
                  <td style="padding: 6px 0; font-weight: bold; color: #475569;">Rating:</td>
                  <td style="padding: 6px 0; color: #1e293b;">${"⭐".repeat(
                    rating
                  )} (${rating}/5 stars)</td>
                </tr>
                <tr>
                  <td style="padding: 6px 0; font-weight: bold; color: #475569;">Subject:</td>
                  <td style="padding: 6px 0; color: #1e293b;">${subject}</td>
                </tr>
              </table>
            </div>

            <div style="background-color: #dcfce7; border-left: 4px solid #16a34a; padding: 20px; margin: 20px 0; border-radius: 4px;">
              <p style="color: #166534; margin: 0; line-height: 1.6;">
                <strong>What happens next?</strong><br>
                Our team will review your feedback carefully. If we need any clarification or have updates related to your feedback, we'll reach out to you at this email address.
              </p>
            </div>

            <div style="text-align: center; margin: 30px 0;">
              <p style="color: #475569; font-size: 16px; line-height: 1.6;">
                We're constantly working to improve BackRite based on valuable feedback like yours. Your input helps us build a better platform for all developers! 🚀
              </p>
            </div>

            <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #e2e8f0;">
              <p style="color: #64748b; font-size: 14px; margin: 0;">
                Best regards,<br>
                <strong>The BackRite Team</strong>
              </p>
              <p style="color: #94a3b8; font-size: 12px; margin-top: 15px;">
                This is an automated confirmation email. Please do not reply to this email.
              </p>
            </div>
          </div>
        </div>
      `,
    };

    // Send both emails
    await Promise.all([
      transporter.sendMail(adminMailOptions),
      transporter.sendMail(userMailOptions),
    ]);

    console.log(`✅ Feedback processed successfully for ${name} (${email})`);

    res.status(200).json({
      success: true,
      message: "Feedback sent successfully!",
    });
  } catch (error) {
    console.error("❌ Error processing feedback:", error);
    res.status(500).json({
      error: "Failed to send feedback. Please try again later.",
    });
  }
});
