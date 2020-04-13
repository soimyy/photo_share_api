const { ApolloServer } = require(`apollo-server`)

const typeDefs = `
    type Query {
        totalPhoto: Int!
    }
`

const resolvers = {
    Query : {
        totalPhoto: () => 42
    }
}

const server = new ApolloServer({
    typeDefs,
    resolvers,
})

server
    .listen()
    .then(
        ({url}) => console.log(`GraphQL Service running on ${url}`)
        )