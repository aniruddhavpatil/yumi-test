import React, { useState } from 'react';
import classNames from 'classnames';
import moment from 'moment';
import styles from './Order.module.scss';
import Meal from '../Meal';

const Order = ({ meals, delivery_date: deliveryDate, meal_count: mealCount }) => {
  const Meals = () => meals.map((meal) => (
    <Meal {...meal} />
  ));

  const [showDetails, setShowDetails] = useState(false);

  const toggleDetails = () => setShowDetails(!showDetails);

  const details = (
    <div className={styles.details}>
      <div className={styles.meals}>
        <Meals />
      </div>
    </div>
  );

  const date = moment(new Date(deliveryDate)).format('MMMM D Y');
  return (
    <>
      <div className={styles.order}>
        <div className={classNames(styles.section, styles.left)}>
          <div className={classNames(styles.item, styles.date)}>{date}</div>
          <div className={classNames(styles.item, styles.status)}>Order Status</div>
          <span
            onClick={
              () => toggleDetails()
            }
            className={
                  classNames(styles.item, styles.control)
                }
          >
            Show/Hide Details
          </span>
        </div>
        <div className={classNames(styles.section, styles.right)}>
          <div className={classNames(styles.item, styles.quantity)}>
            {`${mealCount} Jars`}
          </div>
          <button className={classNames(styles.item, styles.button)} type="button">
            Get Order
          </button>
        </div>
      </div>
      {showDetails ? details : null}
    </>
  );
};

export default Order;
