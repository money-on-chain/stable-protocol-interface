import {useContext} from 'react';
import { Navigate, useRoutes } from 'react-router-dom';

import Admin from '../Layouts/Admin'
import Mint from '../Pages/Mint'
import NotFound from '../Pages/NotFound'
import Home from '../Pages/Home/index'
import App from '../App'

// import { AuthenticateContext } from '../Context/Auth'

export default function Router() {

    // const {account} = useContext(AuthenticateContext);

    return useRoutes([
        {
            path: '/',
            element: <Admin />,
            children: [
                { path: '/', element: <Home /> },
                { path: 'mint/doc', element: <Mint type="doc" /> },
                { path: 'test', element: <App /> },
                { path: '404', element: <NotFound /> },
                { path: '*', element: <Navigate to="/404" /> }
            ]
        },
        { path: '*', element: <Navigate to="/404" replace /> }
    ]);
}