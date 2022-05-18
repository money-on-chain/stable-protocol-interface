import React, { useState } from 'react';
import { Form, Input } from "antd";
import RNS from '@rsksmart/rns';
import './style.scss';
import addressHelper from '../../Lib/addressHelper';
import { DebounceInput } from 'react-debounce-input';
import web3 from 'web3';

export default function InputAddress(props) {

  const {
    title,
    className } = props;

  const [statusInput, setStatusInput] = useState(null);
  const [help, setHelp] = useState('');
  const [value, setValue] = useState('');

  const rns = new RNS(window.ethereum, window.rnsAddress && { contractAddresses: {
    registry: window.rnsAddress
  }});

  const helper = addressHelper(web3);

  const onStartResolving = (val) => {
    setValue(val);
    setHelp('...');
  };

  const addressOrRNSIsValid = (addressOrRNS) => {
    const isHexadecimal = addressOrRNS.startsWith("0x");
    const isValidChecksum = (addressOrRNS === undefined) ? false : helper.isValidAddressChecksum(addressOrRNS);

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

    return onResolutionCompleted(false, 'Address not recognize', addressOrRNS);
  };

  const onResolutionCompleted = (validateStatus, help, val) => {
    setStatusInput(validateStatus ? 'success' : 'error');
    setHelp(help);
  };

  const onChange = (e) => {
    const val = e.target.value;
    onStartResolving(val);
    if(!val) return onResolutionCompleted(true, '', val);

    addressOrRNSIsValid(val);
  };

  return (
    <div className={`InputAddressContainer ${className || ""}`}>
      <p className="InputAddressLabel">{title}</p>
      <Form>
        <Form.Item validateStatus={statusInput} help={help}>
          <DebounceInput
            value={value}
            debounceTimeout={600}
            onChange={(e) => onChange(e)}
            className={`${statusInput === 'error' ? 'formError' : ''}`}
          />
        </Form.Item>
      </Form>
    </div>
  )
}