const { percentageToLevel, calculateAPS } = require('../utils/apsCalculator');

describe('APS Calculator', () => {
  test('percentageToLevel returns correct level', () => {
    expect(percentageToLevel(85)).toBe(7);
    expect(percentageToLevel(75)).toBe(6);
    expect(percentageToLevel(65)).toBe(5);
    expect(percentageToLevel(55)).toBe(4);
    expect(percentageToLevel(45)).toBe(3);
    expect(percentageToLevel(35)).toBe(2);
    expect(percentageToLevel(25)).toBe(1);
  });

  test('calculateAPS sums top 6 levels excluding LO by default', () => {
    const subjects = [
      { name: 'Maths', percentage: 85 }, // 7
      { name: 'English', percentage: 75 }, // 6
      { name: 'Physics', percentage: 65 }, // 5
      { name: 'Life Sciences', percentage: 55 }, // 4
      { name: 'Geography', percentage: 70 }, // 6
      { name: 'History', percentage: 50 }, // 4
      { name: 'Life Orientation', percentage: 90 } // 7 but excluded
    ];
    const aps = calculateAPS(subjects, true);
    // Top 6 excluding LO: 7+6+5+4+6+4 = 32
    expect(aps).toBe(32);
  });

  test('calculateAPS includes LO if beneficial and not excluded', () => {
    const subjects = [
      { name: 'Maths', percentage: 85 }, // 7
      { name: 'English', percentage: 75 }, // 6
      { name: 'Physics', percentage: 65 }, // 5
      { name: 'Life Sciences', percentage: 55 }, // 4
      { name: 'Geography', percentage: 70 }, // 6
      { name: 'History', percentage: 50 }, // 4
      { name: 'Life Orientation', percentage: 90 } // 7
    ];
    const aps = calculateAPS(subjects, false);
    // Top 6 including LO: 7+7+6+6+5+4 = 35
    expect(aps).toBe(35);
  });
});