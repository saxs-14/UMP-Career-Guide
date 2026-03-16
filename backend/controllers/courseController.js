// backend/controllers/courseController.js

const courseModel = require('../models/courseModel');
const { findQualifyingCourses } = require('../utils/courseMatcher');

// GET /api/faculties
exports.getFaculties = async (req, res) => {
  try {
    const faculties = await courseModel.getFaculties();
    res.json(faculties);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};

// GET /api/courses
exports.getCourses = async (req, res) => {
  try {
    const { facultyId } = req.query;
    const courses = await courseModel.getCourses(facultyId ? parseInt(facultyId) : null);
    res.json(courses);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};

// GET /api/courses/:id
exports.getCourseById = async (req, res) => {
  try {
    const course = await courseModel.getCourseDetails(parseInt(req.params.id));
    if (!course) return res.status(404).json({ error: 'Course not found' });
    res.json(course);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};

// GET /api/subjects
exports.getSubjects = async (req, res) => {
  try {
    const subjects = await courseModel.getSubjects();
    res.json(subjects);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};

// GET /api/subject-categories
exports.getSubjectCategories = async (req, res) => {
  try {
    const categories = await courseModel.getSubjectCategories();
    res.json(categories);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};

// POST /api/calculate
exports.calculate = async (req, res) => {
  try {
    const { subjects } = req.body;

    // Validate input
    if (!subjects || !Array.isArray(subjects)) {
      return res.status(400).json({ error: 'Subjects must be an array' });
    }

    if (subjects.length < 6 || subjects.length > 8) {
      return res.status(400).json({ error: 'You must provide between 6 and 8 subjects' });
    }

    for (const s of subjects) {
      if (!s.name || typeof s.name !== 'string') {
        return res.status(400).json({ error: 'Each subject must have a name' });
      }
      if (typeof s.percentage !== 'number' || s.percentage < 0 || s.percentage > 100) {
        return res.status(400).json({ error: 'Percentage must be a number between 0 and 100' });
      }
    }

    const result = await findQualifyingCourses(subjects);
    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};