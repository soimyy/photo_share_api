const { ApolloServer } = require(`apollo-server`)

const typeDefs = `

    # enum
    enum PhotoCategory {
        SELFIE
        PORTRAIT
        ACTION
        LANDSCAPE
        GRAHIC
    }

    # User
    type User {
        githubLogin: ID!
        name: String
        avatar: String
        postedPhotos: [Photo!]!
    }

    # Photo
    type Photo {
        id: ID!
        url: String!
        name: String!
        description: String
        category: PhotoCategory!
        postedBy: User!
    }

    input PostPhotoInput {
        name: String!
        category: PhotoCategory=PORTRAIT
        description: String
    }

    # return all photo
    type Query {
        totalPhotos: Int!
        allPhotos: [Photo!]!
    }

    # ミューテーション Photo型を返す
    type Mutation {
        postPhoto(input: PostPhotoInput!): Photo!
    }
`
var _id = 0

var users = [
    {
        "githubLogin": "mHattrup",
        "name": "Mike Hattrup"
    },
    {
        "githubLogin": "gPlake",
        "name": "Glan Plake"
    },
    {
        "githubLogin": "sSchmidt",
        "name": "Scot Schmidt"
    },
]

var photos = [
    {
        "id": "1",
        "name": "Dropping theHeart Chute",
        "description": "The heart chute is one of my facorite chutes",
        "category": "ACTION",
        "githubUser": "gPlake",
    },
    {
        "id": "2",
        "name": "Enjoying the sunchine",
        "category": "SELFIE",
        "githubUser": "sSchmidt",
    },
    {
        "id": "3",
        "name": "Gunbarrel 25",
        "description": "25 ladps on gunbarrel today",
        "category": "LANDSCAPE",
        "githubUser": "sSchmidt",
    },
]


const resolvers = {
    Query : {
        totalPhotos: () => photos.length,
        allPhotos: () => photos,
    },
    Photo: {
        url: parent => `http://yoursite.com/img/${parent.id}.jpg`,
        postedBy: parent => {
            return users.find(u => u.githubLogin === parent.githubUser)
        }
    },
    User: {
        postedPhotos: parent => {
            return photos.filter(p => p.githubUser === parent.githubLogin)
        }
    },

    Mutation : {

        postPhoto(parent, args) {
            var newPhoto = {
                id: _id++,
                ...args.input
            }
            photos.push(newPhoto)
            return newPhoto
        }
    },
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