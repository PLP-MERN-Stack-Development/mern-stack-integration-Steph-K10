const { Resend } = require('resend');

const sendWelcomeEmail = async (email, username) => {
  try {
    console.log('📧 Attempting to send welcome email to:', email);
    console.log('🔧 RESEND_API_KEY in function:', process.env.RESEND_API_KEY ? '***' + process.env.RESEND_API_KEY.slice(-4) : 'NOT FOUND');
    
    // Initializing Resend inside the function to ensure env vars are loaded & api key is found
    if (!process.env.RESEND_API_KEY) {
      console.log('CONSOLE EMAIL (No API Key)');
      console.log('To:', email);
      console.log('Subject: Welcome to MERN 101 Blog! 🎉');
      console.log('Message: Welcome', username, '! Your account was created successfully.');
      console.log('---');
      return { id: 'console-fallback', status: 'logged-to-console' };
    }

    const resend = new Resend(process.env.RESEND_API_KEY);
    console.log('✅ Resend initialized inside function');

    const { data, error } = await resend.emails.send({
      from: 'MERN 101 Blog <onboarding@resend.dev>',
      to: [email],
      subject: 'Welcome to MERN 101 Blog! 🎉',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="utf-8">
            <style>
                body { 
                    font-family: Arial, sans-serif; 
                    line-height: 1.6; 
                    color: #333; 
                    max-width: 600px; 
                    margin: 0 auto; 
                    padding: 20px;
                }
                .header { 
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    color: white; 
                    padding: 30px; 
                    text-align: center; 
                    border-radius: 10px 10px 0 0;
                }
                .content { 
                    background: #f9f9f9; 
                    padding: 30px; 
                    border-radius: 0 0 10px 10px;
                }
                .button { 
                    display: inline-block; 
                    background: #667eea; 
                    color: white; 
                    padding: 12px 30px; 
                    text-decoration: none; 
                    border-radius: 5px; 
                    margin: 20px 0;
                }
                .footer { 
                    text-align: center; 
                    margin-top: 20px; 
                    color: #666; 
                    font-size: 14px;
                }
            </style>
        </head>
        <body>
            <div class="header">
                <h1>Welcome to MERN 101 Blog! 🎉</h1>
            </div>
            <div class="content">
                <h2>Hello ${username}!</h2>
                <p><strong>Welcome to the MERN 101 Blog, where amazing stories are shared.</strong></p>
                
                <p>Thank you for registering with us. We're thrilled to have you join our community of tech storytellers and readers!</p>
                
                <p>Your account has been successfully created and you can now:</p>
                <ul>
                    <li>Read and explore amazing blog posts</li>
                    <li>Share your thoughts by commenting on posts</li>
                    <li>Create your own stories (admin users)</li>
                    <li>Connect with other members of our community</li>
                </ul>
                
                <div style="text-align: center;">
                    <a href="${process.env.CLIENT_URL || 'http://localhost:3000'}/login" class="button">
                        Start Your Journey
                    </a>
                </div>
                
                <p>Happy storytelling!<br>
                <strong>Thanks from the MERN 101 Blog Team</strong></p>
            </div>
            <div class="footer">
                <p>&copy; 2025 MERN 101 Blog. All rights reserved.</p>
                <p>This is an automated message, please do not reply to this email.</p>
            </div>
        </body>
        </html>
      `,
      text: `Welcome to MERN 101 Blog, ${username}!\n\nWelcome to the MERN 101 Blog, where amazing stories are shared.\n\nThank you for registering with MERN 101 Blog. Your account has been successfully created and you can now log in to start exploring our platform and share your stories.\n\nBest regards,\nThanks from the MERN 101 Blog Team`
    });

    if (error) {
      console.error('❌ Resend error:', error);
      throw new Error(`Failed to send email: ${error.message}`);
    }

    console.log('✅ Welcome email sent successfully via Resend');
    console.log('📨 Email ID:', data?.id);
    return data;
    
  } catch (error) {
    console.error('❌ Error sending welcome email:', error.message);
    // Don't throw the error - we don't want email failures to break registration
    console.log('⚠️  Continuing with user registration despite email error');
    return { id: 'error', status: 'failed', error: error.message };
  }
};

module.exports = { sendWelcomeEmail };