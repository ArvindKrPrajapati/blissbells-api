import app from "../app";

export const otpTemp = (text: string, name: string) => {
  return `
    <div style="padding: 20px">
      <img
        src="https://signpact.in/images/logo.png"
        width="100px"
        alt="logo"
      />
      <br />
      <br />
      <strong>Hi ${name}</strong>

      <p>${text}</p>
      <b>Kind Regards</b>
      <small style="display: block">Signpact</small>
    </div>
    `;
};
