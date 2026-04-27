import sgMail from "@sendgrid/mail";

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

export const sendEmail = async ({ to, subject, html }) => {
  const msg = {
    to,
    from: "abhaysinhdeshmukh1@gmail.com",
    subject,
    html,
  };

  // ✅ Don't swallow the error — let it bubble up to asyncHandler
  await sgMail.send(msg);
  console.log(`Email sent to ${to} ✅`);
};
