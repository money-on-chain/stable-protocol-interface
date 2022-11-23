import { Layout } from 'antd';
import React, { useContext, useState, useEffect } from 'react';

import {useProjectTranslation} from "../../../helpers/translations";
import {config} from "../../../projects/config";
import ModalExchange from "../../../components/v3/Modals/Exchange"

const { Header } = Layout;


export default function SectionHeader() {
    const [t, i18n, ns] = useProjectTranslation();
    const AppProject = config.environment.AppProject;

    return (
        <Header>
            <div className="header-container">

                <div className="header-logo">
                    <div className="logo-app"></div>
                </div>

                <div className="central-menu">
                    <a href="#" className="menu-nav-item"><i className="logo-home"></i> <span className="menu-nav-item-title">Home</span> </a>
                    <a href="#" className="menu-nav-item"><i className="logo-send"></i> <span className="menu-nav-item-title">Send</span> </a>
                    <ModalExchange />
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
    )
}