import React, { useState, useEffect } from 'react';
import { getFaculties } from '../../services/api';
import styles from './Dashboard.module.css';

const FacultyFilter = ({ selectedFaculty, onChange }) => {
  const [faculties, setFaculties] = useState([]);

  useEffect(() => {
    const fetchFaculties = async () => {
      try {
        const res = await getFaculties();
        setFaculties(res.data);
      } catch (err) {
        console.error('Failed to load faculties', err);
      }
    };
    fetchFaculties();
  }, []);

  return (
    <div className={styles.filter}>
      <label htmlFor="faculty">Filter by Faculty:</label>
      <select
        id="faculty"
        value={selectedFaculty || ''}
        onChange={(e) => onChange(e.target.value || null)}
      >
        <option value="">All Faculties</option>
        {faculties.map(f => (
          <option key={f.id} value={f.id}>{f.name}</option>
        ))}
      </select>
    </div>
  );
};

export default FacultyFilter;
