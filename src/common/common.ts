import moment from "moment-timezone";
import app from "../app";
import nodemailer from "nodemailer";

export const sendEmail = async (
  template: string,
  email: string,
  subject: string,
  attachment?: Buffer,
  filename?: string,
) => {
  if (!template && !email) {
    throw Error("text and email is required");
  }
  if (attachment && !filename) {
    throw Error("filename is required");
  }
  const env = app.get("env");
  if (env == "development") {
    console.log({ message: "Not sending email", env });
    return { success: true, message: "Email sent successfully" };
  }
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "signpact.in@gmail.com",
      pass: "wsiuqegdmksjjyfc",
    },
  });

  const mailOptions = {
    from: "signpact.in@gmail.com",
    to: email,
    subject,
    html: template,
    attachments: attachment
      ? [
          {
            filename,
            content: attachment,
          },
        ]
      : undefined,
  };

  await new Promise((resolve, reject) => {
    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        throw Error("error sending email");
      } else {
        resolve({ success: true, message: "Email sent successfully" });
      }
    });
  });
};

export const indiaDateTime = (date?: any) => {
  if (date) {
    const originalMoment = moment(date);
    return originalMoment.tz("Asia/Kolkata");
  }
  return moment.tz("Asia/Kolkata");
};
