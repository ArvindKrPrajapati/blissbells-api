import * as feathersAuthentication from "@feathersjs/authentication";
import * as local from "@feathersjs/authentication-local";
import userPreCreate from "../../hooks/user-pre-create";
import userPostCreate from "../../hooks/user-post-create";
import excludeUsersField from '../../hooks/exclude-users-field';
// Don't remove this comment. It's needed to format import lines nicely.

const { authenticate } = feathersAuthentication.hooks;
const { hashPassword, protect } = local.hooks;

export default {
  before: {
    all: [],
    find: [authenticate("jwt")],
    get: [authenticate("jwt")],
    create: [userPreCreate(), hashPassword("password")],
    update: [authenticate("jwt"), userPreCreate(), hashPassword("password")],
    patch: [authenticate("jwt"), userPreCreate(), hashPassword("password")],
    remove: [authenticate("jwt")],
  },

  after: {
    all: [
      // Make sure the password field is never sent to the client
      // Always must be the last hook
      protect("password"),
    ],
    find: [excludeUsersField()],
    get: [excludeUsersField()],
    create: [userPostCreate()],
    update: [],
    patch: [],
    remove: [],
  },

  error: {
    all: [],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: [],
  },
};
