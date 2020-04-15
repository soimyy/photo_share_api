const { ApolloServer } = require(`apollo-server`)

const typeDefs = `

    # Photo型
    type Photo {
        id: ID!
        url: String!
        name: String!
        description: String
    }

    # return all photo
    type Query {
        totalPhoto: Int!
        allPhotos: [Photo!]!
    }

    # ミューテーション Photo型を返す
    type Mutation {
        postPhoto(name: String! description: String): Photo!
    }
`
var _id = 0
var photos = []

const resolvers = {
    Query : {
        totalPhoto: () => photos.length,
        allPhotos: () => photos
    },

    Mutation : {

        
        postPhoto(parent, args) {

            var newPhoto = {
                id: _id++,
                ...args
            }
            photos.push(newPhoto)
            return newPhoto
        }
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