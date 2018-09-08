const graphql = require('graphql');
const { GraphQLObjectType, GraphQLString, GraphQLSchema, GraphQLID, GraphQLList, GraphQLNonNull } = graphql;
const Sneaker = require('../models/sneaker');
const Brand = require('../models/brand');


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
                return Brand.findById(parent.brandId);
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
                return Sneaker.find({ brandId: parent.id });
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
                return Sneaker.findById(args.id);
            }
        },
        brand: {
            type: BrandType,
            args: {
                id: { type: GraphQLID }
            },
            resolve(parent, args){
                return Brand.findById(args.id);
            }
        },
        sneakers: {
            type: new GraphQLList(SneakerType),
            resolve(parent, args){
                return Sneaker.find({});
            }
        },
        brands: {
            type: new GraphQLList(BrandType),
            resolve(parent, args){
                return Brand.find({});
            }
        }
    }
});


/**
 * Mutations
 */

 const Mutation = new GraphQLObjectType({
     name: 'Mutation',
     fields: {
         addBrand: {
             type: BrandType,
             args: {
                 name: { type: new GraphQLNonNull(GraphQLString) }
             },
             resolve(parent, args){
                return new Brand({ name: args.name }).save();
             }
         },
         addSneaker: {
             type: SneakerType,
             args: {
                 name: { type: new GraphQLNonNull(GraphQLString) },
                 brandId: { type: new GraphQLNonNull(GraphQLID) }
             },
             resolve(parent, args){
                 return new Sneaker({
                     name: args.name,
                     brandId: args.brandId
                 }).save();
             }
         }
     }
 })


/**
 * Exporting the schema
 */

module.exports = new GraphQLSchema({
    query: RootQuery,
    mutation: Mutation
});