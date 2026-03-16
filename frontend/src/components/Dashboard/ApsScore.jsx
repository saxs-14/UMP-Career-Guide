import React from 'react';
import styles from './Dashboard.module.css';

const ApsScore = ({ score }) => {
  return (
    <div className={styles.apsCard}>
      <h3>Your APS Score</h3>
      <div className={styles.score}>{score}</div>
    </div>
  );
};

export default ApsScore;
