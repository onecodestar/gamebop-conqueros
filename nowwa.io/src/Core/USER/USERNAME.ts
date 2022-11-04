import DATA from "../DATA/DATA";
import PROMISE, { resolve, reject } from '../../UTIL/PROMISE';
import EMAIL from "./EMAIL";
import DATE from '../../UTIL/DATE';

class USERNAME
{
    private static table : string = "usernames";

    /*=============== 


    SET  
    

    ================*/
  
    public static async set( vars:any ) : Promise<any>
    {
        let results = await DATA.get( USERNAME.table, { username:vars.username } ); 

        if( results.length > 1 ) return reject( "Username already exists" );

        let item : any = await DATA.set( USERNAME.table, vars );
 
        EMAIL.set(
        {
            email       : vars.username,
            isVerified  : vars.isVerified,
            uID         : item._id
        });

        return resolve( item );
    }; 

    /*=============== 


    GET  
    

    ================*/
  
    public static async get( vars:any ) : Promise<any>
    {
        let results = await DATA.get( USERNAME.table, USERNAME.getQuery( vars ) ); 

        let item : any = results[0];
 
        if( !item ) return reject( 'user does not exists...' );
 
        return resolve( item );
    }; 

    /*=============== 


    CHANGE  
    

    ================*/

    public static async change( query:any )
    {
        var item = await DATA.change( USERNAME.table, query );

        return resolve( item );
    }

    public static async changeLastLogin( uID:any )
    {
        var item = USERNAME.change(
        { 
            where   : { _id : uID },
            values  : { lastLogin : DATE.now() }
        });

        return resolve( item );
    }

    /*=============== 


    QUERY  
    

    ================*/

    private static getQuery( vars:any )
    {
        if( vars.where ) return vars;

        var query   : any = { where:{}, values:{} };
        var where   : any = {};

        query.where = where;

        if( vars.username ) where.username = vars.username;

        return query;
    }
 
};

export default USERNAME;