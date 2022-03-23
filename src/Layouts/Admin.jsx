import {Outlet} from 'react-router-dom';
import { Layout, Menu, Image } from 'antd';
import { HomeFilled } from '@ant-design/icons';
import logoImage from '../assets/icons/logo.svg'
import LoginButton from '../Components/Auth/LoginButton/index'

const { Header, Content, Sider } = Layout;

export default function Admin() {
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
              <Menu theme="dark" mode="inline" defaultSelectedKeys={['4']}>
                  <Menu.Item icon={<HomeFilled />} />
                  <Menu.Item icon={
                      <span className="icon-coin-stable"><span className="path1"></span><span className="path2"></span></span>
                  } />
              </Menu>
          </Sider>
          <Layout>
              <Header className="Header" style={{ paddingLeft: 18 }}>
                  <Image
                      height={40}
                      src={logoImage}
                  />
                  <div className="Spacer"></div>
                  <LoginButton text="Connect" status="Active" />
              </Header>
              <Content className="page-container">
                  <Outlet/>
              </Content>
          </Layout>
      </Layout>
  );
}
