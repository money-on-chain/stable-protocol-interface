
import { Outlet } from 'react-router-dom';
import { Layout, Menu, Image, Drawer, Button } from 'antd';
import { HomeFilled, MenuOutlined, CloseOutlined, PieChartFilled, InfoCircleFilled } from '@ant-design/icons';
import React, { useContext, useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import BigNumber from "bignumber.js";

import { config } from '../../../projects/config';
import LoginButton from '../../../components/Auth/LoginButton/index';
import '../../../assets/css/global.scss';
import { AuthenticateContext } from '../../../context/Auth';
import HeaderCoins from "../../../components/Page/HeaderCoins";
import { useProjectTranslation } from '../../../helpers/translations';

import { ReactComponent as LogoIcon } from '../../../assets/icons/logo.svg';
import { ReactComponent as LogoIconTP } from '../../../assets/icons/icon-rbtclogo.svg';
import { ReactComponent as LogoIconTC } from '../../../assets/icons/TCIcon.svg';
import { ReactComponent as LogoIconTX } from '../../../assets/icons/TXIcon.svg';


const { Header, Content, Sider } = Layout;
const { SubMenu } = Menu;


export default function Skeleton() {    
    const navigate = useNavigate();
    const location = useLocation();
    const { accountData, balanceRbtc } = useContext(AuthenticateContext);
    const [drawerVisible, setDrawerVisible] = useState(false);

    const [t, i18n, ns] = useProjectTranslation();
    const AppProject = config.environment.AppProject;
    const AppMode = config.environment.AppMode;
    const loginButtonSettings = accountData.Wallet
        ? {
            title: accountData.truncatedAddress,
            subtitle: new BigNumber(AppMode === 'Moc' ? accountData.Balance : balanceRbtc).toFixed(4) + ' ' +  t(`${AppProject}.Tokens_RESERVE_code`, { ns: ns }),
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

    console.log("INNNN")

    return (
        <Layout>
            <Sider
                className="Sidebar"
                breakpoint="lg"
                collapsed={true}
                onBreakpoint={(broken) => { } }
                onCollapse={(collapsed, type) => { } }
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
                        icon={<p className={`set-icon-home ${selectedMenu == 'home' ? "active" : ""}`}></p>}
                    >{t(`${AppProject}.menu-sidebar.home`, { ns: ns })}
                    </Menu.Item>
                    <Menu.Item
                        key="mint-stable"
                        onClick={() => navigate('/wallet/stable')}
                        icon={<p className={`set-icon-tp ${selectedMenu == 'mint-stable' ? "active" : ""}`}></p>}
                    >{t(`${AppProject}.menu-sidebar.TPWallet`, { ns: ns })}
                    </Menu.Item>
                    <Menu.Item
                        key="mint-pro"
                        onClick={() => navigate('/wallet/pro')}
                        icon={<p className={`set-icon-tc ${selectedMenu == 'mint-pro' ? "active" : ""}`}></p>}
                    >{t(`${AppProject}.menu-sidebar.TCWallet`, { ns: ns })}
                    </Menu.Item>
                    <Menu.Item
                        key="mint-leveraged"
                        onClick={() => navigate('/wallet/leveraged')}
                        icon={<p className={`set-icon-tx ${selectedMenu == 'mint-leveraged' ? "active" : ""}`}></p>}
                    >{t(`${AppProject}.menu-sidebar.TXWallet`, { ns: ns })}
                    </Menu.Item>
                    <Menu.Item
                        key="rewards"
                        onClick={() => navigate('/rewards')}
                        icon={<p className={`set-icon-rewards ${selectedMenu == 'rewards' ? "active" : ""}`}></p>}
                    >{t(`${AppProject}.menu-sidebar.rewards`, { ns: ns })}
                    </Menu.Item>
                    <Menu.Item
                        key="getRBTC"
                        onClick={() => navigate('/getRBTC')}
                        icon={<p className={`set-icon-rbtc ${selectedMenu == 'getRBTC' ? "active" : ""}`}></p>}
                    >{t(`${AppProject}.menu-sidebar.getRBTC`, { ns: ns })}
                    </Menu.Item>
                    <Menu.Item
                        key="metrics"
                        onClick={() => navigate('/metrics')}
                        icon={<p className={`set-icon-chart ${selectedMenu == 'metrics' ? "active" : ""}`}></p>}
                    >{t(`${AppProject}.menu-sidebar.metrics`, { ns: ns })}
                    </Menu.Item>
                    <SubMenu key="information" title="Profile" icon={<p className={`set-icon-information-solid`}></p>} theme={'light'}>
                        <Menu.Item key="contract_repository" onClick={() => window.open(config.contractUrl, '_self')}>{t(`${AppProject}.info-button.contract-repository`, { ns: ns })}</Menu.Item>
                        <Menu.Item key="webapp_repository" onClick={() => window.open('https://github.com/money-on-chain/webapp-stable-ipfs', '_self')}>{t(`${AppProject}.info-button.webapp-repository`, { ns: ns })}</Menu.Item>
                        <Menu.Item key="help_center" onClick={() => window.open('https://wiki.moneyonchain.com/', '_self')}>{t(`${AppProject}.menu-sidebar.faqs`, { ns: ns })}</Menu.Item>
                    </SubMenu>
                </Menu>
            </Sider>
            <Layout>
                <Header className="Header" style={{ paddingLeft: 18 }}>
                    <LogoIcon className='header-logo' />
                    <div className="MiddleSide">

                    </div>
                    <LoginButton {...loginButtonSettings} />

                    <Button
                        onClick={toggleDrawerVisible}
                        className="MenuCollapseButton"
                        ghost
                        icon={drawerVisible ? <CloseOutlined /> : <MenuOutlined />}
                        style={{ marginLeft: 10 }} />
                </Header>
                <Content className="page-container">
                    <Outlet />
                </Content>
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
                            {t(`${AppProject}.menu-drawer.home`, { ns: ns })}
                        </Menu.Item>
                        <Menu.Item
                            key="mint-stable"
                            onClick={() => navigate('/wallet/stable')}
                            icon={<span className="icon-icon-stable"></span>}
                        >
                            {t(`${AppProject}.menu-drawer.TPWallet`, { ns: ns })}
                        </Menu.Item>
                        <Menu.Item
                            key="mint-pro"
                            onClick={() => navigate('/wallet/pro')}
                            icon={<span className="icon-icon-tc"></span>}
                        >
                            {t(`${AppProject}.menu-drawer.TCWallet`, { ns: ns })}
                        </Menu.Item>
                        <Menu.Item
                            key="mint-leveraged"
                            onClick={() => navigate('/wallet/leveraged')}
                            icon={<span className="icon-icon-tx"></span>}
                        >
                            {t(`${AppProject}.menu-drawer.TXWallet`, { ns: ns })}
                        </Menu.Item>
                        <Menu.Item
                            key="rewards"
                            onClick={() => navigate('/rewards')}
                            icon={<span className="icon-icon-moc"></span>}
                        >
                            {t(`${AppProject}.menu-drawer.rewards`, { ns: ns })}
                        </Menu.Item>

                        <Menu.Item
                            key="getRBTC"
                            onClick={() => navigate('/getRBTC')}
                            icon={<span className="icon-icon-btc"></span>}
                        >{t(`${AppProject}.menu-sidebar.getRBTC`, { ns: ns })}
                        </Menu.Item>

                        <Menu.Item
                            key="metrics"
                            onClick={() => navigate('/metrics')}
                            icon={<PieChartFilled style={{ fontSize: 30 }} />}
                        >
                            {t(`${AppProject}.menu-drawer.Metrics`, { ns: ns })}
                        </Menu.Item>
                    </Menu>
                </Drawer>
            </Layout>
        </Layout>
        
    );
}
