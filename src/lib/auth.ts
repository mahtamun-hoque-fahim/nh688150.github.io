import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { admin } from "better-auth/plugins";
import { getDb } from "@/lib/db";
import { sendResetPasswordEmail } from "@/lib/email";

export const auth = betterAuth({
  database: drizzleAdapter(getDb(), { provider: "pg" }),

  emailAndPassword: {
    enabled: true,
    // No public self-registration. New admin accounts are created only
    // through the invite-accept flow (src/app/studio/accept-invite),
    // which calls auth.api.createUser (admin plugin) directly — that
    // call is unaffected by disableSignUp, since it's a separate,
    // session-less admin endpoint, not the public sign-up route.
    disableSignUp: true,
    minPasswordLength: 10,
    sendResetPassword: async ({ user, url }) => {
      await sendResetPasswordEmail(user.email, url);
    },
  },

  session: {
    expiresIn: 60 * 60 * 24 * 7, // 7 days
    updateAge: 60 * 60 * 24, // refresh once per day
  },

  plugins: [admin()],
});
