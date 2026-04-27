export const emailTemplates = {
  verifyEmail: (link, name = "User") => ({
    subject: "Verify Your Email ✅",
    html: `
      <div style="font-family: Arial; padding: 20px;">
        <h2>Hey ${name} 👋</h2>
        <p>Welcome! Please verify your email to continue.</p>

        <a href="${link}" 
           style="
             display:inline-block;
             padding:10px 20px;
             background:#4CAF50;
             color:white;
             text-decoration:none;
             border-radius:5px;
           ">
           Verify Email
        </a>

        <p style="margin-top:20px;">If you didn't sign up, ignore this email.</p>
      </div>
    `,
  }),

  resetPassword: (link) => ({
    subject: "Reset Your Password 🔐",
    html: `
      <h2>Password Reset</h2>
      <p>Click below to reset your password:</p>
      <a href="${link}">Reset Password</a>
    `,
  }),
};