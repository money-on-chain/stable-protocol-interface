import React, { useState } from 'react';
import { Form, Input } from "antd";
import RNS from '@rsksmart/rns';
import './style.scss';
import { isValidAddressChecksum } from '../../Lib/addressHelper';
import { DebounceInput } from 'react-debounce-input';

export default function InputAddress(props) {

    const { // isValidChecksumAddress,
        title,
        className } = props;

    const [statusInput, setStatusInput] = useState(null);
    const [help, setHelp] = useState('');
    const [value, setValue] = useState('');

    const rns = new RNS(window.ethereum, window.rnsAddress && { contractAddresses: {
        registry: window.rnsAddress
    }});

    const onStartResolving = (value) => {
        setValue(value);
        setHelp('...');
    };

    const addressOrRNSIsValid = (addressOrRNS) => {
        const isHexadecimal = addressOrRNS.startsWith("0x");
        const isValidChecksum = isValidAddressChecksum(addressOrRNS);

        if (!isValidChecksum && isHexadecimal) {
            return onResolutionCompleted(false, 'Double check if it is the right address and continue.', addressOrRNS);
        }
        if (isHexadecimal && isValidChecksum) {
            return onResolutionCompleted(true, '', addressOrRNS);
        }
        if (!isHexadecimal && rns.utils.isValidDomain(addressOrRNS)) {
            return rns.addr(addressOrRNS)
                .then(addr => onResolutionCompleted(true, `Address: ${addr}`, addr))
                .catch(_ => onResolutionCompleted(false, 'Address not found', addressOrRNS));
        }
    };

    const onResolutionCompleted = (validateStatus, help, value) => {
        setStatusInput(validateStatus ? 'success' : 'error');
        setHelp(help);
        onChange({ target: { value: value?.toLowerCase() } });
    };

    const onChange = (e) => {
        const value = e.target.value;
        onStartResolving(value);
        if(!value) return onResolutionCompleted(true, null, value);

        // addressOrRNSIsValid(value);
    };

    return (
        <div className={`InputAddressContainer ${className || ""}`}>
            <p className="">{title}</p>
            <Form>
                <Form.Item validateStatus={statusInput} help={help}>
                    <Input
                        value={value}
                        onChange={(e) => onChange(e)}
                        status={statusInput}
                        className="input"
                    />
                </Form.Item>
            </Form>
        </div>
    )
}