import React from 'react';
import ReactDOM from 'react-dom';
import {HashRouter} from "react-router-dom";

import {Provider} from 'mobx-react'
import Routes from './routes';

import './index.css';
import * as serviceWorker from './serviceWorker';
import 'bootstrap/dist/css/bootstrap.min.css';
import './fonts/MyriadProRegular.otf';
import {rootStore} from "./store/RootStore";

const Root = (props) => (
    
    <HashRouter>
        <Routes/>
    </HashRouter>
);
 
ReactDOM.render(
    <React.StrictMode>
        <Provider
            rootStore={rootStore}
            authStore={rootStore.authStore}
            playerStore={rootStore.playerStore}
            claimStore={rootStore.claimStore}
            settingsStore={rootStore.settingsStore}
            miscellaneousStore={rootStore.miscellaneousStore}
        ><Root/></Provider>
    </React.StrictMode>,
    document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
