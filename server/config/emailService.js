import nodemailer from 'nodemailer';

// This function will send the OTP to the user's email address
export const sendOtpEmail = async (email, otp) => {
  try {
    // Configure the email transporter using explicit SMTP settings
    // Required for Render deployment (Nodemailer's service: 'gmail' times out)
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'smtp.gmail.com',
      port: process.env.SMTP_PORT || 465,
      secure: true, // use SSL for port 465
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_APP_PASSWORD,
      },
      connectionTimeout: 5000,
      socketTimeout: 5000,
    });

    // Define the email options
    const mailOptions = {
      from: `"Backrite" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: 'Your One-Time Password (OTP)',
      html: `
        <div style="font-family: Arial, sans-serif; color: #333;">
          <h2>Email Verification</h2>
          <p>Thank you for registering. Please use the following One-Time Password (OTP) to verify your email address.</p>
          <p>This OTP is valid for 5 minutes.</p>
          <p style="font-size: 24px; font-weight: bold; letter-spacing: 2px;">${otp}</p>
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
