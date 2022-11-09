import React from 'react';
import ReactDOM from 'react-dom';
import { HashRouter } from 'react-router-dom';
import {I18nextProvider} from "react-i18next";
import i18next from "i18next";

import './index.css';
import './assets/css/global.scss';
import './assets/css/components.scss';

import * as serviceWorkerRegistration from './serviceWorkerRegistration';
import reportWebVitals from './reportWebVitals';
import { AuthenticateProvider } from './Context/Auth';
import {config} from "./Config/config";
import IconWaiting from './assets/icons/status-pending.png';

console.log(`Starting app version: ${process.env.REACT_APP_VERSION}`);

const Router = React.lazy(() => import('./Router/projects/' + config.environment.AppProject.toLowerCase()));

async function loadTranslations() {
    try {
        let moc_es= await import('./projects/'+config.environment.AppProject.toLowerCase()+'/es/moc.json');
        let moc_en= await import('./projects/'+config.environment.AppProject.toLowerCase()+'/en/moc.json');
        let rdoc_es = await import ('./projects/'+config.environment.AppProject.toLowerCase()+'/es/moc.json')
        let rdoc_en = await import ('./projects/'+config.environment.AppProject.toLowerCase()+'/en/moc.json')
        let global_es= await import('./projects/global-es.json')
        let global_en= await import('./projects/global-en.json')

        await i18next.init({
            interpolation: {escapeValue:false},
            lng: "en",
            resources: {
                es: {
                    global: global_es,
                    moc: moc_es,
                    rdoc: rdoc_es
                },
                en: {
                    global: global_en,
                    moc: moc_en,
                    rdoc: rdoc_en
                },
            }
        })
    } catch (error) {
        console.log(`Something wrong: ${error}`);
    }
}

loadTranslations()

ReactDOM.render(
    <React.StrictMode>
        <I18nextProvider i18n={i18next}>
            <AuthenticateProvider>
                <HashRouter>
                    {/*<React.Suspense fallback={ <span>Loading...</span> }>*/}
                    <React.Suspense fallback={ <img style={{'position':'fixed','left': '50%','top':'50%','transform':'translateX(-50%) translateY(-50%)'}} width={50} height={50} src={IconWaiting} alt="Loading..." className={'img-status rotate'}/> }>
                        <Router />
                    </React.Suspense>
                </HashRouter>
            </AuthenticateProvider>
        </I18nextProvider>
    </React.StrictMode>,
    document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://cra.link/PWA
serviceWorkerRegistration.unregister();

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
