import '../assets/css/global.scss';
import { Outlet } from 'react-router-dom';
import { Layout, Menu, Image, Drawer, Button } from 'antd';
import { HomeFilled, MenuOutlined, CloseOutlined, PieChartFilled, InfoCircleFilled } from '@ant-design/icons';
import LoginButton from '../Components/Auth/LoginButton/index';
import React, { useContext, useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { AuthenticateContext } from '../Context/Auth';
import { formatVisibleValue } from '../Lib/Formats';
import HeaderCoins from "../Components/Page/HeaderCoins";
import { useTranslation } from "react-i18next";
const BigNumber = require('bignumber.js');
const { Header, Content, Sider } = Layout;
const { SubMenu } = Menu;

export default function Admin() {
    const auth = useContext(AuthenticateContext);
    const navigate = useNavigate();
    const location = useLocation();
    const { accountData } = useContext(AuthenticateContext);
    const [drawerVisible, setDrawerVisible] = useState(false);

    const [t, i18n] = useTranslation(["global", 'moc']);
    const loginButtonSettings = accountData.Wallet
        ? {
            title: accountData.truncatedAddress,
            subtitle: new BigNumber(accountData.Balance).toFixed(4) + ' ' +  t('MoC.Tokens_RESERVE_code', { ns: 'moc' }),
            status: 'Active'
        }
        : { title: 'Connect' };
    const [selectedMenu, setSelectedMenu] = useState('');

    const checkSelectedMenu = () => {
        let selectedMenuKey = '';
        if (location.pathname === '/') {
            selectedMenuKey = 'home';
        } else if (location.pathname === '/wallet/stable') {
            selectedMenuKey = 'mint-stable';
        } else if (location.pathname === '/wallet/pro') {
            selectedMenuKey = 'mint-pro';
        } else if (location.pathname === '/wallet/leveraged') {
            selectedMenuKey = 'mint-leveraged';
        } else if (location.pathname === '/rewards') {
            selectedMenuKey = 'rewards';
        } else if (location.pathname === '/metrics') {
            selectedMenuKey = 'metrics';
        }
        else if (location.pathname === '/getRBTC') {
            selectedMenuKey = 'getRBTC';
        }

        setSelectedMenu(selectedMenuKey);
    };

    useEffect(() => {
        checkSelectedMenu();
    }, [location.pathname]);

    const toggleDrawerVisible = () => {
        setDrawerVisible(!drawerVisible);
    };

    return (
        <Layout>
            <Sider
                className="Sidebar"
                breakpoint="lg"
                collapsed={true}
                onBreakpoint={(broken) => { }}
                onCollapse={(collapsed, type) => { }}
                style={{
                    overflow: 'auto',
                    height: '100vh',
                    position: 'fixed',
                    left: 0,
                    top: 0,
                    bottom: 0
                }}
            >
                <div className="logo" />
                <Menu theme="dark" mode="inline" selectedKeys={[selectedMenu]}>
                    <Menu.Item
                        key="home"
                        onClick={() => navigate('/')}
                        icon={<p className={`set-icon-home-${process.env.REACT_APP_ENVIRONMENT_APP_PROJECT} ${selectedMenu=='home' ? "active" : ""}`}></p>}
                    >{t('MoC.menu-sidebar.home', { ns: 'moc' })}
                    </Menu.Item>
                    <Menu.Item
                        key="mint-stable"
                        onClick={() => navigate('/wallet/stable')}
                        icon={<p className={`set-icon-stable-${process.env.REACT_APP_ENVIRONMENT_APP_PROJECT} ${selectedMenu=='mint-stable' ? "active" : ""}`}></p>}
                    >{t('MoC.menu-sidebar.STABLEWallet', { ns: 'moc' })}
                    </Menu.Item>
                    <Menu.Item
                        key="mint-pro"
                        onClick={() => navigate('/wallet/pro')}
                        icon={<p className={`set-icon-riskpro-${process.env.REACT_APP_ENVIRONMENT_APP_PROJECT} ${selectedMenu=='mint-pro' ? "active" : ""}`}></p>}
                    >{t('MoC.menu-sidebar.RISKPROWallet', { ns: 'moc' })}
                    </Menu.Item>
                    <Menu.Item
                        key="mint-leveraged"
                        onClick={() => navigate('/wallet/leveraged')}
                        icon={<p className={`set-icon-leveraged-${process.env.REACT_APP_ENVIRONMENT_APP_PROJECT} ${selectedMenu=='mint-leveraged' ? "active" : ""}`}></p>}
                    >{t('MoC.menu-sidebar.RISKPROXWallet', { ns: 'moc' })}
                    </Menu.Item>
                    <Menu.Item
                        key="rewards"
                        onClick={() => navigate('/rewards')}
                        icon={<p className={`set-icon-rewards-${process.env.REACT_APP_ENVIRONMENT_APP_PROJECT} ${selectedMenu=='rewards' ? "active" : ""}`}></p>}
                    >{t('MoC.menu-sidebar.rewards', { ns: 'moc' })}
                    </Menu.Item>
                    <Menu.Item
                        key="getRBTC"
                        onClick={() => navigate('/getRBTC')}
                        icon={<p className={`set-icon-rbtc-${process.env.REACT_APP_ENVIRONMENT_APP_PROJECT} ${selectedMenu=='getRBTC' ? "active" : ""}`}></p>}
                    >{t('MoC.menu-sidebar.getRBTC', { ns: 'moc' })}
                    </Menu.Item>
                    <Menu.Item
                        key="metrics"
                        onClick={() => navigate('/metrics')}
                        icon={<p className={`set-icon-chart-${process.env.REACT_APP_ENVIRONMENT_APP_PROJECT} ${selectedMenu=='metrics' ? "active" : ""}`}></p>}
                    >{t('MoC.menu-sidebar.metrics', { ns: 'moc' })}
                    </Menu.Item>
                    <SubMenu key="information" title="Profile" icon={<p className={`set-icon-information-solid-${process.env.REACT_APP_ENVIRONMENT_APP_PROJECT}`}></p>} theme={'light'}>
                        <Menu.Item key="contract_repository" onClick={() => window.open('https://github.com/money-on-chain/main-RBTC-contract', '_self')}>{t('MoC.info-button.contract-repository', { ns: 'moc' })}</Menu.Item>
                        <Menu.Item key="webapp_repository" onClick={() => window.open('https://github.com/money-on-chain/webapp-stable-ipfs', '_self')}>{t('MoC.info-button.webapp-repository', { ns: 'moc' })}</Menu.Item>
                        <Menu.Item key="help_center" onClick={() => window.open('https://wiki.moneyonchain.com/', '_self')}>{t('MoC.menu-sidebar.faqs', { ns: 'moc' })}</Menu.Item>
                    </SubMenu>
                </Menu>
            </Sider>
            <Layout>
                <Header className="Header" style={{ paddingLeft: 18 }}>
                    <img src={auth.urlBase+"global/logo.svg"} className='header-logo'/>
                    <div className="MiddleSide">
                        <HeaderCoins tokenName="stable" image={'icon-rbtclogo.svg'} />
                        <HeaderCoins tokenName="riskpro" image={'BPROIcon.svg'} />
                        <HeaderCoins tokenName="riskprox" image={'BTXIcon.svg'} />
                    </div>
                    <LoginButton {...loginButtonSettings} />

                    <Button
                        onClick={toggleDrawerVisible}
                        className="MenuCollapseButton"
                        ghost
                        icon={
                            drawerVisible ? <CloseOutlined /> : <MenuOutlined />
                        }
                        style={{ marginLeft: 10 }}
                    />
                </Header>
                <Content className="page-container">
                    <Outlet />
                </Content>
            </Layout>
            <Drawer
                className="DrawerMenu"
                placement="left"
                visible={drawerVisible}
                width={250}
                onClose={toggleDrawerVisible}
            >
                <Menu theme="light" mode="inline" selectedKeys={[selectedMenu]}>
                    <Menu.Item
                        key="home"
                        onClick={() => navigate('/')}
                        icon={<HomeFilled style={{ fontSize: 30 }} />}
                    >
                        {t('MoC.menu-drawer.home', { ns: 'moc' })}
                    </Menu.Item>
                    <Menu.Item
                        key="mint-stable"
                        onClick={() => navigate('/wallet/stable')}
                        icon={<span className="icon-icon-stable"></span>}
                    >
                        {t('MoC.menu-drawer.STABLEWallet', { ns: 'moc' })}
                    </Menu.Item>
                    <Menu.Item
                        key="mint-pro"
                        onClick={() => navigate('/wallet/pro')}
                        icon={<span className="icon-icon-riskpro"></span>}
                    >
                        {t('MoC.menu-drawer.RISKPROWallet', { ns: 'moc' })}
                    </Menu.Item>
                    <Menu.Item
                        key="mint-leveraged"
                        onClick={() => navigate('/wallet/leveraged')}
                        icon={<span className="icon-icon-riskprox"></span>}
                    >
                        {t('MoC.menu-drawer.RISKPROXWallet', { ns: 'moc' })}
                    </Menu.Item>
                    <Menu.Item
                        key="rewards"
                        onClick={() => navigate('/rewards')}
                        icon={<span className="icon-icon-moc"></span>}
                    >
                        {t('MoC.menu-drawer.rewards', { ns: 'moc' })}
                    </Menu.Item>

                    <Menu.Item
                        key="getRBTC"
                        onClick={() => navigate('/getRBTC')}
                        icon={<span className="icon-icon-btc"></span>}
                    >{t('MoC.menu-sidebar.getRBTC', { ns: 'moc' })}
                    </Menu.Item>

                    <Menu.Item
                        key="metrics"
                        onClick={() => navigate('/metrics')}
                        icon={<PieChartFilled  style={{ fontSize: 30 }} />}
                    >
                        {t('MoC.menu-drawer.Metrics', { ns: 'moc' })}
                    </Menu.Item>

                </Menu>
            </Drawer>
        </Layout>
    );
}
