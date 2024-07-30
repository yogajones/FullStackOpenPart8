const Book = require('../models/book')
const Author = require('../models/author')
const User = require('../models/user')
const { GraphQLError } = require('graphql')
const jwt = require('jsonwebtoken')


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
      allAuthors: async () => {return Author.find({})},
      me: async (root, args, context) => {return context.currentUser}
    },
  
    Author: {
      bookCount: async (root) => {
      return Book.collection.countDocuments({ author: root._id })
      }
    },
  
    Mutation: {
      addBook: async (root, args, context) => {
        if (!context.currentUser) {
          throw new GraphQLError('You are not authorized to perform this operation', {
            extensions: {
              code: "FORBIDDEN"
            }
          })
        }
  
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
      editAuthor: async (root, args, context) => {
        if (!context.currentUser) {
          throw new GraphQLError('You are not authorized to perform this operation', {
            extensions: {
              code: "FORBIDDEN"
            }
          })
        }
        const updatedAuthor = await Author.findOneAndUpdate({name: args.name}, {born: args.setBornTo}, {new: true})
        return updatedAuthor
      },
      createUser: async (root, args) => {
        const user = new User({ username: args.username })
    
        return user.save()
          .catch(error => {
            throw new GraphQLError('Failed to create user', {
              extensions: {
                code: 'BAD_USER_INPUT',
                invalidArgs: args.username,
                error
              }
            })
          })
      },
      login: async (root, args) => {
        const user = await User.findOne({ username: args.username })
    
        if ( !user || args.password !== 'secret' ) {
          throw new GraphQLError('wrong credentials', {
            extensions: {
              code: 'BAD_USER_INPUT'
            }
          })        
        }
    
        const userForToken = {
          username: user.username,
          id: user._id,
        }
    
        return { value: jwt.sign(userForToken, process.env.JWT_SECRET) }
      },
    }
  }

module.exports = resolvers