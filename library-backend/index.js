const { ApolloServer } = require('@apollo/server')
const { startStandaloneServer } = require('@apollo/server/standalone')
const mongoose = require('mongoose')
mongoose.set('strictQuery', false)
const Book = require('./models/book')
const Author = require('./models/author')
const { GraphQLError } = require('graphql')

require('dotenv').config()

const MONGODB_URI = process.env.MONGODB_URI

console.log('connecting to', MONGODB_URI)

mongoose.connect(MONGODB_URI)
  .then(() => {
    console.log('connected to MongoDB')
  })
  .catch((error) => {
    console.log('error connecting to MongoDB:', error.message)
  })

const typeDefs = `
  type Book {
    title: String!
    published: Int!
    author: Author!
    id: ID!
    genres: [String!]
  }

  type Author {
    name: String!
    id: ID!
    born: Int
    bookCount: Int
  }

  type Query {
    bookCount: Int!
    authorCount: Int!
    allBooks(author: String, genre: String): [Book!]
    allAuthors: [Author!]
  }

  type Mutation {
    addBook(
      title: String!
      published: Int!
      author: String!
      genres: [String!]
    ): Book!
    editAuthor(name: String!, setBornTo: Int!): Author
  }
`

const resolvers = {
  Query: {
    bookCount: async () => Book.collection.countDocuments(),
    allBooks: async (root, args) => {
      if (args.genre) {
        return Book.find({genres: args.genre}).populate('author')
      }
      // author filter not implemented
      return Book.find({}).populate('author')
      },
    authorCount: async () => Author.collection.countDocuments(),
    allAuthors: async () => {return Author.find({})}
  },

  Author: {
  bookCount: async (root) => {
    return Book.collection.countDocuments({ author: root._id })
    }
  },

  Mutation: {
    addBook: async (root, args) => {
      let existingAuthor = await Author.findOne({ name: args.author })
      if (!existingAuthor) {
        const author = new Author({name: args.author})
        try {
          existingAuthor = await author.save()
        } catch (error) {
          throw new GraphQLError('Failed to save author', {
            extensions: {
              code: "BAD_USER_INPUT",
              invalidArgs: args.author,
              error
            }
          })
        }
      }

      const book = new Book({ ...args, author: existingAuthor })
      
      try {
        await book.save()
      } catch (error) {
        throw new GraphQLError('Failed to save book', {
          extensions: {
            code: "BAD_USER_INPUT",
            invalidArgs: args.title,
            error
          }
        })
      }

      return book
    },
    editAuthor: async (root, args) => {
      const updatedAuthor = await Author.findOneAndUpdate({name: args.name}, {born: args.setBornTo}, {new: true})
      return updatedAuthor
    }
  }
}

const server = new ApolloServer({
  typeDefs,
  resolvers,
})

startStandaloneServer(server, {
  listen: { port: 4000 },
}).then(({ url }) => {
  console.log(`Server ready at ${url}`)
})