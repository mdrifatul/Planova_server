import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { oAuthProxy } from "better-auth/plugins/oauth-proxy";
import { env } from "../config/env";
import { prisma } from "./prisma";

// const transporter = nodemailer.createTransport({
//   host: "smtp.gmail.com",
//   port: 587,
//   secure: false,
//   auth: {
//     user: env.APP_USER,
//     pass: env.APP_PASS,
//   },
// });

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),

  trustedOrigins: [env.APP_URL!],

  user: {
    additionalFields: {
      role: {
        type: "string",
        defaultValue: "USER",
        required: false,
      },
      phone: {
        type: "string",
        required: false,
      },
      status: {
        type: "string",
        defaultValue: "ACTIVE",
        required: false,
      },
    },
  },

  emailAndPassword: {
    enabled: true,
    autoSignIn: false,
    // requireEmailVerification: true,
  },

  baseURL: env.BETTER_AUTH_URL,
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
      accessType: "offline",
      prompt: "select_account consent",
    },
  },

  // account: { skipStateCookieCheck: true }, // solved redirect issue
  advanced: {
    cookies: {
      session_token: {
        name: "session_token", // Force this exact name
        attributes: {
          httpOnly: true,
          secure: true,
          sameSite: "none",
          partitioned: true,
        },
      },
      state: {
        name: "session_token", // Force this exact name
        attributes: {
          httpOnly: true,
          secure: true,
          sameSite: "none",
          partitioned: true,
        },
      },
    },
  },

  plugins: [oAuthProxy()],

  // baseURL: env.APP_URL,
  // socialProviders: {
  //   google: {
  //     clientId: env.GOOGLE_CLIENT_ID as string,
  //     clientSecret: env.GOOGLE_CLIENT_SECRET as string,
  //     accessType: "offline",
  //     prompt: "select_account consent",
  //   },
  // },

  // emailVerification: {
  //   sendOnSignIn: true,
  //   autoSignInAfterVerification: true,
  //   sendVerificationEmail: async ({ user, url, token }, request) => {
  //     try {
  //       const info = await transporter.sendMail({
  //         from: '"Food Hub" <foodhub@gmail.com>',
  //         to: user.email,
  //         subject: "Please verify your email",
  //         html: `<!DOCTYPE html>
  // <html lang="en">
  //   <head>
  //     <meta charset="UTF-8" />
  //     <title>Verify Your Email</title>
  //   </head>
  //   <body style="margin:0; padding:0; background-color:#f4f6f8; font-family:Arial, Helvetica, sans-serif;">
  //     <table width="100%" cellpadding="0" cellspacing="0">
  //       <tr>
  //         <td align="center" style="padding:40px 0;">
  //           <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff; border-radius:8px; overflow:hidden;">

  //             <!-- Header -->
  //             <tr>
  //               <td style="background:#2563eb; padding:20px; text-align:center;">
  //                 <h1 style="color:#ffffff; margin:0; font-size:24px;">
  //                   Food Hub
  //                 </h1>
  //               </td>
  //             </tr>

  //             <!-- Content -->
  //             <tr>
  //               <td style="padding:30px; color:#333333;">
  //                 <h2 style="margin-top:0;">Verify your email address</h2>
  //                 <p>Hello ${user.name},</p>
  //                 <p style="font-size:15px; line-height:1.6;">
  //                   Thanks for signing up for Food Hub. Please confirm your email address to activate your account.
  //                 </p>

  //                 <div style="text-align:center; margin:30px 0;">
  //                   <a
  //                     href="${url}"
  //                     style="
  //                       background:#2563eb;
  //                       color:#ffffff;
  //                       text-decoration:none;
  //                       padding:12px 24px;
  //                       border-radius:6px;
  //                       font-weight:bold;
  //                       display:inline-block;
  //                     "
  //                   >
  //                     Verify Email
  //                   </a>
  //                 </div>

  //                 <p style="font-size:14px; line-height:1.6;">
  //                   If the button doesn’t work, copy and paste this link into your browser:
  //                 </p>

  //                 <p style="font-size:13px; word-break:break-all; color:#2563eb;">
  //                   ${url}
  //                 </p>

  //                 <p style="font-size:14px; line-height:1.6;">
  //                   If you didn’t create an account, you can safely ignore this email.
  //                 </p>

  //                 <p style="margin-bottom:0;">
  //                   — Food Hub Team
  //                 </p>
  //               </td>
  //             </tr>

  //             <!-- Footer -->
  //             <tr>
  //               <td style="background:#f4f6f8; padding:15px; text-align:center; font-size:12px; color:#666;">
  //                 © ${new Date().getFullYear()} Food Hub. All rights reserved.
  //               </td>
  //             </tr>

  //           </table>
  //         </td>
  //       </tr>
  //     </table>
  //   </body>
  // </html>
  // `,
  //       });
  //       console.log("Message sent:", info.messageId);
  //     } catch (err) {
  //       console.error(err);
  //       throw err;
  //     }
  //   },
  // },
});
