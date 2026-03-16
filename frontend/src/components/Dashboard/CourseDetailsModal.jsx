import React, { useState, useEffect } from 'react';
import { getCourseById } from '../../services/api';
import styles from './CourseDetailsModal.module.css';

const CourseDetailsModal = ({ courseId, onClose }) => {
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await getCourseById(courseId);
        setCourse(res.data);
      } catch (err) {
        console.error('Failed to load course details', err);
        setError('Failed to load course details. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    fetchCourse();
  }, [courseId]);

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  return (
    <div className={styles.overlay} onClick={onClose} role="dialog" aria-modal="true">
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <button className={styles.closeBtn} onClick={onClose} aria-label="Close">✕</button>

        {loading && (
          <div className={styles.loadingState}>
            <div className={styles.spinner} />
            <p>Loading course details...</p>
          </div>
        )}

        {error && <p className={styles.error}>{error}</p>}

        {course && (
          <>
            <div className={styles.modalHeader}>
              <h2>{course.name}</h2>
              {course.code && <span className={styles.code}>{course.code}</span>}
            </div>

            <div className={styles.infoGrid}>
              <div className={styles.infoItem}>
                <span className={styles.label}>Faculty</span>
                <span className={styles.value}>{course.faculty_name}</span>
              </div>
              <div className={styles.infoItem}>
                <span className={styles.label}>School</span>
                <span className={styles.value}>{course.school_name}</span>
              </div>
              <div className={styles.infoItem}>
                <span className={styles.label}>Duration</span>
                <span className={styles.value}>
                  {course.duration_years} year{course.duration_years !== 1 ? 's' : ''}
                </span>
              </div>
              <div className={styles.infoItem}>
                <span className={styles.label}>Minimum APS</span>
                <span className={`${styles.value} ${styles.apsValue}`}>
                  {course.min_aps_general}
                </span>
              </div>
            </div>

            {course.aps_variants && course.aps_variants.length > 0 && (
              <div className={styles.section}>
                <h3>APS Variants</h3>
                <ul className={styles.variantList}>
                  {course.aps_variants.map((v, i) => (
                    <li key={i}>
                      With <strong>{v.subject_name}</strong>: Min APS {v.min_aps}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {course.requirement_groups && course.requirement_groups.length > 0 && (
              <div className={styles.section}>
                <h3>Subject Requirements</h3>
                {course.requirement_groups.map((group, gi) => (
                  <div key={gi} className={styles.requirementGroup}>
                    {group.description && (
                      <p className={styles.groupDesc}>{group.description}</p>
                    )}
                    <p className={styles.minCount}>
                      Need at least <strong>{group.min_count}</strong> of:
                    </p>
                    <ul className={styles.itemList}>
                      {group.items.map((item, ii) => (
                        <li key={ii}>
                          <span className={styles.subjectName}>
                            {item.subject_name || item.category_name}
                          </span>
                          {' '}
                          <span className={styles.levelBadge}>
                            Level {item.min_level}+
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            )}

            <div className={styles.section}>
              <h3>Career Prospects</h3>
              <p className={styles.placeholder}>
                Career information for this programme will be available in a future update.
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default CourseDetailsModal;
