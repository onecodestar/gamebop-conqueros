import mongoose, { mongo } from 'mongoose';
import { Custom, CustomProperty, CustomType, CustomDocument } from '../../Models/Custom';
import DATA from './DATA';
import DATA_TABLE from './DATA_TABLE';
import LOG, { log, error } from '../../UTIL/LOG';

class TABLE_MODEL {
    private static pool: Map<string, mongoose.Model<any, {}, {}, {}, any>> = new Map<string, mongoose.Model<any, {}, {}, {}, any>>();

    /*=============== 


    GET
    

    ================*/

    public static async get(tableName: string): Promise<mongoose.Model<any, {}, {}, {}, any>> {
        let model = TABLE_MODEL.pool.get(tableName);
        if (model) return Promise.resolve(model);

        return TABLE_MODEL.set(tableName, {});

        // let schema = await DBTABLE.get( name );
        // return DBMODEL.set( name, schema.schemaFields );
    };


    /*=============== 


    SET
    

    ================*/

    private static async set(tableName: string, fields: any): Promise<mongoose.Model<any, {}, {}, {}, any>> {
        let schema = new mongoose.Schema(fields || {}, { strict: false, collection: tableName });
        let model: mongoose.Model<any, {}, {}, {}, any> = mongoose.model(tableName, schema);

        TABLE_MODEL.pool.set(tableName, model);

        return Promise.resolve(model);
    }

    /*
    private static set( name:string, fields:any ) 
    {
        log( `DBMODEL new: ${name}...` )
          
        type MapSchema<T extends Record<string, keyof DB.MapSchemaTypes>> = 
        {
            -readonly [K in keyof T]: DB.MapSchemaTypes[T[K]]
        }

        function asSchema<T extends Record<string, keyof DB.MapSchemaTypes>>(t: T): T 
        {
            return t;
        }

        let data            = asSchema( fields );
        let structure       = {};
        let fieldNames      = Object.keys( fields );

        for( let i:number = 0; i < fieldNames.length; i++ ) 
        {
            let fieldName   = fieldNames[i];
            let fieldType   = fields[fieldName];

            if( fieldType == 'string' ) 
            {
                structure = 
                { 
                    ...structure,
                    [fieldName] : 
                    {
                        type    : String
                    }
                };
            } else if( fieldType == 'number' ) 
            {
                structure = 
                { 
                    ...structure,
                    [fieldName] : 
                    {
                        type    : Number
                    }
                };
            } else if( fieldType == 'boolean' ) 
            {
                structure = 
                { 
                    ...structure,
                    [fieldName] : 
                    {
                        type    : Boolean
                    }
                };
            } else if( fieldType == 'date' ) 
            {
                structure = 
                { 
                    ...structure,
                    [fieldName] : 
                    {
                        type    : Date
                    }
                };
            } else if( fieldType == 'object' ) 
            {
                structure = 
                { 
                    ...structure,
                    [fieldName] : 
                    {
                        type    : mongoose.Schema.Types.Mixed
                    }
                };
            }
        }

        type DataType       = MapSchema < typeof data >;
        type NewDocument    = mongoose.Document & DataType;

        const NewSchema     = new mongoose.Schema<NewDocument>( structure, 
        {
            strict      : "throw"
        });

        log( `database custom model '${name}' created!` );

        let model = DBMODEL.pool[ name ] = mongoose.model( name, NewSchema );
 
        return model;
    }
    */


}




export default TABLE_MODEL;