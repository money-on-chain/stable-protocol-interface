import {Outlet} from 'react-router-dom';
import { Layout, Menu, Image } from 'antd';
import { HomeFilled } from '@ant-design/icons';
import logoImage from '../assets/icons/logo.svg'
import LoginButton from '../Components/Auth/LoginButton/index'
import { useContext, useState, useEffect } from 'react';
import {useNavigate, useLocation} from "react-router-dom";
import { AuthenticateContext } from '../Context/Auth'
const { Header, Content, Sider } = Layout;

export default function Admin() {
  const navigate = useNavigate();
  const location = useLocation();
  const {accountData} = useContext(AuthenticateContext);
  const loginButtonSettings = accountData.Wallet ?
      {
        title: accountData.Wallet,
        subtitle: accountData.Balance,
        status: 'Active'
      } :
      { title: 'Connect' };
  const [selectedMenu, setSelectedMenu] = useState('');

    const checkSelectedMenu = () => {
        let selectedMenuKey = '';
        if (location.pathname === '/') {
            selectedMenuKey = 'home';
        } else if (location.pathname === '/mint/doc') {
            selectedMenuKey = 'mint-doc';
        }
        setSelectedMenu(selectedMenuKey);
        console.log(location.pathname, selectedMenuKey);
    };

    useEffect(() => {
        checkSelectedMenu();
    }, [location.pathname]);

    return (
      <Layout>
          <Sider
              className="Sidebar"
              breakpoint="lg"
              collapsed={true}
              onBreakpoint={broken => {
                  console.log(broken);
              }}
              onCollapse={(collapsed, type) => {
                  console.log(collapsed, type);
              }}
              style={{
                  overflow: 'auto',
                  height: '100vh',
                  position: 'fixed',
                  left: 0,
                  top: 0,
                  bottom: 0,
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
                      key="mint-doc"
                      onClick={() => navigate('/mint/doc')}
                      icon={<span className="icon-coin-stable"><span className="path1"></span><span className="path2"></span></span>}
                  />
              </Menu>
          </Sider>
          <Layout>
              <Header className="Header" style={{ paddingLeft: 18 }}>
                  <Image
                      height={40}
                      src={logoImage}
                  />
                  <div className="Spacer"></div>
                  <LoginButton {...loginButtonSettings} />
              </Header>
              <Content className="page-container">
                  <Outlet/>
              </Content>
          </Layout>
      </Layout>
  );
}
