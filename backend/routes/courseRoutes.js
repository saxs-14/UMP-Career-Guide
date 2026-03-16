// backend/routes/courseRoutes.js

const express = require('express');
const router = express.Router();
const courseController = require('../controllers/courseController');

router.get('/faculties', courseController.getFaculties);
router.get('/courses', courseController.getCourses);
router.get('/courses/:id', courseController.getCourseById);
router.get('/subjects', courseController.getSubjects);
router.get('/subject-categories', courseController.getSubjectCategories);
router.post('/calculate', courseController.calculate);

module.exports = router;
