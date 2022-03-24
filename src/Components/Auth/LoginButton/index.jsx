import './style.scss'

import { useContext } from 'react'
import { AuthenticateContext } from '../../../Context/Auth'

function LoginButton(props) {

    const auth = useContext(AuthenticateContext);

    return (
        <div
            className="LoginButton"
            onClick={() => {
                if (auth.isLoggedIn) {
                    auth.disconnect();
                } else {
                    auth.connect();
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
    );
}

export default LoginButton