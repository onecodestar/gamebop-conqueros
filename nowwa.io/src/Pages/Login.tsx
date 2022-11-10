import React from 'react';
import { Icon, Button, Segment, ButtonGroup, Menu, Header, Input, InputOnChangeData, Card, Grid, Divider, Label, Image, Message, Form } from 'semantic-ui-react';
import CONFIG, { authenticationLoginUrl, discordAuthUrl, discordCallbackUrl, googleAuthUrl, googleCallbackUrl, snapchatCallbackUrl, twitterAuthUrl } from '../Core/CONFIG/CONFIG';
import { IndexState, } from './Index';
import fetch, { RequestInit, Request } from 'node-fetch';
import { Hash, UpdateComponentState } from './Utils';
import { FirebaseApp, FirebaseOptions, initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import GoogleAPIs, { google } from 'googleapis';

export type LoginState = {
    initialized: boolean,
    isBusy: boolean,
    email: string,
    password: string,
    warning: string,
    twitter: string,
    discord: string,
    google: string,
    facebookReady: boolean,
}

export const LoginStateDefault: LoginState = {
    initialized: false,
    isBusy: false,
    email: '',
    password: '',
    warning: '',
    twitter: '',
    discord: '',
    google: '',
    facebookReady: false,
}

export const LoginInit = (state: LoginState): Promise<LoginState> => {
    return new Promise((resolve, reject) => {
        let twitterUrl: URL = new URL(`${window.location.origin}${twitterAuthUrl}`);
        let twitterRequest: RequestInit = {
            method: "POST",
            headers: { 'Content-Type': 'application/json' },
            body: '{}'
        };
        fetch(twitterUrl, twitterRequest)
            .then(twitterResponse => twitterResponse.json())
            .then((twitterResponse: any) => {
                if (twitterResponse.success) {

                    let facebookScript = document.createElement('script');
                    facebookScript.type = 'text/javascript';
                    facebookScript.src = 'https://connect.facebook.net/en_US/sdk.js';
                    facebookScript.async = true;
                    facebookScript.defer = true;
                    facebookScript.onload = () => {

                        let facebookAppId: string = `2303120786519319`;
                        (window as any).FB.init({
                            appId: facebookAppId,
                            autoLogAppEvents: true,
                            xfbml: true,
                            version: 'v15.0'
                        });

                        (window as any).FB.AppEvents.logPageView();

                        let discordUrl: URL = new URL(`${window.location.origin}${discordAuthUrl}`);
                        let discordRequest: RequestInit = {
                            method: "POST",
                            headers: { 'Content-Type': 'application/json' },
                            body: '{}'
                        };
                        fetch(discordUrl, discordRequest)
                            .then(discordResponse => discordResponse.json())
                            .then((discordResponse: any) => {

                                if (discordResponse.success) {

                                    let googleUrl: URL = new URL(`${window.location.origin}${googleAuthUrl}`);
                                    let googleRequest: RequestInit = {
                                        method: "POST",
                                        headers: { 'Content-Type': 'application/json' },
                                        body: '{}'
                                    };
                                    fetch(googleUrl, googleRequest)
                                        .then(googleResponse => googleResponse.json())
                                        .then((googleResponse: any) => {

                                            if (googleResponse.success) {
                                                resolve({
                                                    email: state.email,
                                                    initialized: true,
                                                    isBusy: false,
                                                    password: '',
                                                    warning: '',
                                                    twitter: twitterResponse.link,
                                                    discord: discordResponse.link,
                                                    google: googleResponse.link,
                                                    facebookReady: true
                                                });
                                            }

                                        })
                                        .catch((error: any) => {
                                            console.error(`error: ${error}`);
                                            reject(error);
                                        });
                                }

                            })
                            .catch((error: any) => {
                                console.error(`error: ${error}`);
                                reject(error);
                            });
                    };
                    document.body.appendChild(facebookScript);
                }
            })
            .catch((error: any) => {
                console.error(`error: ${error}`);
                reject(error);
            });
    });
};

const Login = (state: LoginState, setState: React.Dispatch<React.SetStateAction<LoginState>>, indexState: IndexState, setIndexState: (updates: Partial<IndexState>) => void) => {

    if (!state.initialized) {
        LoginInit(state).then(setState);
    }

    let updateState = (updates: Partial<LoginState>) => {
        let newState = UpdateComponentState<LoginState>(state, updates);
        setState(newState);
    };

    let setEmail = (event: React.ChangeEvent<HTMLInputElement>, data: InputOnChangeData) => {
        updateState({
            email: data.value
        });
    };

    let setPassword = (event: React.ChangeEvent<HTMLInputElement>, data: InputOnChangeData) => {
        updateState({
            password: data.value
        });
    };

    let setWarning = (warning: string) => {
        updateState({
            warning: warning
        });
    };

    let goToRegister = () => {
        window.history.pushState("", "", `${window.location.origin}`);
        updateState(LoginStateDefault);
        setIndexState({
            display: 'Register',
            message: ''
        });
    };

    let doLogin = () => {
        if (state.email.length == 0) {
            setWarning('email cannot be empty!');
        } else if (state.password.length == 0) {
            setWarning('password cannot be empty!');
        } else {
            // window.history.pushState("", "", `${window.location.origin}`);
            updateState({
                isBusy: true,
                warning: '',
            });
            let url: URL = new URL(`${window.location.origin}${authenticationLoginUrl}`);
            let init: RequestInit = {
                method: "POST",
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    email: state.email,
                    password: state.password
                })
            };
            fetch(url, init)
                .then(res => res.json())
                .then((res: any) => {
                    // console.log(`login response: ${JSON.stringify(res)}`);
                    if (res.success) {
                        console.log(res.value);
                        if (res.value.admin) {
                            setIndexState({
                                display: 'Build',
                                account: res.value
                            });
                        } else {
                            setIndexState({
                                display: 'Home',
                                account: res.value
                            });
                        }
                    } else {
                        updateState({
                            isBusy: false,
                            warning: res.error,
                        });
                    }
                })
                .catch((error: any) => {
                    console.error(`error: ${error}`);
                });
        }
    };

    let doTwitter = async () => {
        setIndexState({
            message: ''
        });
        window.open(state.twitter, "_self");
    };

    let doGoogle = async () => {
        setIndexState({
            message: ''
        });
        window.open(state.google, "_self");
    };

    let doFacebook = async () => {
        let FB = (window as any).FB as any;
        await new Promise<void>((resolve, reject) => {
            FB.getLoginStatus((loginStatus) => {
                // console.log(`loginStatus`, JSON.stringify(loginStatus, null, 4));
                // statusChangeCallback(response);
                if (!loginStatus.authResponse) {
                    FB.login((loginResponse) => {
                        resolve();
                    }, { scope: 'public_profile,email,user_friends' });
                } else {
                    // TODO : change into this
                    // resolve();
                    FB.login((loginResponse) => {
                        resolve();
                    }, { scope: 'public_profile,email,user_friends' });
                }
            });
        });

        let fields: string[] = [
            'name',
            'email',
        ];
        FB.api('/me', { fields: fields.join(', ') }, (apiResponse1) => {
            // console.log(`apiResponse1`, JSON.stringify(apiResponse1, null, 4));
            FB.api(`/me/friends`, {}, (apiResponse2) => {
                // console.log(`apiResponse2`, JSON.stringify(apiResponse2, null, 4));
                Hash(apiResponse1.email as string)
                    .then((token) => {
                        let redirectURL: string = `${CONFIG.PublicUrl}/Index.html?info=loggedin&name=${apiResponse1.name}&token=${token}&admin=false&id=${apiResponse1.email}&friend_count=${apiResponse2.summary.total_count}`;
                        window.location.href = redirectURL;
                    });
            });
        });
    };

    let doDiscord = async () => {
        setIndexState({
            message: ''
        });
        window.open(state.discord, "_self");
    };

    let doMetamask = async () => {
        let ethereum = (window as any).ethereum;
        if (!ethereum) {
            alert('install metamask wallet first!');
        } else {
            updateState({
                isBusy: true,
                warning: ''
            });
            (window as any).ethereum
                .request({
                    method: "eth_requestAccounts",
                })
                .then((accounts: string[]) => {
                    let email = accounts[0];
                    Hash(email as string)
                        .then((token) => {
                            let redirectURL: string = `${CONFIG.PublicUrl}/Index.html?info=loggedin&name=${email}&token=${token}&admin=false&id=${email}`;
                            window.location.href = redirectURL;
                        })
                        .catch((error) => {
                            updateState({
                                isBusy: false,
                                warning: error.message
                            });
                        });
                })
                .catch((error: any) => {
                    updateState({
                        isBusy: false,
                        warning: error.message
                    });
                });
        }
    };

    let doSnapchat = async () => {

        let snapchatClientId: string = `e6a503b3-6929-4feb-a6d9-b1dc0bd963ed`;
        let snapchatClientSecret: string = `e6a503b3-6929-4feb-a6d9-b1dc0bd963ed`;
        let snapchatRedirect: string = encodeURIComponent(`${CONFIG.PublicUrl}${snapchatCallbackUrl}`);
        let snapchatState: string = `g0qVDoSOERd-6ClRJoCoZOI-nHrpln8XKXYwLJoXbg8`;
        let snapchatScopeList: string[] = [
            "https://auth.snapchat.com/oauth2/api/user.display_name",
            "https://auth.snapchat.com/oauth2/api/user.bitmoji.avatar",
            "https://auth.snapchat.com/oauth2/api/user.external_id",
        ];
        let snapchatScope: string = encodeURIComponent(snapchatScopeList.join(' '));
        let snapchatResponseType: string = `code`;
        let snapchatUrl: string = `https://accounts.snapchat.com/accounts/oauth2/auth?client_id=${snapchatClientId}&redirect_uri=${snapchatRedirect}&response_type=${snapchatResponseType}&scope=${snapchatScope}&state=${snapchatState}`;

        window.open(snapchatUrl, "_self");
    };

    return (
        <Segment placeholder>

            <Form warning={state.warning.length > 0}>
                <Grid centered columns='8'>
                    <Grid.Row>
                        <Grid.Column>
                            <Header textAlign='center'>Login</Header>
                        </Grid.Column>
                    </Grid.Row>
                    <Grid.Row>
                        <Grid.Column verticalAlign='middle' textAlign='right' width='2'>
                            Email
                        </Grid.Column>
                        <Grid.Column width='4'>
                            <Form.Input
                                type='email'
                                placeholder='email'
                                onChange={setEmail}
                            />
                        </Grid.Column>
                    </Grid.Row>
                    <Grid.Row>
                        <Grid.Column verticalAlign='middle' textAlign='right' width='2'>
                            Password
                        </Grid.Column>
                        <Grid.Column width='4'>
                            <Form.Input
                                type='password'
                                placeholder='password'
                                onChange={setPassword}
                            />
                        </Grid.Column>
                    </Grid.Row>
                    <Grid.Row>
                        <Grid.Column textAlign='center' width='8'>
                            <Message
                                warning
                                content={state.warning}
                            />
                        </Grid.Column>
                    </Grid.Row>
                    <Grid.Row>
                        <Grid.Column>
                            <Button fluid primary onClick={doLogin} disabled={state.isBusy}><Icon name='sign in'></Icon>Login</Button>
                        </Grid.Column>
                        <Grid.Column>
                            <Button fluid primary onClick={goToRegister} disabled={state.isBusy}><Icon name='signup'></Icon>Register</Button>
                        </Grid.Column>
                    </Grid.Row>
                </Grid>

                <Divider horizontal>Or</Divider>

                <Grid centered columns='8'>
                    <Grid.Row>
                        <Grid.Column>
                            <Button fluid primary onClick={doFacebook}><Icon name='facebook'></Icon>Facebook</Button>
                        </Grid.Column>
                        <Grid.Column>
                            <Button fluid primary onClick={doTwitter}><Icon name='twitter'></Icon>Twitter</Button>
                        </Grid.Column>
                        <Grid.Column>
                            <Button fluid primary onClick={doGoogle}><Icon name='google'></Icon>Google</Button>
                        </Grid.Column>
                        <Grid.Column>
                            <Button fluid primary onClick={doDiscord}><Icon name='discord'></Icon>Discord</Button>
                        </Grid.Column>
                        <Grid.Column>
                            <Button fluid primary onClick={doSnapchat}><Icon name='snapchat'></Icon>Snapchat</Button>
                        </Grid.Column>
                        <Grid.Column>
                            <Button fluid primary onClick={doMetamask}><Icon className='metamask'></Icon>Metamask</Button>
                        </Grid.Column>
                    </Grid.Row>
                </Grid>
            </Form>
        </Segment>
    );
}

export default Login;