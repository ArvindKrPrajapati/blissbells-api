// Use this hook to manipulate incoming or outgoing data.
// For more information on hooks see: http://docs.feathersjs.com/api/hooks.html
import { BadRequest } from "@feathersjs/errors";
import { Hook, HookContext } from "@feathersjs/feathers";
import { indiaDateTime } from "../common/common";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export default (options = {}): Hook => {
  return async (context: HookContext): Promise<HookContext> => {
    const { id, data, app, params } = context;
    if (id) {
      if (id != params.user?.id) {
        throw new BadRequest("method not allowed");
      }
    }

    if (data.hasOwnProperty("password")) {
      if (data.password.toString().length < 8) {
        throw new BadRequest("Password is too short");
      }
    }

    if (data.hasOwnProperty("email")) {
      // check if user already created
      const user = await app.service("users")._find({
        query: {
          email: data.email,
        },
      });

      if (user.data.length) {
        if (user.data[0].account_created) {
          throw new BadRequest("User already exists with this email");
        } else {
          const d = await app.service("users")._remove(user.data[0].id);
          data.id = d.id;
        }
      }
    }

    const env = app.get("env");

    let otp =
      env === "development"
        ? 222222
        : Math.floor(100000 + Math.random() * 900000);

    context.data.otp = otp;
    context.data.otp_validity = indiaDateTime().add(10, "minutes");

    return context;
  };
};
