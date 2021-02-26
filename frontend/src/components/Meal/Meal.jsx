import React from 'react';
import classNames from 'classnames';
import styles from './Meal.module.scss';

const Meal = (props) => (
  <div className={styles.meal}>
    <div className={styles.section}>
      <div className={classNames(styles.image, styles.oneThirds)}>
        <img className={styles.imagesrc} src={props.image_url} alt={props.name} />
      </div>
      <div className={styles.twoThirds}>
        <div className={styles.name}>{`${props.name} x ${props.quantity}`}</div>
        <div className={styles.description}>{props.description}</div>
      </div>
    </div>
  </div>
);

export default Meal;
