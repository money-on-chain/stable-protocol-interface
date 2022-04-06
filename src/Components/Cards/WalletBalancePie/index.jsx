import React, { PureComponent } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip} from 'recharts';

const data = [
    { name: 'Group A', value: 400 },
    { name: 'Group B', value: 300 },
    { name: 'Group C', value: 300 },
    { name: 'Group D', value: 200 },
];
const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

export default class WalletBalancePie extends PureComponent {
    static demoUrl = 'https://codesandbox.io/s/pie-chart-with-padding-angle-7ux0o';

    render() {
        return (
            <div style={{ width: '100%', height: 185 }}>
                <ResponsiveContainer>
            <PieChart onMouseEnter={this.onPieEnter}>
                <Pie
                    data={data}
                    innerRadius={75}
                    outerRadius={80}
                    fill="#8884d8"
                    paddingAngle={5}
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
