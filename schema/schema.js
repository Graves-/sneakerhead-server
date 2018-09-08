const graphql = require('graphql');
const { GraphQLObjectType, GraphQLString, GraphQLSchema, GraphQLID, GraphQLList } = graphql;
const _ = require('lodash');

// dummy data
const sneakers = [
    { name: 'Air Force 1', id: '1', brandId: '1' },
    { name: 'Ultra Boost 1.0', id: '2', brandId: '2' },
    { name: 'Old Skool', id: '3', brandId: '3' },
    { name: 'Air Jordan 1', id: '4', brandId: '1' },
];

const brands = [
    { name: 'Nike', id: '1' },
    { name: 'Adidas', id: '2' },
    { name: 'Vans', id: '3' },
    { name: 'Converse', id: '4' },
    { name: 'Reebok', id: '5' }
];

/**
 * Defining a new  GraphQL Type
 */
const SneakerType = new GraphQLObjectType({
    name: 'Sneaker',
    fields: () => ({
        id: { type: GraphQLID },
        name: { type: GraphQLString },
        brand: { 
            type: BrandType,
            resolve(parent, args){
                return _.find(brands, { id: parent.brandId });
            } 
        }
    })
});

const BrandType = new GraphQLObjectType({
    name: 'Brand',
    fields: () => ({
        id: { type: GraphQLID },
        name: { type: GraphQLString },
        sneakers: {
            type: new GraphQLList(SneakerType),
            resolve(parent, args){
                return _.filter(sneakers, { brandId: parent.id });
            }
        }
    })
});

/**
 * Defining the Root Query
 */

const RootQuery = new GraphQLObjectType({
    name: 'RootQueryType',
    fields: {
        sneaker: { 
            type: SneakerType, 
            args: {
                id: { type: GraphQLID }
            },
            resolve(parent, args){
                //code to get data from db/other source
                return _.find(sneakers, { id: args.id });
            }
        },
        brand: {
            type: BrandType,
            args: {
                id: { type: GraphQLID }
            },
            resolve(parent, args){
                return _.find(brands, { id: args.id });
            }
        },
        sneakers: {
            type: new GraphQLList(SneakerType),
            resolve(parent, args){
                return sneakers;
            }
        },
        brands: {
            type: new GraphQLList(BrandType),
            resolve(parent, args){
                return brands;
            }
        }
    }
});

/**
 * Exporting the schema
 */

module.exports = new GraphQLSchema({
    query: RootQuery
});