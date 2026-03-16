import React, { useState } from 'react';
import SubjectInputForm from '../components/Dashboard/SubjectInputForm';
import ApsScore from '../components/Dashboard/ApsScore';
import CourseCard from '../components/Dashboard/CourseCard';
import FacultyFilter from '../components/Dashboard/FacultyFilter';
import { calculateAPS } from '../services/api';
import styles from './DashboardPage.module.css';

const DashboardPage = () => {
  const [aps, setAps] = useState(null);
  const [qualifyingCourses, setQualifyingCourses] = useState([]);
  const [filteredCourses, setFilteredCourses] = useState([]);
  const [selectedFaculty, setSelectedFaculty] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (subjects) => {
    setLoading(true);
    try {
      const res = await calculateAPS(subjects);
      setAps(res.data.aps);
      setQualifyingCourses(res.data.qualifying);
      setFilteredCourses(res.data.qualifying); // initial filter is all
    } catch (err) {
      console.error('Calculation failed', err);
      alert('Failed to calculate APS. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleFacultyChange = (facultyId) => {
    setSelectedFaculty(facultyId);
    if (facultyId) {
      setFilteredCourses(qualifyingCourses.filter(c => c.faculty_id === parseInt(facultyId)));
    } else {
      setFilteredCourses(qualifyingCourses);
    }
  };

  return (
    <div className={styles.dashboard}>
      <div className={styles.sidebarPlaceholder}>{/* Sidebar will go here */}</div>
      <main className={styles.main}>
        {!aps ? (
          <SubjectInputForm onSubmit={handleSubmit} loading={loading} />
        ) : (
          <>
            <ApsScore score={aps} />
            <FacultyFilter selectedFaculty={selectedFaculty} onChange={handleFacultyChange} />
            <div className={styles.courseGrid}>
              {filteredCourses.map(course => (
                <CourseCard key={course.id} course={course} />
              ))}
            </div>
            {filteredCourses.length === 0 && (
              <p className={styles.noCourses}>No courses match your criteria.</p>
            )}
            <button
              className={styles.newCheckBtn}
              onClick={() => {
                setAps(null);
                setQualifyingCourses([]);
                setFilteredCourses([]);
              }}
            >
              + New APS Check
            </button>
          </>
        )}
      </main>
    </div>
  );
};

export default DashboardPage;
