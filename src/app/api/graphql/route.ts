import { ApolloServer } from "@apollo/server";
import { startServerAndCreateNextHandler } from "@as-integrations/next";
import { typeDefs } from "@/graphql/schema";
import { resolvers } from "@/graphql/resolvers";
import type { NextRequest } from "next/server";

const server = new ApolloServer({
  typeDefs,
  resolvers,
});

const apolloHandler = startServerAndCreateNextHandler<NextRequest>(server);

export async function GET(request: NextRequest) {
  return apolloHandler(request);
}

export async function POST(request: NextRequest) {
  return apolloHandler(request);
}
