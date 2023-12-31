 
import { Socket } from "socket.io"
import { ACTIONS } from "../../Models/ENUM";
import { log } from "../../UTIL/LOG";
import FILE from "../CMS/FILE";
import GameRoomInstance from "../GAME/GAMEROOM/GameRoomInstance";
import AUTH from "../USER/AUTH/AUTH";
import FRIENDS from "../USER/TRIBE/FRIENDS/FRIENDS";
import ROOM from "./ROOM/ROOM";
import ROOM_ENTRIES from "./ROOM/ROOM_ENTRIES";
import ARRAY, { extract } from "../../UTIL/ARRAY";
import ANALYTICS from "../ANALYTICS/ANALYTICS";
import FOLLOWERS from "../USER/TRIBE/FRIENDS/FOLLOWERS";
import GAME from "../GAME/GAME";
import GAMESCORE from "../GAME/GAMESCORE";
import GAMETURN from "../GAME/GAMETURNS/GAMETURN";
import GAME_SHOPITEM from "../GAME/SHOP/GAME_SHOPITEM";
import GAME_SHOPTAB from "../GAME/SHOP/GAME_SHOPTAB";
import GAME_PLAYERINVENTORY from "../GAME/SHOP/GAME_PLAYERINVENTORY";
import GAME_CURRENCY from "../GAME/WALLET/GAME_CURRENCY";
import DAILYREWARDS from "../GAME/DAILYREWARDS/DAILYREWARDS";
import STATS from "../ITEM/INSTANCE/STATS";
import TAG from "../ITEM/INSTANCE/TAG/TAG";
import AWESOME from "../ITEM/INSTANCE/AWESOME";
import INSTANCE from "../ITEM/INSTANCE/INSTANCE";
import AVATAR from "../USER/TRIBE/AVATAR";
import WALLET from "../USER/WALLET/WALLET";
import WALLET_ASSETS from "../USER/WALLET/WALLET_ASSETS";
import WALLET_HISTORY from "../USER/WALLET/WALLET_HISTORY";
import Twitter from "../USER/AUTH/Twitter";
import User from "../../Conquer/USER/User";
import Google from "../USER/AUTH/Google";
import Discord from "../USER/AUTH/Discord";
import EMAIL from "../USER/EMAIL";
import NFT_COLLECTION from "../NFT/NFT_COLLECTION";
import NFT_TOKEN from "../NFT/NFT_TOKEN";
import NFT_HISTORY from "../NFT/NFT_HISTORY";
import GAMEDATA from "../GAME/GAMEDATA";
class SocketInstance 
{
    // Todo, destroy instances on disconnect

    // OUR ROOM [ myAvatarID, yourAvatarID ] 

    public static gameRooms : any = {};

    public socket           : Socket;
    public socketID         : any;
    public User             : any = {};
    public myGameRooms      : any = {};
 
    constructor( socket:Socket ) 
    {
        this.socket = socket;
        this.socketID     = socket.id;

       // log("[SERVER]: New SOCKET instance", this.socketID );

        this.socket.on( 'action', this.onAction.bind(this) );
        this.socket.on( 'message', this.onMessage.bind(this) );
        this.socket.on( "disconnect", this.onDisconnect.bind(this) );
    };

    public onAction( action:any, vars?: any, callback?: Function ) 
    {
       // log( "[SERVER]: client action requested", action, vars );

        vars        = vars || {};
        let self    = this;

        // Register and login
        
        if( action == ACTIONS.AUTH_SET )                        return map( AUTH.set( vars ) );
        if( action == ACTIONS.AUTH_GET )                        return map( AUTH.get( vars ) );

        if( action == ACTIONS.FILE_GET)                         return map( FILE.get( vars ) );

        if( action == ACTIONS.FRIENDS_CHANGE )                  return map( FRIENDS.change( vars ) );
        if( action == ACTIONS.FRIENDS_REMOVE )                  return map( FRIENDS.remove( vars ) );
        if( action == ACTIONS.ANALYTICS_GET )                   return map( ANALYTICS.get( vars ) );

        if( action == ACTIONS.GAME_GETONE )                     return map( GAME.getOne( vars ) );

        if( action == ACTIONS.GAMESCORE_GETALLTIME )            return map( GAMESCORE.getAllTime( vars ) );
        if( action == ACTIONS.GAMESCORE_GETTODAY )              return map( GAMESCORE.getToday( vars ) );

        if( action == ACTIONS.GAMETURN_GETONE )                 return map( GAMETURN.getOne( vars ) );
        if( action == ACTIONS.GAME_SHOPTAB_GET )                return map( GAME_SHOPTAB.get( vars ) );

        if( action == ACTIONS.GAME_PLAYERINVENTORY_CHANGE )     return map( GAME_PLAYERINVENTORY.change( vars ) );
        if( action == ACTIONS.GAME_PLAYERINVENTORY_REMOVE )     return map( GAME_PLAYERINVENTORY.remove( vars ) );
        if( action == ACTIONS.GAME_CURRENCY_CHANGE )            return map( GAME_CURRENCY.change( vars ) );

        if( action == ACTIONS.STATS_GETONE )                    return map( STATS.getOne( vars ) );
        if( action == ACTIONS.TAG_ASSOCIATIONS_GET )            return map( TAG.get( vars ) );
        if( action == ACTIONS.AWESOME_GETONE )                  return map( AWESOME.getOne( vars ) );
        if( action == ACTIONS.INSTANCE_GETONE )                 return map( INSTANCE.getOne( vars ) );

        if( action == ACTIONS.AVATAR_GET )                      return map( AVATAR.get( vars ) );
        if( action == ACTIONS.AVATAR_GETONE )                   return map( AVATAR.getOne( vars ) );
        
        if( action == ACTIONS.SOCIAL_TWITTER_SHARE )            return map( Twitter.Share ( vars ) );
        if( action == ACTIONS.SOCIAL_GOOGLE_SHARE_GET )         return map( Google.ShareGet ( vars ) );
        if( action == ACTIONS.SOCIAL_GOOGLE_SHARE )             return map( Google.Share ( vars ) );
        if( action == ACTIONS.SOCIAL_DISCORD_SHARE_GET )        return map( Discord.ShareGet ( vars ) );
        if( action == ACTIONS.SOCIAL_DISCORD_SHARE )            return map( Discord.Share ( vars ) );

        if( action == ACTIONS.EMAIL_SEND )                      return map( EMAIL.send( vars ) );

        if( action == ACTIONS.NFT_COLLECTION_GET )              return map( NFT_COLLECTION.get( vars ) );
        if( action == ACTIONS.NFT_TOKEN_GET )                   return map( NFT_TOKEN.get( vars ) );
        if( action == ACTIONS.NFT_HISTORY_GET )                 return map( NFT_HISTORY.get( vars ) );

        // AT THIS POINT, AVATAR ID IS REWRITTEN
 
        vars.avatarID = this.User.avatarID;
 
        if( action == ACTIONS.NFT_COLLECTION_MINT )              return map( NFT_COLLECTION.mint( vars ) );
        if( action == ACTIONS.NFT_TOKEN_CHANGE )                return map( NFT_TOKEN.change( vars ) );

        if( action == ACTIONS.WALLET_GETSET )                   return map( WALLET.getSet( vars ) );
        if( action == ACTIONS.WALLET_SEND )                     return map( WALLET.send( vars ) );
        if( action == ACTIONS.WALLET_ASSETS_GET )               return map( WALLET_ASSETS.get( vars ) );
        if( action == ACTIONS.WALLET_HISTORY_GET )              return map( WALLET_HISTORY.get( vars ) );
 
        if( action == ACTIONS.AWESOME_SET )                     return map( AWESOME.set( vars ) );
        if( action == ACTIONS.TAG_ASSOCIATIONS_SET )            return map( TAG.set( vars ) );

        if( action == ACTIONS.GAME_DAILYREWARDS_GET )           return map( DAILYREWARDS.get( vars ) );
        if( action == ACTIONS.GAME_DAILYREWARDS_SET )           return map( DAILYREWARDS.set( vars ) );

        if( action == ACTIONS.GAME_CURRENCY_GET )               return map( GAME_CURRENCY.get( vars ) );
        if( action == ACTIONS.GAME_CURRENCY_GETONE )            return map( GAME_CURRENCY.getOne( vars ) );

        if( action == ACTIONS.GAME_PLAYERINVENTORY_GET )        return map( GAME_PLAYERINVENTORY.get( vars ) );
        if( action == ACTIONS.GAME_PLAYERINVENTORY_BUY )        return map( GAME_PLAYERINVENTORY.buy( vars ) );
 
        if( action == ACTIONS.GAMESCORE_SET )                   return map( GAMESCORE.set( vars ) );
        if( action == ACTIONS.GAMESCORE_GETFRIENDSALLTIME )     return map( GAMESCORE.getFriendsAllTime( vars ) );
        if( action == ACTIONS.GAMESCORE_GETFRIENDSTODAY )       return map( GAMESCORE.getFriendsToday( vars ) );

        if( action == ACTIONS.GAMETURN_GET )                    return map( GAMETURN.get( vars ) );
        if( action == ACTIONS.GAMETURN_SET )                    return map( GAMETURN.set( vars ) );
        if( action == ACTIONS.GAMETURN_CHANGE )                 return map( GAMETURN.change( vars ) );

        if( action == ACTIONS.GAMEDATA_GET )                    return map( GAMEDATA.get( vars ) );
        if( action == ACTIONS.GAMEDATA_SET )                    return map( GAMEDATA.set( vars ) );
        if( action == ACTIONS.GAMEDATA_REMOVE )                 return map( GAMEDATA.remove( vars ) );
 
        if( action == ACTIONS.ANALYTICS_SET )                   return map( ANALYTICS.set( vars ) );

        if( action == ACTIONS.FOLLOWERS_SET )                   return map( FOLLOWERS.set( vars ) );
        if( action == ACTIONS.FOLLOWERS_GET )                   return map( FOLLOWERS.get( vars ) );

        
        if( action == ACTIONS.ROOM_SET )                        return map( ROOM.set( vars ) );
        if( action == ACTIONS.ROOM_GET )                        return map( ROOM.get( vars ) );
        if( action == ACTIONS.ROOM_GETONE )                     return map( ROOM.getOne( vars ) );
        if( action == ACTIONS.ROOM_ENTRIES_GET )                return map( ROOM_ENTRIES.get( vars ) );  
        if( action == ACTIONS.ROOM_ENTRIES_SET )                return map( ROOM_ENTRIES.set( vars ) ); 
        if( action == ACTIONS.ROOM_ENTRIES_CHANGE )             return map( ROOM_ENTRIES.change( vars ) );  
        if( action == ACTIONS.ROOM_ENTRIES_REMOVE )             return map( ROOM_ENTRIES.remove( vars ) );  
 
        if( action == ACTIONS.FILE_SET )                        return map( FILE.set( vars ) );
   
        if( action == ACTIONS.FRIENDS_SET )                     return map( FRIENDS.set( vars ) );
        if( action == ACTIONS.FRIENDS_GET )                     return map( FRIENDS.get( vars ) );
 
        doError();

        function doCallback( vars?: any, isSuccess: boolean = true ) 
        {
            if( action == ACTIONS.AUTH_GET && isSuccess && vars ) setUser( vars );
 
            if( callback ) callback( vars || isSuccess );
        }

        function doError( vars?: any ) 
        {
            doCallback( vars, false);
        }

        function map( promise: any ) 
        {
            promise.then( doCallback ).catch( doError );
        }

        function setUser( vars?:any )
        {
            if( !vars ) return;

            vars.socketID = self.socketID; 

            extract( vars, self.User );
            delete self.User.token;
        }
 
    }

    public onMessage( messages:any ) 
    {
        for( var n in messages )
        {
            let message                         = messages[n];//QUERY.fixIDs(  );
            let roomID                          = message.roomID;

            delete message.roomID;

            if( !roomID ) continue;

            if( !SocketInstance.gameRooms[ roomID ] ) SocketInstance.gameRooms[ roomID ] = new GameRoomInstance({ roomID:roomID });

            let gameRoom : GameRoomInstance     = SocketInstance.gameRooms[ roomID ];

            this.myGameRooms[ roomID ]          = true;
 
            message.avatarID                    = this.User.avatarID;

            if( message.action == ACTIONS.PLAYERJOIN ) 
            {
                this.socket.join( roomID );
                message.data = this.User;
            }

            if( message.action == ACTIONS.PLAYERLEFT ) return this.leaveRoom( roomID );

            gameRoom.onMessage( message );
        }
    };
  
    public onDisconnect() 
    {
        this.leaveRoom();
        this.User = {};
    }

    public leaveRoom( roomID?:any )
    {
        if( !roomID )
        {
            for( let roomID in this.myGameRooms ) this.leaveRoom( roomID );
            return;
        }

        this.socket.leave( roomID );

        let gameRoom : GameRoomInstance;

        let message = { action:ACTIONS.PLAYERLEFT, avatarID:this.User.avatarID };
        gameRoom    = SocketInstance.gameRooms[ roomID ];

        delete this.myGameRooms[ roomID ];
        gameRoom.onMessage( message );
    }
 
}

export default SocketInstance;