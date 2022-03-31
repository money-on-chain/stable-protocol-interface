import './style.scss'

import { useContext, useState, Fragment } from 'react'
import { AuthenticateContext } from '../../../Context/Auth'
import LogoutModal from '../../../Components/Modals/LogoutModal'

function LoginButton(props) {

    const auth = useContext(AuthenticateContext);
    const [logoutVisible, setLogoutVisible] = useState(false);

    const closeLogoutModal = () => {
        setLogoutVisible(false);
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
        </Fragment>
    );
}

export default LoginButton