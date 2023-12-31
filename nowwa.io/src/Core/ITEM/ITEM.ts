import DATA from "../DATA/DATA";
import LOG, { log } from "../../UTIL/LOG";
import QUERY from "../../UTIL/QUERY";
import del from "del";
import INSTANCE from "./INSTANCE/INSTANCE";
import ITEM_TEXT from "./ITEM_TEXT";
import FILE from "../CMS/FILE";
import IMAGE from "../CMS/IMAGE";
import GAME from "../GAME/GAME";
import { ValidatedPurchaseStore } from "@heroiclabs/nakama-js/dist/api.gen";
import FOLDER from "./INSTANCE/FOLDER";
import mongoose from "mongoose";
class ITEM
{
    private static table : string = "items";

    /*=============== 


    GET  

    

    ================*/

    public static async get( query:any ) : Promise<any>
    {
        let value = await DATA.get( this.table, query );

        return Promise.resolve( value );
    };

    public static async getOne( query: any ) : Promise<any>
    {
        let value = await DATA.getOne( this.table, query );

        return Promise.resolve( value );
    };

    /*=============== 


    SET  
    {
        avatarID,
        type,
        name,
        description,
        gameKey
    }

    ================*/

    public static async set( query:any ) : Promise<any>
    {
        query               = QUERY.set( query );
        let values : any    = query.values;

        let folderID        = values.folderID;
        let type            = values.type;
        let text            = values.text;

        delete values.folderID;
        delete values.text;

        if( !folderID ) 
        {
            let folder : any = await FOLDER.getOne(
            { 
                avatarID    : new mongoose.Types.ObjectId(query.values.avatarID), 
                type        : "root" 
            });

            folderID = folder._id;
        }
 
        let item            = await DATA.set( this.table, 
        {
            url         : query.values.url,
            avatarID    : query.values.avatarID,
            type        : query.values.type,
            folderID    : folderID,
            fileName    : query.values.fileName
        } );

        let itemID          = item._id; 
 
        if( type == "text" ) await ITEM_TEXT.set(
        {
            itemID      : itemID,
            text        : text
        });

        if( type == "game" ) await GAME.set(
        {
            itemID      : itemID,
            gameKey     : values.gameKey
        });
  
        let instance    = await INSTANCE.set( 
        { 
            avatarID    : query.values.avatarID,
            folderID    : folderID,
            itemID      : itemID,
            url         : query.values.url,
            fileName    : query.values.fileName
        });

        return Promise.resolve( instance );
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
        let items   = await DATA.get( this.table, query ); 

        for( let n in items )
        {
            let item : any  = items[n];
            let type        = item.type;
            let itemID      = item._id;

            await DATA.remove( this.table, { _id:itemID } );
            await INSTANCE.remove({ itemID:itemID });

            if( type == "text" )    await ITEM_TEXT.remove({ itemID:itemID });
            if( type == "image" )   await IMAGE.remove({ itemID:itemID });
            if( type == "file" )    await FILE.remove({ itemID:itemID });
            if( type == "game" )    await GAME.remove({ itemID:itemID });
        }
 
        return Promise.resolve();
    };
 
};

export default ITEM;