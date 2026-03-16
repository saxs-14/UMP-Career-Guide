import React from 'react';
import styles from './Dashboard.module.css';

const CourseCard = ({ course, onViewDetails }) => {
  return (
    <div className={styles.courseCard}>
      <h4>{course.name}</h4>
      <p className={styles.faculty}>{course.faculty_name}</p>
      <p className={styles.school}>{course.school_name}</p>
      <p className={styles.duration}>Duration: {course.duration_years} year{course.duration_years !== 1 ? 's' : ''}</p>
      <p className={styles.minAPS}>Min APS: {course.min_aps_general}</p>
      <button className={styles.detailsBtn} onClick={onViewDetails}>View Details</button>
    </div>
  );
};

export default CourseCard;
