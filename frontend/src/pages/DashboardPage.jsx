import React, { useState } from 'react';
import SubjectInputForm from '../components/Dashboard/SubjectInputForm';
import ApsScore from '../components/Dashboard/ApsScore';
import CourseCard from '../components/Dashboard/CourseCard';
import FacultyFilter from '../components/Dashboard/FacultyFilter';
import CourseDetailsModal from '../components/Dashboard/CourseDetailsModal';
import { calculateAPS } from '../services/api';
import styles from './DashboardPage.module.css';

const DashboardPage = () => {
  const [aps, setAps] = useState(null);
  const [qualifyingCourses, setQualifyingCourses] = useState([]);
  const [selectedFaculty, setSelectedFaculty] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedCourseId, setSelectedCourseId] = useState(null);

  const handleSubmit = async (subjects) => {
    setLoading(true);
    setError(null);
    try {
      const res = await calculateAPS(subjects);
      setAps(res.data.aps);
      setQualifyingCourses(res.data.qualifying);
    } catch (err) {
      console.error('Calculation failed', err);
      setError('Failed to calculate APS. Please check your connection and try again.');
    } finally {
      setLoading(false);
    }
  };

  // Derive filtered list from qualifying courses, faculty filter, and search query
  const filteredCourses = qualifyingCourses.filter((course) => {
    const matchesFaculty =
      !selectedFaculty || course.faculty_id === parseInt(selectedFaculty);
    const q = searchQuery.toLowerCase();
    const matchesSearch =
      !q ||
      course.name.toLowerCase().includes(q) ||
      course.faculty_name.toLowerCase().includes(q) ||
      (course.school_name && course.school_name.toLowerCase().includes(q));
    return matchesFaculty && matchesSearch;
  });

  const handleReset = () => {
    setAps(null);
    setQualifyingCourses([]);
    setSelectedFaculty(null);
    setSearchQuery('');
    setError(null);
  };

  return (
    <div>
      {!aps ? (
        <>
          {error && <div className={styles.error}>{error}</div>}
          <SubjectInputForm onSubmit={handleSubmit} loading={loading} />
        </>
      ) : (
        <>
          <ApsScore score={aps} />

          <div className={styles.controls}>
            <FacultyFilter selectedFaculty={selectedFaculty} onChange={setSelectedFaculty} />
            <div className={styles.searchBar}>
              <input
                type="text"
                placeholder="Search courses by name, faculty or school..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={styles.searchInput}
                aria-label="Search courses"
              />
              {searchQuery && (
                <button
                  className={styles.clearSearch}
                  onClick={() => setSearchQuery('')}
                  aria-label="Clear search"
                >
                  ✕
                </button>
              )}
            </div>
          </div>

          <p className={styles.resultCount}>
            Showing <strong>{filteredCourses.length}</strong> of{' '}
            <strong>{qualifyingCourses.length}</strong> qualifying courses
          </p>

          <div className={styles.courseGrid}>
            {filteredCourses.map((course) => (
              <CourseCard
                key={course.id}
                course={course}
                onViewDetails={() => setSelectedCourseId(course.id)}
              />
            ))}
          </div>

          {filteredCourses.length === 0 && (
            <p className={styles.noCourses}>
              {searchQuery || selectedFaculty
                ? 'No courses match your search or filter. Try adjusting them.'
                : 'No qualifying courses found for your APS score.'}
            </p>
          )}

          <button className={styles.newCheckBtn} onClick={handleReset}>
            + New APS Check
          </button>

          {selectedCourseId && (
            <CourseDetailsModal
              courseId={selectedCourseId}
              onClose={() => setSelectedCourseId(null)}
            />
          )}
        </>
      )}
    </div>
  );
};

export default DashboardPage;
