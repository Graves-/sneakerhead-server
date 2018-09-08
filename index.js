const express = require('express');
const graphqlHTTP = require('express-graphql');
const schema = require('./schema/schema');
const mongoose = require('mongoose');
const { dbConfig } = require('./config'); 

const app = express();
const PORT = 4000;

mongoose.connect(`mongodb://${dbConfig.dbUser}:${dbConfig.dbPassword}@ds251002.mlab.com:51002/sneakerheads`, { useNewUrlParser: true });
mongoose.connection.once('open', () => {
    console.log('connected to database');
});

app.use('/graphql', graphqlHTTP({
    schema
}));


app.listen(PORT, () => {
    console.log(`listening on port ${PORT}`);
});