// Use this hook to manipulate incoming or outgoing data.
// For more information on hooks see: http://docs.feathersjs.com/api/hooks.html
import { Hook, HookContext } from "@feathersjs/feathers";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export default (options = {}): Hook => {
  return async (context: HookContext): Promise<HookContext> => {
    if (context.result && context.result.data) {
      // If it's a paginated result, iterate through the data array
      context.result.data = context.result.data.map((item: any) => {
        // Exclude the 'otp' field from each item
        delete item.otp;
        delete item.password;
        delete item.otp_validity;
        return item;
      });
    } else if (context.result) {
      // If it's a single result, exclude the 'otp' field directly
      delete context.result.otp;
      delete context.result.password;
      delete context.result.otp_validity;
    }
    return context;
  };
};
