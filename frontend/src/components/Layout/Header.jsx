import React from 'react';
import styles from './Layout.module.css';

const Header = () => {
  // For now, static user name; later from auth
  return (
    <header className={styles.header}>
      <span>Welcome, John Smith!</span>
    </header>
  );
};

export default Header;
