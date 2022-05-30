import '../assets/css/global.scss';
import { Outlet } from 'react-router-dom';
import { Layout, Menu, Image, Drawer, Button } from 'antd';
import { HomeFilled, MenuOutlined, CloseOutlined, PieChartFilled, InfoCircleFilled } from '@ant-design/icons';
import logoImage from '../assets/icons/logo.svg';
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
    const navigate = useNavigate();
    const location = useLocation();
    const { accountData } = useContext(AuthenticateContext);
    const [drawerVisible, setDrawerVisible] = useState(false);
    const loginButtonSettings = accountData.Wallet
        ? {
            title: accountData.truncatedAddress,
            subtitle: new BigNumber(accountData.Balance).toFixed(4) + ' RBTC',
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
        setSelectedMenu(selectedMenuKey);
    };

    useEffect(() => {
        checkSelectedMenu();
    }, [location.pathname]);

    const toggleDrawerVisible = () => {
        setDrawerVisible(!drawerVisible);
    };

    const [t, i18n] = useTranslation(["global", 'moc'])

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
                        icon={<HomeFilled />}
                    />
                    <Menu.Item
                        key="mint-stable"
                        onClick={() => navigate('/wallet/stable')}
                        icon={<span className="icon-icon-stable"></span>}
                    />
                    <Menu.Item
                        key="mint-pro"
                        onClick={() => navigate('/wallet/pro')}
                        icon={<span className="icon-icon-riskpro"></span>}
                    />
                    <Menu.Item
                        key="mint-leveraged"
                        onClick={() => navigate('/wallet/leveraged')}
                        icon={<span className="icon-icon-riskprox"></span>}
                    />
                    <Menu.Item
                        key="rewards"
                        onClick={() => navigate('/rewards')}
                        icon={<span className="icon-icon-moc"></span>}
                    />
                    <Menu.Item
                        key="getRBTC"
                        onClick={() => navigate('/getRBTC')}
                        icon={<span className="icon-icon-btc"></span>}
                    />
                    <Menu.Item
                        key="metrics"
                        onClick={() => navigate('/metrics')}
                        icon={<PieChartFilled />}
                    />
                    <SubMenu key="information" title="Profile" icon={<InfoCircleFilled />} theme={'light'}>
                        <Menu.Item key="contract_repository" onClick={() => window.open('https://github.com/money-on-chain/main-RBTC-contract', '_self')}>{t('MoC.info-button.contract-repository', { ns: 'moc' })}</Menu.Item>
                        <Menu.Item key="webapp_repository" onClick={() => window.open('https://github.com/money-on-chain/webapp-stable-ipfs', '_self')}>{t('MoC.info-button.webapp-repository', { ns: 'moc' })}</Menu.Item>
                        <Menu.Item key="help_center" onClick={() => window.open('https://wiki.moneyonchain.com/', '_self')}>{t('MoC.menu-sidebar.faqs', { ns: 'moc' })}</Menu.Item>
                    </SubMenu>
                </Menu>
            </Sider>
            <Layout>
                <Header className="Header" style={{ paddingLeft: 18 }}>
                    <Image height={40} src={logoImage} />
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
                        Home
                    </Menu.Item>
                    <Menu.Item
                        key="mint-stable"
                        onClick={() => navigate('/wallet/stable')}
                        icon={<span className="icon-icon-stable"></span>}
                    >
                        DoC
                    </Menu.Item>
                    <Menu.Item
                        key="mint-pro"
                        onClick={() => navigate('/wallet/pro')}
                        icon={<span className="icon-icon-riskpro"></span>}
                    >
                        BPro
                    </Menu.Item>
                    <Menu.Item
                        key="mint-leveraged"
                        onClick={() => navigate('/wallet/leveraged')}
                        icon={<span className="icon-icon-riskprox"></span>}
                    >
                        BTCx
                    </Menu.Item>

                    <Menu.Item
                        key="mint-leveraged"
                        onClick={() => navigate('/metrics')}
                        icon={PieChartFilled}
                    >
                        BTCx
                    </Menu.Item>
                    <Menu.Item
                        key="rewards"
                        onClick={() => navigate('/rewards')}
                        icon={<span className="icon-icon-moc"></span>}
                    >
                        MoC
                    </Menu.Item>
                </Menu>
            </Drawer>
        </Layout>
    );
}
