import nodemailer from 'nodemailer';

// SENDGRID - PROVEN WORKING ON RENDER
// This function sends OTP via SendGrid SMTP (only service that works reliably on Render)
export const sendOtpEmail = async (email, otp) => {
  try {
    if (!process.env.SENDGRID_API_KEY) {
      throw new Error('SENDGRID_API_KEY not set in environment variables');
    }

    // Configure using SendGrid SMTP 
    // (Gmail SMTP times out on Render - use SendGrid instead)
    const transporter = nodemailer.createTransport({
      host: 'smtp.sendgrid.net',
      port: 587,
      secure: false, // Use TLS (not SSL)
      auth: {
        user: 'apikey', // SendGrid requires literal string 'apikey'
        pass: process.env.SENDGRID_API_KEY, // Your SendGrid API key from dashboard
      },
      // Increased timeouts for Render reliability
      connectionTimeout: 15000,
      socketTimeout: 15000,
    });

    // Verify connection (optional but helps debug)
    await transporter.verify();
    console.log('✓ SendGrid SMTP connection verified');

    // Define the email options
    const mailOptions = {
      from: process.env.EMAIL_FROM || 'noreply@backrite.com', // SendGrid free tier: use any email
      to: email,
      subject: 'Your One-Time Password (OTP) - Backrite',
      html: `
        <div style="font-family: Arial, sans-serif; color: #333; max-width: 500px; margin: 0 auto;">
          <h2 style="color: #1f2937;">Email Verification</h2>
          <p>Thank you for registering on Backrite. Please use the following One-Time Password (OTP) to verify your email address.</p>
          
          <div style="background-color: #f3f4f6; padding: 20px; border-radius: 8px; text-align: center; margin: 20px 0;">
            <p style="margin: 0; color: #6b7280; font-size: 14px;">Your OTP is:</p>
            <p style="font-size: 32px; font-weight: bold; letter-spacing: 4px; margin: 10px 0; color: #1f2937;">${otp}</p>
          </div>

          <p style="color: #ef4444; font-weight: bold;">⏱️ This OTP is valid for 10 minutes only.</p>
          <p style="color: #6b7280; font-size: 13px;">If you didn't request this OTP, please ignore this email.</p>
          
          <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 20px 0;">
          <p style="color: #9ca3af; font-size: 12px; text-align: center;">© 2026 Backrite. All rights reserved.</p>
        </div>
      `,
    };

    // Send the email
    const info = await transporter.sendMail(mailOptions);
    console.log('✓ OTP email sent successfully:', {
      messageId: info.messageId,
      to: email,
      timestamp: new Date().toISOString(),
    });

    return { success: true, messageId: info.messageId };

  } catch (error) {
    console.error('❌ Error sending OTP email:', {
      error: error.message,
      code: error.code,
      command: error.command,
      stack: error.stack,
    });
    throw new Error(`Could not send OTP email: ${error.message}`);
  }
};
