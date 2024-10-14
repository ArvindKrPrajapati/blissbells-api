import { Params, ServiceAddons } from "@feathersjs/feathers";
import {
  AuthenticationRequest,
  AuthenticationService,
  JWTStrategy,
} from "@feathersjs/authentication";
import { LocalStrategy } from "@feathersjs/authentication-local";
import { expressOauth, OAuthStrategy } from "@feathersjs/authentication-oauth";

import { Application } from "./declarations";
import * as jwt from "jsonwebtoken";
import { BadRequest } from "@feathersjs/errors";
import { indiaDateTime } from "./common/common";

declare module "./declarations" {
  interface ServiceTypes {
    authentication: AuthenticationService & ServiceAddons<any>;
  }
}

class GoogleStrategy extends OAuthStrategy {
  async authenticate(
    authentication: AuthenticationRequest,
    originalParams: Params,
  ) {
    let res = {
      authentication: { strategy: this.name || "google" },
      user: {},
    };
    const decodedToken: any = jwt.decode(authentication.access_token, {
      complete: true,
    });
    if (!decodedToken.payload.email_verified) {
      throw new BadRequest("Email is not verified by google");
    }

    const existingUser = await this.app?.service("users")._find({
      query: {
        email: decodedToken.payload.email,
        account_created: true,
      },
    });
    if (existingUser.total > 0) {
      const oldUser = await existingUser.data[0];
      delete oldUser.otp;
      delete oldUser.password;
      delete oldUser.otp_validity;
      res.user = oldUser;
    } else {
      const { payload } = decodedToken;
      const userPayload: any = {
        email: payload.email,
        name: payload.name,
        dp: payload.picture,
        otp: null,
        otp_validity: null,
        account_created: true,
      };
      const unverifiedUser = await this.app?.service("users")._find({
        query: {
          email: decodedToken.payload.email,
        },
      });
      if (unverifiedUser.total > 0) {
        const user = await this.app
          ?.service("users")
          ._patch(unverifiedUser.data[0].id, userPayload);
        res.user = await this.getEntity(user, originalParams);
      } else {
        res.user = await this.app?.service("users")._create(userPayload);
      }
    }
    return res;
  }
}

class CustomLocalStrategy extends LocalStrategy {
  // @ts-ignore
  async authenticate(authentication: any, params: any) {
    const { otp, email, password } = authentication;

    if (!email) {
      throw new BadRequest("email is required");
    }
    if (!otp && !password) {
      throw new BadRequest("password or otp is required");
    }
    // login using email
    if (password) {
      const result = await this.app?.service("users")._find({
        query: {
          email,
        },
      });
      if (!result.data.length) {
        throw new BadRequest("User not found");
      }
      if (result.data[0].account_created == false) {
        throw new BadRequest("User not found");
      }
      await this.comparePassword(result.data[0], password);

      return {
        authentication: { strategy: this.name },
        user: await this.getEntity(result.data[0], params),
      };
    }

    if (otp) {
      const user = (
        await this.app?.service("users")._find({
          query: {
            email,
          },
        })
      ).data[0];
      if (!user) {
        throw new BadRequest("user doesnt exist with this email");
      }

      if (user.otp && user.otp_validity) {
        const otp_validity = indiaDateTime(user.otp_validity);
        const currentDate = indiaDateTime();
        if (otp_validity.isBefore(currentDate)) {
          throw new BadRequest("Otp expired");
        } else {
          // now check otp and create account
          if (otp == user.otp) {
            const newUser = await this.app?.service("users")._patch(user.id, {
              account_created: true,
              otp: null,
              otp_validity: null,
            });
            return {
              authentication: { strategy: this.name },
              user: await this.getEntity(newUser, params),
            };
          } else {
            throw new BadRequest("Wrong Otp");
          }
        }
      } else {
        throw new BadRequest("Invalid Otp");
      }
    }
    throw new BadRequest("something went wrong");
  }
}
export default function (app: Application): void {
  const authentication = new AuthenticationService(app);

  authentication.register("jwt", new JWTStrategy());
  authentication.register("local", new CustomLocalStrategy());
  authentication.register("google", new GoogleStrategy());

  app.use("/authentication", authentication);
  app.configure(expressOauth());
}
