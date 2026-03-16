// backend/utils/apsCalculator.js

/**
 * Official UMP conversion table (placeholder – replace with real data)
 * Format: { minPercentage: level }
 * Levels: 1-7
 */
const CONVERSION_TABLE = [
  { min: 80, level: 7 },
  { min: 70, level: 6 },
  { min: 60, level: 5 },
  { min: 50, level: 4 },
  { min: 40, level: 3 },
  { min: 30, level: 2 },
  { min: 0, level: 1 }
];

/**
 * Convert percentage to APS level using the official table.
 * @param {number} percentage - 0-100
 * @returns {number} level 1-7
 */
const percentageToLevel = (percentage) => {
  for (const range of CONVERSION_TABLE) {
    if (percentage >= range.min) return range.level;
  }
  return 1; // fallback
};

/**
 * Calculate APS from an array of subjects with percentages.
 * Takes the best 6 subjects (excluding Life Orientation if it would lower the APS).
 * Life Orientation can be excluded if it is not in the top 6 when sorted.
 * @param {Array} subjects - [{ name, percentage }]
 * @param {boolean} excludeLO - if true, Life Orientation is excluded from APS calculation (default true for UMP? we'll allow toggle)
 * @returns {number} APS score
 */
const calculateAPS = (subjects, excludeLO = true) => {
  // Convert each to level
  let subjectLevels = subjects.map(s => ({
    name: s.name,
    level: percentageToLevel(s.percentage)
  }));

  // Optionally filter out Life Orientation
  if (excludeLO) {
    subjectLevels = subjectLevels.filter(s => s.name !== 'Life Orientation');
  }

  // Sort descending by level
  subjectLevels.sort((a, b) => b.level - a.level);

  // Take top 6
  const top6 = subjectLevels.slice(0, 6).map(s => s.level);

  // Sum
  return top6.reduce((sum, level) => sum + level, 0);
};

module.exports = { percentageToLevel, calculateAPS };