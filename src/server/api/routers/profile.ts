import { clerkClient } from "@clerk/nextjs";
import { createTRPCRouter, publicProcedure } from "../trpc";
import { z } from "zod";
import { TRPCError } from "@trpc/server";

import { filterUserForClient } from "~/server/helpers/filterUserForClient";

export const profilesRouter = createTRPCRouter({
  getUserByUsername: publicProcedure
    .input(z.object({ username: z.string() }))
    .query(async ({ input }) => {
      const [user] = await clerkClient.users.getUserList({
        username: [input.username],
      });

      if (!user || !user.username) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "User not found.",
        });
      }

      const filteredUser = filterUserForClient(user);

      if (!filteredUser.username) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "User not found.",
        });
      }

      return {
        ...filteredUser,
        username: filteredUser.username,
      };
    }),
});
