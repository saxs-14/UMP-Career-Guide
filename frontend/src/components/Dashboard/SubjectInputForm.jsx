import React, { useState, useEffect } from 'react';
import { getSubjects, getSubjectCategories } from '../../services/api';
import styles from './Dashboard.module.css';

const SubjectInputForm = ({ onSubmit, loading }) => {
  const [subjects, setSubjects] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedSubjects, setSelectedSubjects] = useState(
    Array(8).fill(null).map(() => ({ name: '', percentage: '' }))
  );

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [subjectsRes, categoriesRes] = await Promise.all([
          getSubjects(),
          getSubjectCategories(),
        ]);
        setSubjects(subjectsRes.data);
        setCategories(categoriesRes.data);
      } catch (err) {
        console.error('Failed to load subjects', err);
      }
    };
    fetchData();
  }, []);

  // Group subjects by category for dropdowns
  const subjectsByCategory = categories.map(cat => ({
    category: cat.name,
    subjects: subjects.filter(s => s.categories.includes(cat.name)),
  }));

  // Add "Other" category for subjects not in any specific group
  const otherSubjects = subjects.filter(s => !s.categories || s.categories.length === 0);
  if (otherSubjects.length > 0) {
    subjectsByCategory.push({ category: 'Other', subjects: otherSubjects });
  }

  const handleSubjectChange = (index, field, value) => {
    const newSubjects = selectedSubjects.map((s, i) =>
      i === index ? { ...s, [field]: value } : s
    );
    setSelectedSubjects(newSubjects);
  };

  const handleAddRow = () => {
    if (selectedSubjects.length < 8) {
      setSelectedSubjects([...selectedSubjects, { name: '', percentage: '' }]);
    }
  };

  const handleRemoveRow = (index) => {
    if (selectedSubjects.length > 6) {
      const newSubjects = selectedSubjects.filter((_, i) => i !== index);
      setSelectedSubjects(newSubjects);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Filter out empty rows
    const filledSubjects = selectedSubjects.filter(s => s.name && s.percentage);
    onSubmit(filledSubjects);
  };

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      <h2>Enter Your Grade 12 Subjects</h2>
      <p>Enter your 6 best subjects (up to 8). Percentages must be between 0 and 100.</p>

      <div className={styles.subjectRows}>
        {selectedSubjects.map((row, idx) => (
          <div key={idx} className={styles.subjectRow}>
            <select
              value={row.name}
              onChange={(e) => handleSubjectChange(idx, 'name', e.target.value)}
              required={idx < 6} // first 6 required
              className={styles.subjectSelect}
            >
              <option value="">Select subject</option>
              {subjectsByCategory.map(group => (
                <optgroup key={group.category} label={group.category}>
                  {group.subjects.map(sub => (
                    <option key={sub.id} value={sub.name}>
                      {sub.name}
                    </option>
                  ))}
                </optgroup>
              ))}
            </select>
            <input
              type="number"
              min="0"
              max="100"
              step="0.1"
              value={row.percentage}
              onChange={(e) => handleSubjectChange(idx, 'percentage', parseFloat(e.target.value))}
              placeholder="%"
              required={idx < 6}
              className={styles.percentageInput}
            />
            {selectedSubjects.length > 6 && (
              <button type="button" onClick={() => handleRemoveRow(idx)} className={styles.removeBtn}>
                ✕
              </button>
            )}
          </div>
        ))}
      </div>

      {selectedSubjects.length < 8 && (
        <button type="button" onClick={handleAddRow} className={styles.addBtn}>
          + Add Subject
        </button>
      )}
      <button type="submit" disabled={loading} className={styles.submitBtn}>
        {loading ? 'Calculating...' : 'Calculate APS'}
      </button>
    </form>
  );
};

export default SubjectInputForm;
