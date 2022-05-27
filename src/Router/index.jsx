import React from 'react';
import { useContext } from 'react';
import { Navigate, useRoutes } from 'react-router-dom';

import Admin from '../Layouts/Admin';
import NotFound from '../Pages/NotFound';
const Home = React.lazy(() => import('../Pages/Home/index'));
const MintPro = React.lazy(() => import('../Pages/Mint/MintPro'));
const MintStable = React.lazy(() => import('../Pages/Mint/MintStable'));
const MintLeveraged = React.lazy(() => import('../Pages/Mint/MintLeveraged'));
const Rewards = React.lazy(() => import('../Pages/Rewards'));
const Rbtc = React.lazy(() => import('../Pages/Rbtc'));
const Metrics = React.lazy(() => import('../Pages/Metrics'));

export default function Router() {
    return useRoutes([
        {
            path: '/',
            element: <Admin />,
            children: [
                {
                    path: '/',
                    element: <Home />
                },
                {
                    path: 'wallet/pro',
                    element: <MintPro />
                },
                {
                    path: 'wallet/stable',
                    element: <MintStable />
                },
                {
                    path: 'wallet/leveraged',
                    element: <MintLeveraged />
                },
                {
                    path: 'rewards',
                    element: <Rewards />
                },
                {
                    path: 'getRBTC',
                    element: <Rbtc />
                },
                {
                    path: 'metrics',
                    element: <Metrics />
                },
                { path: '404', element: <NotFound /> },
                { path: '*', element: <Navigate to="/404" /> }
            ]
        },
        { path: '*', element: <Navigate to="/404" replace /> }
    ]);
}
