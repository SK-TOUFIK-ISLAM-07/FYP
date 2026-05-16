const router = require('express').Router();
const auth = require('../middleware/auth');
const role = require('../middleware/roles');
const qc = require('../controllers/questionController');

router.post('/', auth, role('teacher'), qc.createQuestion);
router.get('/', auth, role('teacher'), qc.listQuestions);
router.put('/:id', auth, role('teacher'), qc.updateQuestion);
router.delete('/:id', auth, role('teacher'), qc.deleteQuestion);

module.exports = router;
