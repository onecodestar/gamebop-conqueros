import { ACTIONS } from "../../../Models/ENUM";
import CONQUER from "../../CONQUER";
import ARRAY from "../../../UTIL/ARRAY";
import { log } from "../../../UTIL/LOG";
 
class GameData
{
    private conquer     : CONQUER;
    public tabs         : any;
    private vars        : any = {};
    public data         : any = {};
    private gameID      : any;
    private version     : any = 1;
    private dirty       : any = [];
    private interval    : any;

    constructor( conquer:CONQUER, gameID:any )
    {
        this.conquer    = conquer;
        this.vars       = { gameID:gameID };
        this.gameID     = gameID;
 
        let self       = this;

        this.interval = setInterval( function()
        {
            if( !self.dirty.length ) return;
            conquer.do( ACTIONS.GAMEDATA_SET, { gameID:gameID, $vars:self.dirty } );
 
            self.dirty  = [];

        }, 1000 );
    }
 
    public setVersion( value:any )
    {
        this.version = value;
    };
 
    public async get( vars?:any ) : Promise<any>
    {
        vars                = vars || {};
        vars.gameID         = this.gameID;
        let results : any   = await this.conquer.do( ACTIONS.GAMEDATA_GET, vars );
 
        if( results[".version"] && results[".version"] != this.version ) 
        {
            this.remove();
            this.set( ".version", this.version );
            return Promise.resolve( {} );
        }

        ARRAY.extract( results, this.data );

        return Promise.resolve( results );
    }

    public set( name:string, value:any )
    {
        this.data[ name ] = value;
        this.dirty.push({ name:name, value:value });
        this.conquer.Signal.set( name, value );
    }
 
    public async remove( vars?:any ) : Promise<any>
    {
        vars            = vars || {};
        vars.gameID     = this.gameID;
        let results     = await this.conquer.do( ACTIONS.GAMEDATA_REMOVE, vars );

        return Promise.resolve( results );
    }

    public stop()
    {
        clearInterval( this.interval );
    }
}

export default GameData;