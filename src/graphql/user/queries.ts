const queries = `#graphql
    getUserToken(email: String!, password: String!): String
    getCurrentLoggedInUser: User
`;

module.exports = queries;