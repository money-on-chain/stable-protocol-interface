import React, { PureComponent } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip} from 'recharts';

const data = [
    { name: 'Group A', value: 200, set1: '27366633 RBTC', set2: '27366633 DOC', class: 'STABLE' },
    { name: 'Group B', value: 800, set1: '2736 RBTC', set2: '887127 BPRO', class: 'RISKPRO' },
    { name: 'Group C', value: 300, set1: '363443 RBTC', set2: '41233 RBTC', class: 'RISKPROX' }
];
const COLORS = ['#00a651', '#00C49F', '#ef8a13'];

const getIntroOfPage = (label) => {
    if (label === 'Group A') {
        return "Page A is about men's clothing";
    }
    if (label === 'Group B') {
        return "Page B is about women's dress";
    }
    if (label === 'Group  C') {
        return "Page C is about women's bag";
    }
    return '';
};

const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
        return (
            <div className="custom-tooltip pieChartTooltip">
                {/*<p className="label">{`${label} : ${payload[0].value}`}</p>*/}
                {/*<p className="intro">{getIntroOfPage(label)}</p>*/}
                <p className="value-1">{`${payload[0].payload.set1}`}</p>
                <p className={`${payload[0].payload.class}`}>{`${payload[0].payload.set2}`}</p>
            </div>
        );
    }

    return null;
};

export default class WalletBalancePie extends PureComponent {
    // static demoUrl = 'https://codesandbox.io/s/pie-chart-with-padding-angle-7ux0o';

    render() {
        return (
            <div style={{ height: 250,width:250 }}>
                <ResponsiveContainer>
            <PieChart>
                <Pie
                    data={data}
                    innerRadius={115}
                    outerRadius={120}
                    fill="#8884d8"
                    paddingAngle={1}
                    dataKey="value"
                >
                    {data.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
            </PieChart>
                </ResponsiveContainer>
                <span className={'money-RBTC'}>786362778 RBTC</span>
                <span className={'money-USD'}>786 USD</span>
            </div>

        );
    }
}
