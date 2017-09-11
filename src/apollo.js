import { ApolloClient, createNetworkInterface } from 'react-apollo'

const client = new ApolloClient({
  networkInterface: createNetworkInterface({
    uri: 'https://api.graph.cool/simple/v1/cj7c6z1d206g90163lyglktyh',
  }),
})

export default client