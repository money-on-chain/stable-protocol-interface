import { Layout, Menu, Image, Drawer, Button } from 'antd';
import React, { useContext, useState, useEffect } from 'react';

import { AuthenticateContext } from '../../../context/Auth';
import { useProjectTranslation } from '../../../helpers/translations';
import { config } from '../../../projects/config';

import '../../../assets/css/global.scss';

import { ReactComponent as LogoIcon } from '../../../assets/icons/logo.svg';
import { ReactComponent as LogoIconTP } from '../../../assets/icons/icon-rbtclogo.svg';
import { ReactComponent as LogoIconTC } from '../../../assets/icons/TCIcon.svg';
import { ReactComponent as LogoIconTX } from '../../../assets/icons/TXIcon.svg';


const { Header, Content, Footer } = Layout;


export default function Skeleton() {    

    const { accountData, balanceRbtc } = useContext(AuthenticateContext);
    const [t, i18n, ns] = useProjectTranslation();
    const AppProject = config.environment.AppProject;

    return (
        <Layout>
            <Header>
                <div className="header-container">

                    <div className="header-logo">
                        <div className="logo-app"></div>
                    </div>

                    <div className="central-menu">
                        <a href="#" className="menu-nav-item"><i className="logo-home"></i> <span className="menu-nav-item-title">Home</span> </a>
                        <a href="#" className="menu-nav-item"><i className="logo-send"></i> <span className="menu-nav-item-title">Send</span> </a>
                        <a href="#" className="menu-nav-item"><i className="logo-exchange"></i> <span className="menu-nav-item-title">Exchange</span>  </a>
                        <a href="#" className="menu-nav-item"><i className="logo-performance"></i> <span className="menu-nav-item-title">Staking</span> </a>
                        <a href="#" className="menu-nav-item"><i className="logo-more"></i> <span className="menu-nav-item-title">More Options</span> </a>
                    </div>

                    <div className="wallet-user">
                        <div className="wallet-translation">
                            <a href="#"> EN </a> <i className="logo-translation"></i>
                        </div>
                        <div className="wallet-address">
                            <a href="#">0xC851…A81b</a> <i className="logo-wallet"></i>
                        </div>
                    </div>

                </div>
            </Header>
            <Content>
                <div className="content-container">

                    <div className="dashboard-staking-info">

                        {/* Staked */}
                        <div className="item-staking first-item">
                            <div className="logo-staking">
                                <div className="icon-staked"></div>
                            </div>
                            <div className="resume-staking">
                                <div className="number-staking">0.00</div>
                                <div className="description-staking">Flip staked</div>
                            </div>
                        </div>

                        {/* Performance */}
                        <div className="item-staking second-item">
                            <div className="logo-staking">
                                <div className="icon-gauge"></div>
                            </div>
                            <div className="resume-staking">
                                <div className="number-staking">+0.00%</div>
                                <div className="description-staking">Annualized performance</div>
                            </div>
                        </div>

                        {/* Rewarded today */}
                        <div className="item-staking second-item">
                            <div className="logo-staking">
                                <div className="icon-calendar"></div>
                            </div>
                            <div className="resume-staking">
                                <div className="number-staking">0.00</div>
                                <div className="description-staking">Flip rewarded today</div>
                            </div>
                        </div>

                        {/* Ready to claim */}
                        <div className="item-staking second-item">
                            <div className="logo-staking">
                                <div className="icon-calendar-check"></div>
                            </div>
                            <div className="resume-staking">
                                <div className="number-staking">0.00</div>
                                <div className="description-staking">Flip ready to claim</div>
                            </div>
                        </div>



                    </div>

                </div>
            </Content>
            <Footer>
                <div className="footer-container">

                </div>
            </Footer>
        </Layout>

    );
}
