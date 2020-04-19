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
        inPhotos: [Photo!]!
    }

    # Photo
    type Photo {
        id: ID!
        url: String!
        name: String!
        description: String
        category: PhotoCategory!
        postedBy: User!
        taggedUsers: [User!]!
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
var tags = [
    {
        "photoID": "1" ,
        "userID": "gPlake",
    },
    {
        "photoID": "2" ,
        "userID": "sSchmidt",
    },
    {
        "photoID": "2" ,
        "userID": "mHattrup",
    },
    {
        "photoID": "2" ,
        "userID": "gPlake",
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
        },
        taggedUsers: parent => tags

            // 対象の写真が関係しているタグの配列を返す
            .filter(tag => tag.photoID === parent.id)

            // タグの配列ユーザIDの配列に変換する
            .map(tag => tag.userID)

            // ユーザIDの配列をユーザオブジェクトの配列に変換する
            .map(userID => users.find(u => u.githubLogin === userID))
    },
    User: {
        postedPhotos: parent => {
            return photos.filter(p => p.githubUser === parent.githubLogin)
        },
        inPhotos: parent => tags

            // 対象のユーザが関係しているタグの配列を返す
            .filter(tag => tag.userID === parent.id)

            // タグの配列ユーザIDの配列に変換する
            .map(tag => tag.photoID)

            // 写真IDの配列を写真オブジェクトの配列に変換する
            .map(userID => users.find(p => p.id === photoID))
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