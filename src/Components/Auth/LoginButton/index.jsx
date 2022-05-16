import './style.scss'

import { useContext, useState, Fragment } from 'react'
import { AuthenticateContext } from '../../../Context/Auth'
import LogoutModal from '../../../Components/Modals/LogoutModal'
import Select from 'antd/lib/select';
import {useTranslation} from "react-i18next";

function LoginButton(props) {

    const auth = useContext(AuthenticateContext);
    const [logoutVisible, setLogoutVisible] = useState(false);

    const closeLogoutModal = () => {
        setLogoutVisible(false);
    };

    const [t, i18n]= useTranslation(["global",'moc'])


    const { Option } = Select;
    const availableLang= ["en", "es"]

    const [prefLanguage, setPrefLanguage] = useState("en");

    const handleChangeLanguage= (event) => {
        setPrefLanguage(event);
        i18n.changeLanguage(event)
    };


    return (
        <Fragment>
            <div
                className="LoginButton"
                onClick={() => {
                    if (auth.isLoggedIn) {
                        setLogoutVisible(true)
                    } else {
                        auth.connect()
                    }
                }}
            >
                <div className="Text">
                    <div className="Title">{ props.title }</div>
                    <div className="Subtitle">{ props.subtitle }</div>
                </div>
                <div className={`StatusIcon ${props.status}`}>
                    <div className="Circle"></div>
                </div>
            </div>
            <LogoutModal
                visible={logoutVisible}
                handleClose={closeLogoutModal}
            />
            <Select className="customSelect"  value={prefLanguage}  onChange={handleChangeLanguage}>
                <Option value="en">
                    <div className="container_flag">EN</div>
                </Option>

                {availableLang.includes('es') && (
                    <Option value="es">
                        <div className="container_flag">ES</div>
                    </Option>
                )}
            </Select>
        </Fragment>
    );
}

export default LoginButton