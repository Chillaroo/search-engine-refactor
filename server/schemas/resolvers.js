const { AuthenticationError } = require('apollo-server-express');
const { User, Book } = require('../models');
const { findOneAndUpdate } = require('../models/User');
const { signToken } = require('../utils/auth');

const resolvers = {
    Query: {
        me: async (parent, args, context) => {
            console.log("CONTEXT", context.user);
            if(context.user){
                return User.findOne({_id: context.user._id});
            }
            throw new AuthenticationError('You need to be logged in!');
        },
    },

    Mutation: {
        login: async (parent, { email, password }) => {
            console.log("mutation login");

            const user = await User.findOne({ email });
    
            if (!user) {
                throw new AuthenticationError('No user with this email found!');
            }
    
            const correctPw = await user.isCorrectPassword(password);
    
            if (!correctPw) {
                throw new AuthenticationError('Incorrect password!');
            }
    
            const token = signToken(user);
            return { token, user };
        },

        addUser: async (parent, { username, email, password }) => {
            const user = await User.create({ username, email, password });
            const token = signToken(user);

            return { token, user };
        },

        saveBook: async (parent, { bookId, authors, description, title, image, link }, context) => {
            const book = { bookId, authors, description, title, image, link };
            if(context.user){
                return User.findOneAndUpdate(
                    {_id: context.user._id},
                    {
                        $addToSet: {savedBooks: book}
                    }
                );
            }
            throw new AuthenticationError('You need to be logged in!');
        },

        removeBook: async (parent, { bookId }, context) => {
            if(context.user) {
                const bookToRemove = await Book.findOne(bookId);
                return User.findOneAndUpdate(
                    {_id: context.user_id},
                    {
                        $pull: {savedBooks: bookToRemove}
                    }
                );
            }
            throw new AuthenticationError('You need to be logged in!');
        },
    },
};

module.exports = resolvers;

