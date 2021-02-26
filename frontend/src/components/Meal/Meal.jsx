import React from 'react';
import classNames from 'classnames';
import styles from './Meal.module.scss';

const Meal = ({
  image_url: imageUrl, name, description, quantity,
}) => (
  <div className={styles.meal}>
    <div className={styles.section}>
      <div className={classNames(styles.image, styles.oneThirds)}>
        <img className={styles.imagesrc} src={imageUrl} alt={name} />
      </div>
      <div className={styles.twoThirds}>
        <div className={styles.name}>{`${name} x ${quantity}`}</div>
        <div className={styles.description}>{description}</div>
      </div>
    </div>
  </div>
);

export default Meal;
