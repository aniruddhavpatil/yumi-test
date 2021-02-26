import React from 'react';

import styles from './Orders.module.scss';
import UpcomingOrders from '../UpcomingOrders';
import PastOrders from '../PastOrders';
import LoadingOrders from '../LoadingOrders';

const Orders = (props) => {
  const { orderView } = props;
  if (orderView === 'upcoming') {
    return <UpcomingOrders className={styles.orders} {...props} />;
  }
  if (orderView === 'past') {
    return <PastOrders className={styles.orders} {...props} />;
  }
  return <LoadingOrders className={styles.orders} {...props} />;
};

export default Orders;
