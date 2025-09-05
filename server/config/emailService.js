import nodemailer from 'nodemailer';

// This function will send the OTP to the user's email address
export const sendOtpEmail = async (email, otp) => {
  try {
    // Configure the email transporter using your email provider's SMTP settings
    // It's highly recommended to use environment variables for your credentials
    const transporter = nodemailer.createTransport({
      service: 'gmail', // Or use another service like SendGrid, Mailgun, etc.
      auth: {
        user: process.env.EMAIL_USER, // Your email address from .env file
        pass: process.env.EMAIL_APP_PASSWORD, // Your email password or app-specific password
      },
    });

    // Define the email options
    const mailOptions = {
      from: `"Your App Name" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: 'Your One-Time Password (OTP)',
      html: `
        <div style="font-family: Arial, sans-serif; color: #333;">
          <h2>Email Verification</h2>
          <p>Thank you for registering. Please use the following One-Time Password (OTP) to verify your email address.</p>
          <p style="font-size: 24px; font-weight: bold; letter-spacing: 2px;">${otp}</p>
          <p>This OTP is valid for 10 minutes.</p>
        </div>
      `,
    };

    // Send the email
    await transporter.sendMail(mailOptions);
    console.log('OTP email sent successfully to:', email);

  } catch (error) {
    console.error('Error sending OTP email:', error);
    // You might want to throw the error to be handled by your controller's catch block
    throw new Error('Could not send OTP email.');
  }
};