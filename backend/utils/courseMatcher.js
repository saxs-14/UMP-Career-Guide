// backend/utils/courseMatcher.js

const pool = require('../config/db');
const { calculateAPS, percentageToLevel } = require('./apsCalculator');

// Cache for subject categories (loaded at startup)
let categoryCache = null;

const loadCategoryCache = async () => {
  const result = await pool.query('SELECT subject_id, category_id FROM subject_category_members');
  const cache = new Map(); // subject_id -> Set of category_ids
  for (const row of result.rows) {
    if (!cache.has(row.subject_id)) {
      cache.set(row.subject_id, new Set());
    }
    cache.get(row.subject_id).add(row.category_id);
  }
  categoryCache = cache;
};

// Initialize cache when module loads
loadCategoryCache().catch(err => console.error('Failed to load category cache:', err));

const subjectInCategory = (subjectId, categoryId) => {
  if (!categoryCache) return false; // not loaded yet
  const cats = categoryCache.get(subjectId);
  return cats ? cats.has(categoryId) : false;
};

/**
 * Check if a learner meets the subject requirements for a course.
 * @param {Array} learnerSubjects - Array of { subject_id, level }
 * @param {number} courseId
 * @returns {Promise<boolean>}
 */
const meetsSubjectRequirements = async (learnerSubjects, courseId) => {
  // Get all requirement groups for the course
  const groupsQuery = `
    SELECT rg.id, rg.min_count
    FROM requirement_groups rg
    WHERE rg.course_id = $1
    ORDER BY rg.id
  `;
  const groupsResult = await pool.query(groupsQuery, [courseId]);
  const groups = groupsResult.rows;

  for (const group of groups) {
    const itemsQuery = `
      SELECT ri.min_level,
             ri.subject_id,
             ri.category_id
      FROM requirement_items ri
      WHERE ri.requirement_group_id = $1
    `;
    const itemsResult = await pool.query(itemsQuery, [group.id]);
    const items = itemsResult.rows;

    let satisfiedCount = 0;
    for (const item of items) {
      const match = learnerSubjects.some(subj => {
        if (item.subject_id) {
          return subj.subject_id === item.subject_id && subj.level >= item.min_level;
        } else if (item.category_id) {
          return subjectInCategory(subj.subject_id, item.category_id) && subj.level >= item.min_level;
        }
        return false;
      });
      if (match) satisfiedCount++;
    }
    if (satisfiedCount < group.min_count) return false;
  }
  return true;
};

/**
 * Get map of subject name to ID
 */
const getSubjectNameToIdMap = async () => {
  const result = await pool.query('SELECT id, name FROM subjects');
  const map = {};
  result.rows.forEach(row => map[row.name] = row.id);
  return map;
};

/**
 * Main matching function: given learner's subjects (with percentages), find all qualifying courses.
 * @param {Array} subjectsWithPct - [{ name, percentage }]
 * @returns {Promise<{ aps: number, qualifying: Array }>}
 */
const findQualifyingCourses = async (subjectsWithPct) => {
  // 1. Calculate APS (excluding LO by default)
  const aps = calculateAPS(subjectsWithPct, true);

  // 2. Convert percentages to levels and attach subject_id
  const subjectMap = await getSubjectNameToIdMap();
  const learnerSubjects = [];
  for (const sub of subjectsWithPct) {
    const subjectId = subjectMap[sub.name];
    if (!subjectId) {
      console.warn(`Subject "${sub.name}" not found in database – skipping`);
      continue;
    }
    learnerSubjects.push({
      subject_id: subjectId,
      level: percentageToLevel(sub.percentage)
    });
  }

  // 3. Get all courses with their basic info
  const coursesQuery = `
    SELECT c.id, c.name, c.min_aps_general,
           s.name as school_name, f.name as faculty_name
    FROM courses c
    JOIN schools s ON c.school_id = s.id
    JOIN faculties f ON s.faculty_id = f.id
  `;
  const coursesResult = await pool.query(coursesQuery);
  const courses = coursesResult.rows;

  // 4. For each course, fetch its APS variants (if any)
  const qualifying = [];
  for (const course of courses) {
    // Fetch APS variants for this course
    const variantsQuery = `
      SELECT cv.min_aps, s.id as subject_id
      FROM course_aps_variants cv
      JOIN subjects s ON cv.subject_id = s.id
      WHERE cv.course_id = $1
    `;
    const variantsResult = await pool.query(variantsQuery, [course.id]);
    const variants = variantsResult.rows;

    // Determine required APS for this learner
    let requiredAPS = course.min_aps_general;
    if (variants.length > 0) {
      // Check if learner has a subject that triggers a variant
      for (const variant of variants) {
        const hasSubject = learnerSubjects.some(ls => ls.subject_id === variant.subject_id);
        if (hasSubject) {
          requiredAPS = variant.min_aps;
          break; // first matching variant applies (could be multiple, but we assume unique per subject)
        }
      }
    }

    if (aps < requiredAPS) continue;

    // Check subject requirements
    const meetsSubjects = await meetsSubjectRequirements(learnerSubjects, course.id);
    if (meetsSubjects) {
      qualifying.push(course);
    }
  }

  return { aps, qualifying };
};

module.exports = { findQualifyingCourses };