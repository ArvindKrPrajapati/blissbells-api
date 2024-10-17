// Use this hook to manipulate incoming or outgoing data.
// For more information on hooks see: http://docs.feathersjs.com/api/hooks.html
import { Hook, HookContext } from "@feathersjs/feathers";
import { sendEmail } from "../common/common";
import { otpTemp } from "../common/templates";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export default (options = {}): Hook => {
  return async (context: HookContext): Promise<HookContext> => {
    const { result, app } = context;
    const otp = result.otp;
    const otp_validity = result.otp_validity;

    const email = result.email;
    const subject = "OTP Verification code is " + result.otp;
    const template = otpTemp(result.name, otp, otp_validity);
    await sendEmail(template, email, subject);
    for (const key in result) {
      delete context.result[key];
    }
    context.result.email = email;
    context.result.message = "Otp sent successfully";
    return context;
  };
};
