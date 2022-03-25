import {useContext} from 'react';
import { Navigate, useRoutes } from 'react-router-dom';

import Admin from '../Layouts/Admin'
import MintStable from '../Pages/Mint/MintStable'
import MintLeveraged from '../Pages/Mint/MintLeveraged'
import MintPro from '../Pages/Mint/MintPro'
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
                { path: 'wallet/pro', element: <MintPro /> },
                { path: 'wallet/stable', element: <MintStable /> },
                { path: 'wallet/leveraged', element: <MintLeveraged /> },
                { path: 'test', element: <App /> },
                { path: '404', element: <NotFound /> },
                { path: '*', element: <Navigate to="/404" /> }
            ]
        },
        { path: '*', element: <Navigate to="/404" replace /> }
    ]);
}