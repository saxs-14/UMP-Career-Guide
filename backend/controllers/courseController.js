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