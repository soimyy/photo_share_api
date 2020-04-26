const { GraphQLScalarType } = require(`graphql`)

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
        "created": "3-28-1997",
    },
    {
        "id": "2",
        "name": "Enjoying the sunchine",
        "category": "SELFIE",
        "githubUser": "sSchmidt",
        "created": "3-1-1998",
    },
    {
        "id": "3",
        "name": "Gunbarrel 25",
        "description": "25 ladps on gunbarrel today",
        "category": "LANDSCAPE",
        "githubUser": "sSchmidt",
        "created": "3-19-2000",
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

const perseValue = value => new Date(value)

const resolvers = {
    Query : {
        // totalPhotos: () => photos.length,
        // allPhotos: (parent, args) => {
        //     args.after
        // }
        // allPhotos: () => photos,
        totalPhotos: (parent, args, { db }) =>
        db.collection(`photo`).estimatedDocumentCount(),

        allPhotos: (parent, args, { db }) =>
        db.collection(`photos`)
        .find()
        .toArray(),

        totalUsers: (parent, args, { db }) =>
        db.collection(`users`).estimatedDocumentCount(),

        allUsers: (parent, args, { db }) =>
        db.collection(`users`)
        .find
        .toArray()

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

    DateTime : 
        new GraphQLScalarType({
            name: `DateTime`,
            description: `A valid date time value`,
            parseValue: value => new Date(value),
            serialize: value => new Date(value).toISOString(),
            parseLiteral: ast => ast.value,
    }),

    Mutation : {

        postPhoto(parent, args) {
            var newPhoto = {
                id: _id++,
                ...args.input,
                created: new Date()
            }
            photos.push(newPhoto)
            return newPhoto
        }
    },
}