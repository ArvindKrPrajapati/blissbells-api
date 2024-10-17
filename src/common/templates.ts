import app from "../app";
import { indiaDateTime } from "./common";

export const otpTemp = (name: string, otp: any, otp_validity: Date) => {
  const text = `your otp is <strong>${otp}</strong> and it will be valid for 10 minutes till ${indiaDateTime(
    otp_validity,
  ).format(
    "DD MMM YYYY hh:mm A",
  )} IST. Use this OTP to complete account registration on ${app.get("website").name || ""} `;
  return emailTemp(text, name);
};

export const welcomeTemp = (name: string) => {
  return `
  <!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Welcome to Blissbells</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
            background-color: #FFF0F3;
        }
        .header {
            background-color: #FF4E76;
            color: white;
            text-align: center;
            padding: 20px;
            border-radius: 5px 5px 0 0;
        }
        .content {
            background-color: white;
            padding: 20px;
            border-radius: 0 0 5px 5px;
        }
        .button {
            display: inline-block;
            background-color: #FF4E76;
            color: white;
            padding: 15px 30px;
            text-decoration: none;
            border-radius: 25px;
            font-size: 18px;
            font-weight: bold;
            margin-top: 20px;
            text-align: center;
        }
        .footer {
            text-align: center;
            margin-top: 20px;
            font-size: 0.8em;
            color: #FF4E76;
        }
    </style>
</head>
<body>
    <div class="header">
        <h3>Welcome to Blissbells</h3>
    </div>
    <div class="content">
     <img
        src="${app.get("website").url}/images/logo.png"
        width="100px"
        alt="logo"
      />
      <br />
      <br />
        <b>Dear ${name.split(" ")[0]},</b>
        <p>We're thrilled to welcome you to Blissbells, your personal reminder service for all the special days of your friends and family!</p>
        <p>With Blissbells, you can:</p>
        <ul>
            <li>Store important dates</li>
            <li>Never miss a birthday or anniversary again</li>
        </ul>
        <p>Ready to get started? Click the button below to start creating blissbells.</p>
        <a href="${app.get("website").url}/blissbells" class="button">Create BlissBell</a>
        <br/>
        <br/>
        <p>The Blissbells Team</p>
    </div>
    <div class="footer">
        <p>©${new Date().getFullYear()} Blissbells. All rights reserved.</p>
        <p>You're receiving this email because you signed up for Blissbells. </p>
    </div>
</body>
</html>
  `;
};

export const emailTemp = (text: string, name: string) => {
  return `
    <div style="padding: 20px">
      <img
        src="${app.get("website").url}/images/logo.png"
        width="100px"
        alt="logo"
      />
      <br />
      <br />
      <strong>Hi ${name}</strong>

      <p>${text}</p>
      <b>Kind Regards</b>
      <small style="display: block">${app.get("website").name || ""}</small>
    </div>
    `;
};
