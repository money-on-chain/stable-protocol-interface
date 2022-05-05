import { Tooltip } from 'antd';
import NumericLabel from 'react-pretty-numbers';
import { adjustPrecision, formatLocalMap } from '../../Lib/Formats';

const LargeNumber = ({ amount, currencyCode, includeCurrency, numericLabelParams, className }) => {

    if (amount !== null && amount !== '' && !Number.isNaN(amount)) {
        const { value, decimals } = adjustPrecision(amount, currencyCode);
        const params = Object.assign(
            {
                shortFormat: true,
                justification: 'L',
                locales: 'en',
                shorFormatMinvalue: 1000000,
                commafy: true,
                shortFormatPrecision: decimals,
                precision: decimals,
                title: ''
            },
            numericLabelParams
        );

        return (
            <Tooltip title={value === 0 ? '0' : value.toFormat(formatLocalMap['en'])}>
                <div className={className}>
                    <NumericLabel {... {params }}>{value.toString()}</NumericLabel>
                    {includeCurrency && currencyCode}
                </div>
            </Tooltip>
        );
    }

    return (
        <Tooltip title="--">
            --
        </Tooltip>
    )
};

export {
    LargeNumber
};
