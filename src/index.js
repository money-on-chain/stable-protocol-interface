import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorkerRegistration from './serviceWorkerRegistration';
import reportWebVitals from './reportWebVitals';

// import {BrowserRouter} from 'react-router-dom';
import {HashRouter} from 'react-router-dom';
import Router from "./Router";
import { AuthenticateProvider } from "./Context/Auth";
import './assets/css/global.scss'

ReactDOM.render(
  <React.StrictMode>
      <AuthenticateProvider>
          <HashRouter>
              <Router />
          </HashRouter>
      </AuthenticateProvider>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://cra.link/PWA
serviceWorkerRegistration.register();

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
