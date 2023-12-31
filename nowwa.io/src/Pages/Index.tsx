import React, { useState, useEffect } from 'react';
import ReactDOMClient from 'react-dom/client';
import Top from './Top';
import { Header, Icon, Message, Segment } from 'semantic-ui-react';
import Explorer, { ExplorerState, ExplorerStateDefault, ExplorerLoad } from './Explorer';
import Builds, { BuildStateDefault } from './Builds';
import 'semantic-ui-css/semantic.css';
import Login, { LoginStateDefault } from './Login';
import JTest from './JTest';
import Register, { RegisterStateDefault } from './Register';
import Home, { HomeStateDefault } from './Home';
import { ComponentState, UpdateComponentState } from './Utils/Helpers';
import Status from '../Core/APPS/Status';
import CONQUER from '../Conquer/CONQUER';
import Uploader, { UploaderStateDefault } from './Uploader';
import Downloader, { DownloaderState, DownloaderStateDefault } from './Downloader';
import User from '../Conquer/USER/User';
import Yohami, { YohamiStateDefault } from './yohami';
import Pages from './PAGES';

type IndexDisplay = 'None' | 'Explorer' | 'Build' | 'Test' | 'Login' | 'Register' | 'Home';

export type IndexState = ComponentState & {
    display: IndexDisplay,
    message: string,
    params?: { [key: string]: any },
    conquer?: CONQUER
};

export const IndexStateDefault: IndexState = {
    display: 'Login',
    initialized: false,
    isBusy: true,
    message: ``
}

const LoadScripts = async (urls: string[]) => {
    for (let i: number = 0; i < urls.length; i++) {
        await new Promise<void>((resolve, reject) => {

            let script = document.createElement('script');
            script.type = 'text/javascript';
            script.src = urls[i];
            script.async = true;
            script.defer = true;

            script.onload = () => {
                console.log(`script: ${urls[i]} loaded!`);
                resolve();
            }
            document.body.appendChild(script);
        });
    }
};

const Index = () => {

    const [state, setState] = useState(IndexStateDefault);

    const updateState = (updates: Partial<IndexState>) => {
        let newState = UpdateComponentState<IndexState>(state, updates);
        setState(newState);
    };

    useEffect(() => {

        console.log(`create conquer`);

        let conquer = new CONQUER();

        conquer.init().then(() => 
        {
            Pages.initalize( conquer );

            let account = conquer.User;

            if (account) {
                if (state.conquer != null) {
                    updateState({
                        initialized: true,
                        display: 'Home',
                        isBusy: false
                    });
                } else {
                    updateState({
                        initialized: true,
                        display: 'Home',
                        isBusy: false,
                        conquer: conquer
                    });
                }
            } else {
                if (state.conquer != null) {
                    updateState({
                        initialized: true,
                        isBusy: false
                    });
                } else {
                    updateState({
                        initialized: true,
                        isBusy: false,
                        conquer: conquer
                    });
                }
            }

        });

        
    }, []);

    /*
        Test
    */
    let jtest: JSX.Element = <></>;
    jtest = JTest(state);

    let loggedIn:boolean = typeof state.conquer != 'undefined' && typeof state.conquer!.User != 'undefined' && typeof state.conquer!.User!.username != 'undefined' && typeof state.conquer!.User!.token != 'undefined';

    let top: JSX.Element = <></>;
    if (false) {
        top = Top(updateState);
    }
    const [explorerState, setExplorerState] = useState(ExplorerStateDefault);
    let explorer: JSX.Element = <></>;
    if (state.display == 'Explorer') {
        explorer = Explorer(explorerState, setExplorerState);
    }

    const [gameState, setGameState] = useState(BuildStateDefault);
    const [gameStatus, setGameStatus] = useState(Status.DetailDefault);
    let build: JSX.Element = <></>;
    // if (state.display == 'Build') {
        build = Builds(gameState, setGameState, gameStatus, setGameStatus);
    // }

    const [loginState, setLoginState] = useState(LoginStateDefault);
    let login: JSX.Element = <></>;
    if (!loggedIn) {
        login = Login(loginState, setLoginState, state, updateState);
    }

    const [registerState, setRegisterState] = useState(RegisterStateDefault);
    let register: JSX.Element = <></>;
    if (state.display == 'Register') {
        register = Register(registerState, setRegisterState, state, updateState);
    }

    const [homeState, setHomeState] = useState(HomeStateDefault);
    let home: JSX.Element = <></>;
    if (loggedIn) {
        home = Home(homeState, setHomeState, state, updateState);
    }

    let yohami: JSX.Element = <></>;
    yohami = Yohami(state, updateState);
 

    const [downloaderState, setDownloaderState] = useState(DownloaderStateDefault);
    let downloader: JSX.Element = <></>;
    const [uploaderState, setUploaderState] = useState(UploaderStateDefault);
    let uploader: JSX.Element = <></>;
    if (loggedIn) {
        downloader = Downloader(downloaderState, setDownloaderState, state);
        let updateDownloaderState = (updates: Partial<DownloaderState>) => {
            let newDownloaderState = UpdateComponentState<DownloaderState>(downloaderState, updates);
            setDownloaderState(newDownloaderState);
        };
        uploader = Uploader(uploaderState, setUploaderState, state, updateDownloaderState);
    }


    return (
        <Segment placeholder>
            {yohami}
            {home}
            {jtest}
            {top}
            {login}
            {register}
            {explorer}
            {build}
            {uploader}
            {downloader}
            
        </Segment>
    );
}

let root = ReactDOMClient.createRoot(document.getElementById('root') as HTMLElement);
let index = <Index />;

root.render(index);