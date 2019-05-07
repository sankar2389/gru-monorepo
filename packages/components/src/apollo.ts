import { ApolloClient } from 'apollo-client';
import { HttpLink } from 'apollo-link-http';
import { InMemoryCache } from 'apollo-cache-inmemory';
const CMS_API = process.env.CMS_API;
const GRAPHQL_ENDPOINT = CMS_API + 'graphql';
const createApolloClient = (token: string) => {
  console.log(GRAPHQL_ENDPOINT);
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