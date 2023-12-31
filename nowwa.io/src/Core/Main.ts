

import CONFIG from './CONFIG/CONFIG';

import Authentication from './DEPRECATED/Authentication';
import Database from './DEPRECATED/Database';
import Storage from './CMS/Storage';
import Build from './APPS/Build';

import Email from './DEPRECATED/Email';
import SOCKET from './SOCKET/SOCKET';
import CONQUER from '../Conquer/CONQUER';
import LOG, { log } from "../UTIL/LOG";
import AUTH from './USER/AUTH/AUTH';
import EMAIL from './USER/EMAIL';
import EXPRESS from './EXPRESS/EXPRESS';
import DATA from './DATA/DATA';

import dotenv from 'dotenv';
import FILE from './CMS/FILE';
import ACCOUNT from './TESTS/ACCOUNT';
import TEMPORARY from './TESTS/TEMPORARY';
import USERNAME from './USER/USERNAME';
import mongoose from 'mongoose';
import TEST from './TESTS/TEST';
import SOCIALAUTH from './USER/AUTH/SOCIALAUTH';
import CRON from './CRON/CRON';
import WALLET from './USER/WALLET/WALLET';


class Main {
    /**
     * Initialize necessary components.
     */
    constructor() {
        this.init();
    }

    private async init(): Promise<void> {
        EXPRESS.init();

        // DEPRECATED

        await Authentication.AsyncInit();
        await Database.AsyncInit();
        await Email.AsyncInit();
        await Storage.AsyncInit();
        await Build.AsyncInit();

        // NEW CODE!

        await DATA.init();
        await AUTH.init();
        await SOCIALAUTH.init();
        await EMAIL.init();
        await SOCKET.init();
        await FILE.init();
        await CRON.init();
        await WALLET.init();

        // TESTING

        EXPRESS.listen();
        console.log('about to test again');

        await TEST.Run();
    }

}

export default Main;

var c: Main = new Main();