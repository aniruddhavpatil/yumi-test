import React from 'react';

import styles from './Orders.module.scss';
import UpcomingOrders from '../UpcomingOrders';
import PastOrders from '../PastOrders';
import LoadingOrders from '../LoadingOrders';

const Orders = (props) => {
  const OrderView = (props) => {
    if (props.orderView === 'upcoming') {
      return <UpcomingOrders {...props} />;
    }
    if (props.orderView === 'past') {
      return <PastOrders {...props} />;
    }
    return <LoadingOrders {...props} />;
  };
  return (
    <div className={styles.orders}>
      <OrderView {...props} />
    </div>

  );
};

export default Orders;
