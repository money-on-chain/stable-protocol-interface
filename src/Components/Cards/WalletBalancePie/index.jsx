import React, { PureComponent } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip} from 'recharts';

const data = [
    { name: 'Group A', value: 200 },
    { name: 'Group B', value: 800 },
    { name: 'Group C', value: 300 }
];
const COLORS = ['#00a651', '#00C49F', '#ef8a13'];

export default class WalletBalancePie extends PureComponent {
    static demoUrl = 'https://codesandbox.io/s/pie-chart-with-padding-angle-7ux0o';

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
            </PieChart>
                </ResponsiveContainer>
                <span className={'money-RBTC'}>786362778 RBTC</span>
                <span className={'money-USD'}>786 USD</span>
            </div>

        );
    }
}
