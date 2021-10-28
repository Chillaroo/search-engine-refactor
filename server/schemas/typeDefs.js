// typeDefs.js: Define the necessary Query and Mutation types:
const { gql } = require('apollo-server-express');

const typeDefs = gql`
    type Query {
        me: User
    }

    type User {
        _id: ID
        username: String
        email: String
        bookCount: Int
        savedBooks: [Book]
    }

    type Book{
        bookId: String
        authors: [String]
        description: String
        title: String
        image: String
        link: String
    }

    Auth type:{
        token: ID!
        user: User
    }

    type Mutation {
        login(username: String!, email: String!, password: String!): Auth
        addUser(username: String!, email: String!, password: String!): Auth
        saveBook(authers: [String], description: String, title: String, bookId: String, image: String, link: String): User
        removeBook(bookID: String): User
    }
`;

module.exports = typeDefs;