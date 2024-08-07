import React from 'react';
import { Card, Skeleton } from 'antd';
const OnLoadingAuthBody = (props) => {
    const { title } = props;
    return (
        <Card
            title={title}
            className="Card MintOrRedeemToken"
            style={{ height: '100%' }}
        >
            <Skeleton active={true} paragraph={{ rows: 6 }}></Skeleton>
        </Card>
    );
};

export default OnLoadingAuthBody;
