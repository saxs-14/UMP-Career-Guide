// backend/models/courseModel.js

const pool = require('../config/db');

/**
 * Get all faculties
 */
const getFaculties = async () => {
  const result = await pool.query('SELECT id, name FROM faculties ORDER BY name');
  return result.rows;
};

/**
 * Get all courses with basic info (optionally filter by faculty)
 */
const getCourses = async (facultyId = null) => {
  let query = `
    SELECT c.id, c.name, c.code, c.duration_years, c.min_aps_general,
           s.name as school_name, f.name as faculty_name, f.id as faculty_id
    FROM courses c
    JOIN schools s ON c.school_id = s.id
    JOIN faculties f ON s.faculty_id = f.id
  `;
  const params = [];
  if (facultyId) {
    query += ' WHERE f.id = $1';
    params.push(facultyId);
  }
  query += ' ORDER BY f.name, s.name, c.name';
  const result = await pool.query(query, params);
  return result.rows;
};

/**
 * Get full course details including requirements
 */
const getCourseDetails = async (courseId) => {
  // Get basic info
  const courseQuery = `
    SELECT c.*, s.name as school_name, f.name as faculty_name
    FROM courses c
    JOIN schools s ON c.school_id = s.id
    JOIN faculties f ON s.faculty_id = f.id
    WHERE c.id = $1
  `;
  const courseResult = await pool.query(courseQuery, [courseId]);
  if (courseResult.rows.length === 0) return null;
  const course = courseResult.rows[0];

  // Get APS variants
  const variantsQuery = `
    SELECT cv.min_aps, s.name as subject_name
    FROM course_aps_variants cv
    JOIN subjects s ON cv.subject_id = s.id
    WHERE cv.course_id = $1
  `;
  const variantsResult = await pool.query(variantsQuery, [courseId]);
  course.aps_variants = variantsResult.rows;

  // Get requirement groups and items
  const groupsQuery = `
    SELECT rg.id as group_id, rg.min_count, rg.description
    FROM requirement_groups rg
    WHERE rg.course_id = $1
    ORDER BY rg.id
  `;
  const groupsResult = await pool.query(groupsQuery, [courseId]);
  const groups = [];

  for (const group of groupsResult.rows) {
    const itemsQuery = `
      SELECT ri.min_level,
             s.name as subject_name,
             sc.name as category_name
      FROM requirement_items ri
      LEFT JOIN subjects s ON ri.subject_id = s.id
      LEFT JOIN subject_categories sc ON ri.category_id = sc.id
      WHERE ri.requirement_group_id = $1
    `;
    const itemsResult = await pool.query(itemsQuery, [group.group_id]);
    group.items = itemsResult.rows;
    groups.push(group);
  }
  course.requirement_groups = groups;

  return course;
};

/**
 * Get all subjects (for dropdowns)
 */
const getSubjects = async () => {
  const result = await pool.query(`
    SELECT s.id, s.name, 
           array_agg(sc.name) as categories
    FROM subjects s
    LEFT JOIN subject_category_members scm ON s.id = scm.subject_id
    LEFT JOIN subject_categories sc ON scm.category_id = sc.id
    GROUP BY s.id
    ORDER BY s.name
  `);
  return result.rows;
};

/**
 * Get subject categories (for grouping)
 */
const getSubjectCategories = async () => {
  const result = await pool.query('SELECT id, name FROM subject_categories ORDER BY name');
  return result.rows;
};

module.exports = {
  getFaculties,
  getCourses,
  getCourseDetails,
  getSubjects,
  getSubjectCategories
};
