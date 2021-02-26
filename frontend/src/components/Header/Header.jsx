import React from 'react';
import styles from './Header.module.scss';
import logo from '../../assets/logo.svg';

const Header = () => (
  <div className={styles.header}>
    <div>
      <img className={styles.logo} src={logo} alt="yumi-logo" />
    </div>
    <div className={styles.menu}>
      <div>Home</div>
      <div>Orders</div>
      <div>Shop</div>
      <div>Gifts</div>
      <div>Rewards</div>
      <div>Settings</div>
    </div>
    <div className={styles.right}>
      <div className={styles.points}>500</div>
      <div className={styles.text}>
        YOUR POINT BALANCE
      </div>
    </div>
  </div>
);

export default Header;
