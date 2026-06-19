"use client";

import { ApolloProvider } from "@apollo/client";
import { getApolloClient } from "@/lib/apollo-client";

export function Providers({ children }: { children: React.ReactNode }) {
  const client = getApolloClient();
  return <ApolloProvider client={client}>{children}</ApolloProvider>;
}
