// backend/tests/courseMatcher.test.js

const { findQualifyingCourses, clearCategoryCache } = require('../utils/courseMatcher');
const pool = require('../config/db');
const { calculateAPS } = require('../utils/apsCalculator');

jest.mock('../config/db', () => ({
  query: jest.fn()
}));

// Mock calculateAPS to control APS value
jest.mock('../utils/apsCalculator', () => ({
  calculateAPS: jest.fn(),
  percentageToLevel: jest.requireActual('../utils/apsCalculator').percentageToLevel // use real for level conversion
}));

describe('Course Matcher', () => {
  let subjectMapRows;
  let coursesData;
  let variantsData;
  let groupsData;
  let itemsData;
  let categoryMembersData;

  beforeEach(async () => {
    jest.clearAllMocks();

    // Default subject map (simplified)
    subjectMapRows = [
      { id: 1, name: 'Mathematics' },
      { id: 2, name: 'English Home Language' },
      { id: 3, name: 'Physical Sciences' },
      { id: 4, name: 'Life Sciences' },
      { id: 5, name: 'Geography' },
      { id: 6, name: 'History' }
    ];

    // Mock pool.query implementation
    pool.query.mockImplementation((query, params) => {
      if (query.includes('FROM subjects')) {
        return Promise.resolve({ rows: subjectMapRows });
      }
      if (query.includes('FROM courses c')) {
        return Promise.resolve({ rows: coursesData || [] });
      }
      if (query.includes('FROM course_aps_variants')) {
        return Promise.resolve({ rows: variantsData || [] });
      }
      if (query.includes('FROM requirement_groups')) {
        return Promise.resolve({ rows: groupsData || [] });
      }
      if (query.includes('FROM requirement_items')) {
        return Promise.resolve({ rows: itemsData || [] });
      }
      if (query.includes('FROM subject_category_members')) {
        return Promise.resolve({ rows: categoryMembersData || [] });
      }
      return Promise.resolve({ rows: [] });
    });

    // Clear category cache so it reloads with our mock data
    clearCategoryCache();
    // Reload cache by calling the internal function (it's called automatically when module loads, but we cleared it)
    // We'll let the first call to findQualifyingCourses trigger the cache load via getSubjectNameToIdMap and category cache.
    // But we can also manually trigger loadCategoryCache if needed. For now, we rely on the fact that the cache loads lazily on first use.
  });

  test('should return qualifying courses when APS and subject requirements are met', async () => {
    coursesData = [
      { id: 1, name: 'Test Course', min_aps_general: 28, school_name: 'Test School', faculty_name: 'Test Faculty' }
    ];
    variantsData = [];
    groupsData = [{ id: 10, min_count: 1 }];
    itemsData = [{ requirement_group_id: 10, subject_id: 2, category_id: null, min_level: 4 }];

    const subjects = [
      { name: 'English Home Language', percentage: 70 }, // level 6
      { name: 'Mathematics', percentage: 65 },
      { name: 'Physical Sciences', percentage: 60 },
      { name: 'Life Sciences', percentage: 55 },
      { name: 'Geography', percentage: 50 },
      { name: 'History', percentage: 45 }
    ];

    calculateAPS.mockReturnValue(30);

    const result = await findQualifyingCourses(subjects);
    expect(result.aps).toBe(30);
    expect(result.qualifying).toHaveLength(1);
    expect(result.qualifying[0].name).toBe('Test Course');
  });

  test('should exclude course if APS is too low', async () => {
    coursesData = [
      { id: 1, name: 'Test Course', min_aps_general: 32, school_name: 'Test School', faculty_name: 'Test Faculty' }
    ];
    variantsData = [];
    groupsData = [];
    itemsData = [];

    const subjects = Array(6).fill({ name: 'Mathematics', percentage: 50 });
    calculateAPS.mockReturnValue(30);

    const result = await findQualifyingCourses(subjects);
    expect(result.qualifying).toHaveLength(0);
  });

  test('should apply APS variant when learner has Maths', async () => {
    coursesData = [
      { id: 1, name: 'Test Course', min_aps_general: 30, school_name: 'Test School', faculty_name: 'Test Faculty' }
    ];
    variantsData = [{ min_aps: 24, subject_id: 1 }]; // Maths ID 1
    groupsData = [];

    const subjects = [
      { name: 'Mathematics', percentage: 70 },
      { name: 'English Home Language', percentage: 60 },
      { name: 'Physical Sciences', percentage: 60 },
      { name: 'Life Sciences', percentage: 60 },
      { name: 'Geography', percentage: 60 },
      { name: 'History', percentage: 60 }
    ];

    calculateAPS.mockReturnValue(25);
    const result = await findQualifyingCourses(subjects);
    expect(result.qualifying).toHaveLength(1);
  });

  test('should fail subject requirement if English level too low', async () => {
    coursesData = [
      { id: 1, name: 'Test Course', min_aps_general: 28, school_name: 'Test School', faculty_name: 'Test Faculty' }
    ];
    variantsData = [];
    groupsData = [{ id: 10, min_count: 1 }];
    itemsData = [{ requirement_group_id: 10, subject_id: 2, category_id: null, min_level: 5 }]; // need level 5

    const subjects = [
      { name: 'English Home Language', percentage: 60 }, // level 5
      { name: 'Mathematics', percentage: 65 },
      { name: 'Physical Sciences', percentage: 60 },
      { name: 'Life Sciences', percentage: 55 },
      { name: 'Geography', percentage: 50 },
      { name: 'History', percentage: 45 }
    ];

    calculateAPS.mockReturnValue(30);
    let result = await findQualifyingCourses(subjects);
    expect(result.qualifying).toHaveLength(1); // should qualify

    subjects[0].percentage = 45; // level 3
    result = await findQualifyingCourses(subjects);
    expect(result.qualifying).toHaveLength(0);
  });

  test('should handle category-based requirements', async () => {
    // Setup category members: Mathematics (id 1) belongs to category 1
    categoryMembersData = [{ subject_id: 1, category_id: 1 }];

    // Clear and reload cache
    clearCategoryCache();
    // The cache will be loaded on first call to subjectInCategory via meetsSubjectRequirements

    coursesData = [
      { id: 1, name: 'Test Course', min_aps_general: 28, school_name: 'Test School', faculty_name: 'Test Faculty' }
    ];
    variantsData = [];
    groupsData = [{ id: 10, min_count: 1 }];
    itemsData = [{ requirement_group_id: 10, subject_id: null, category_id: 1, min_level: 4 }];

    const subjects = [
      { name: 'Mathematics', percentage: 70 }, // level 6, belongs to category 1
      { name: 'English Home Language', percentage: 60 },
      { name: 'Physical Sciences', percentage: 60 },
      { name: 'Life Sciences', percentage: 60 },
      { name: 'Geography', percentage: 60 },
      { name: 'History', percentage: 60 }
    ];

    calculateAPS.mockReturnValue(30);
    let result = await findQualifyingCourses(subjects);
    expect(result.qualifying).toHaveLength(1);

    subjects[0].percentage = 45; // level 3
    result = await findQualifyingCourses(subjects);
    expect(result.qualifying).toHaveLength(0);
  });
});