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
        <span onClick={onClick} style={{ display: fastBTC && 'flex','fontSize':'12px'}}>
            <img
                width={17}
                height={17}
                src={window.location.origin + '/Moc/copy2.png'}
                alt=""
                style={{marginRight: 10}}
            />
            {textToShow}
        </span>
    );
}
