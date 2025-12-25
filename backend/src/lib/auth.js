import { betterAuth } from "better-auth";
import { Pool } from "pg";
import { SUPABASE_CONNECTION_STRING, BETTER_AUTH_SECRET, BETTER_AUTH_URL } from "../config/index.js";
import { sendEmail } from "../utils/sendEmail.js";

export const auth = betterAuth({
  secret: BETTER_AUTH_SECRET,
  baseUrl: BETTER_AUTH_URL,
  database: new Pool({
    connectionString: SUPABASE_CONNECTION_STRING,
  }),
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: true,
  },
  user: {
    additionalFields: {
      metadata: {
        type: "json",
        required: false,
        defaultValue: {},
      },
      role: {
        type: "string",
        required: false,
        defaultValue: "user",
      },
    },
  },
  emailVerification: {
    enabled: true,
    sendOnSignUp: true,
    sendVerificationEmail: async ({ user, url, token }, request) => {
      console.log("\n=== EMAIL VERIFICATION ===");
      console.log("User Email:", user.email);
      console.log("User Name:", user.name);
      console.log("Token:", token);
      
      const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
      const verificationUrl = `${frontendUrl}/auth/verify-email?token=${token}`;
      
      console.log("Verification URL:", verificationUrl);
      console.log("========================\n");
      
      try {
        await sendEmail({
          to: user.email,
          subject: "Verify your email address",
          html: `
            <h2>Welcome ${user.name || 'User'}!</h2>
            <p>Please verify your email address by clicking the link below:</p>
            <a href="${verificationUrl}" style="
              background-color: #4CAF50;
              color: white;
              padding: 14px 20px;
              text-decoration: none;
              display: inline-block;
              border-radius: 4px;
            ">Verify Email</a>
            <p>Or copy and paste this link in Postman:</p>
            <p><code>${verificationUrl}</code></p>
            <p>This link will expire in 24 hours.</p>
          `,
        });
        console.log("✅ Verification email sent successfully!\n");
      } catch (error) {
        console.error("❌ Failed to send verification email:", error.message);
      
      }
    },
    expiresIn: 60 * 60 * 24,
  },
});