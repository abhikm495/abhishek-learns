import { ApolloServer } from "@apollo/server";
import { startServerAndCreateNextHandler } from "@as-integrations/next";
import { typeDefs } from "@/graphql/schema";
import { resolvers } from "@/graphql/resolvers";
import { AUTH_COOKIE, verifyAdminToken } from "@/lib/auth";
import type { GraphQLContext } from "@/graphql/context";
import type { NextRequest } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const server = new ApolloServer<GraphQLContext>({
  typeDefs,
  resolvers,
});

const apolloHandler = startServerAndCreateNextHandler<NextRequest, GraphQLContext>(server, {
  context: async (req) => {
    const token = req.cookies.get(AUTH_COOKIE)?.value;
    const isAdmin = await verifyAdminToken(token);
    return { isAdmin };
  },
});

export async function GET(request: NextRequest) {
  return apolloHandler(request);
}

export async function POST(request: NextRequest) {
  return apolloHandler(request);
}
