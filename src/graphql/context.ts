import { GraphQLError } from "graphql";

export interface GraphQLContext {
  isAdmin: boolean;
}

/** Throws an authorization error unless the request is from an authenticated admin. */
export function requireAdmin(context: GraphQLContext) {
  if (!context.isAdmin) {
    throw new GraphQLError("Not authorized. Admin access required.", {
      extensions: { code: "UNAUTHORIZED" },
    });
  }
}
