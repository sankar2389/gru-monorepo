import { ApolloClient } from 'apollo-client';
import { HttpLink } from 'apollo-link-http';
import { InMemoryCache } from 'apollo-cache-inmemory';
const GRAPHQL_ENDPOINT = `http://localhost:1337/graphql`;
const createApolloClient = (token: string) => {
  const link = new HttpLink({
    uri: GRAPHQL_ENDPOINT,
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  return new ApolloClient({
    link,
    cache: new InMemoryCache()
  })
}
export default createApolloClient;