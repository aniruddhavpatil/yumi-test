import React from 'react';
import Order from '../Order';

const UpcomingOrders = (props) => {
  const orders = props.orders.upcoming.map((order) => (
    <Order {...order} />
  ));
  return (
    <div>
      {
        orders
      }
    </div>
  );
};

export default UpcomingOrders;
