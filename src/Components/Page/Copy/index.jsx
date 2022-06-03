import { notification } from 'antd';

export default function Copy(props) {

    const {textToShow = '', textToCopy = '', fastBTC = false} = props;

    const onClick = () => {
        navigator.clipboard.writeText(textToCopy);
        notification.open({
            message: 'Copied',
            description: `${textToCopy} to clipboard`,
            placement: 'bottomRight'
        });
    };

    return (
        <h4 onClick={onClick} style={{ display: fastBTC && 'flex'}}>
            <img
                width={17}
                src={window.location.origin + '/Moc/copy.svg'}
                alt=""
                style={{marginRight: 10}}
            />
            {textToShow}
        </h4>
    );
}
