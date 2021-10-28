const { AuthenticationError } = require('apollo-server-express');
const { User } = require('../models');
const { updateOne } = require('../models/User');
const { signToken } = require('../utils/auth');

const resolvers = {
    Query: {
        profiles: async () => {
            return Profile.find();
        },

        profile: async (parent, { profileId }) => {
            return Profile.findOne({ _id: profileId });
        },
    },

    login: async (parent, { email, password }) => {
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

    Mutation: {
        addUser: async (parent, { username, email, password }) => {
            const user = await User.create({ username, email, password });
            const token = signToken(user);

            return { token, profile };
        },

        saveBook: async (parent, { bookId, authors, description, title, image, link }) => {
            const book = { bookId, authors, description, title, image, link };
            return updateOne.User({$addToSet: {savedBooks: book}});
        },

        removeBook: async (parent, { bookId }) => {
            return updateOne.User({ $pull: { savedBooks: bookId }});
        },
    },
};

module.exports = resolvers;

