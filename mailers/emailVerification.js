// import required packages
const nodeMailer = require("../config/nodemailer");

// sending email verification code 
exports.emailSend = async (email, subject, link) => {
  try {
    let htmlString = nodeMailer.renderTemplate({ link: link }, "/email.ejs");
    await nodeMailer.transporter.sendMail({
      from: "igsahilsayyad@gmail.com",
      to: email,
      subject: subject,
      text:
        "Hello,\n Welcome. Please click on the link to verify your account.\n" +
        link,
      html: htmlString,
    });
    console.log("email sent succcessfully ....");
  } catch (err) {
    console.log("error in sendig mail ", err);
    return;
  }
};
