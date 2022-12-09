import mongoose, { mongo } from "mongoose";
import CONQUER from "../../Frontend/CONQUER";
import DATA from "../DATA/DATA";
import FOLDER from "../ITEM/INSTANCE/FOLDER";
import ITEM from "../ITEM/ITEM";
import AUTH from "../USER/AUTH/AUTH";
import EMAIL from "../USER/EMAIL";
import AVATAR from "../USER/TRIBE/AVATAR";
import USERNAME from "../USER/USERNAME";
import ACCOUNT from "./ACCOUNT";
import TEMPORARY from "./TEMPORARY";
import LOG, { log } from "../../UTIL/LOG";
import RoomInstance from "../../Frontend/ROOMS/RoomInstance/RoomInstance";

class TEST {

    public static async Run (): Promise<void> {

        // TESTING
        try {

            let conquer1 = new CONQUER('user001');
            let conquer2 = new CONQUER('user002');

            await conquer1.init();
            await conquer2.init();

            log('==========================');
            log( conquer1.User.avatarID, "AND", conquer2.User.avatarID );

            let room1 : RoomInstance = await conquer1.Rooms.getOne( [ conquer2.User.avatarID ] );
            let room2 : RoomInstance = await conquer2.Rooms.getOne( [ conquer1.User.avatarID ] );


            room1.onMessage = function( message:any )
            {
                log("ROOM 1 GOT MESSAGE", message );
            }

            room2.onMessage = function( message:any )
            {
                log("ROOM 2 GOT MESSAGE", message );
            }
    
            room1.join();
            //room2.join();



          //  room1.entry( "Hello user2!")
         //   room2.Entries.set( "Hello user1!")


        }
        catch ( error ) {
            console.log( error );
        }

        return Promise.resolve();
    }

    public static async Fun ( w: string ) {

    }
}

namespace TEST {

}

export default TEST;
