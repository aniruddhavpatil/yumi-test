import React, { useState } from 'react';
import classNames from 'classnames';
import moment from 'moment';
import styles from './Order.module.scss';
import Meal from '../Meal';

const Order = (props) => {
  console.log('order props', props);
  const meals = props.meals.map((meal) => (
    <Meal {...meal} />
  ));

  const [showDetails, setShowDetails] = useState(false);

  const toggleDetails = () => setShowDetails(!showDetails);

  const details = (
    <div className={styles.details}>
      <div className={styles.meals}>
        {meals}
      </div>
    </div>
  );

  const date = moment(new Date(props.delivery_date)).format('MMMM D Y');
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
            {`${props.meal_count} ` + 'Jars'}
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
