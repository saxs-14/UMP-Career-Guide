import React from 'react';
import { NavLink } from 'react-router-dom';
import styles from './Layout.module.css';

const Sidebar = () => {
  return (
    <aside className={styles.sidebar}>
      <div className={styles.logo}>
        <img src="/images/logo.png" alt="UCAG Logo" />
        <h2>UCAG</h2>
      </div>
      <nav className={styles.nav}>
        <NavLink to="/" className={({ isActive }) => isActive ? styles.active : ''}>
          Dashboard
        </NavLink>
        <NavLink to="/saved" className={({ isActive }) => isActive ? styles.active : ''}>
          Saved Courses
        </NavLink>
        <NavLink to="/profile" className={({ isActive }) => isActive ? styles.active : ''}>
          Profile Settings
        </NavLink>
      </nav>
    </aside>
  );
};

export default Sidebar;
