import DATA from "../../DATA/DATA";
import LOG, { log } from "../../../UTIL/LOG";

class GAMEROOM
{
    private static table : string = "game_rooms";

    /*=============== 


    GET  
    

    ================*/

    public static async get( query:any ) : Promise<any>
    {
        let value = await DATA.get( this.table, query );

        return Promise.resolve( value );
    };

    public static async getOne( query:any ) : Promise<any>
    {
        let value = await DATA.getOne( this.table, query );

        return Promise.resolve( value );
    };

    /*=============== 


    SET  
    

    ================*/

    public static async set( query:any ) : Promise<any>
    {
        let value = await DATA.set( this.table, query );

        return Promise.resolve( value );
    };

    /*=============== 


    CHANGE  
    

    ================*/

    public static async change( query:any ) : Promise<any>
    {
        let value = await DATA.change( this.table, query );

        return Promise.resolve( value );
    };

    /*=============== 


    REMOVE  
    

    ================*/

    public static async remove( query:any ) : Promise<any>
    {
        let removed = await DATA.remove( this.table, query );
 
        return Promise.resolve( removed );
    };
 
};

export default GAMEROOM;