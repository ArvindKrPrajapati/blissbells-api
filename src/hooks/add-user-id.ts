// Use this hook to manipulate incoming or outgoing data.
// For more information on hooks see: http://docs.feathersjs.com/api/hooks.html
import { Hook, HookContext } from "@feathersjs/feathers";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export default (options = {}): Hook => {
  return async (context: HookContext): Promise<HookContext> => {
    const { data, params } = context;
    if (context.method == "create") {
      data["userId"] = params.user?.id;
    } else if (context.method == "find" || context.method == "get") {
      const query = params.query || {};
      query["userId"] = params.user?.id;
    }

    return context;
  };
};
