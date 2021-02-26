import React from 'react';
import Order from '../Order';

const UpcomingOrders = ({ orders }) => orders.upcoming.map((order) => (
  <Order {...order} />
));

export default UpcomingOrders;
