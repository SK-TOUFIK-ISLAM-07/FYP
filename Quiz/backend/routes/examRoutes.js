const router = require('express').Router();
const auth = require('../middleware/auth');
const role = require('../middleware/roles');
const ec = require('../controllers/examController');

// teacher
router.post('/create', auth, role('teacher'), ec.createExam);
router.get('/teacher/list', auth, role('teacher'), ec.teacherExams);
router.get('/view/:id', auth, role('teacher','admin'), ec.viewExam);

// student
router.get('/available', auth, role('student'), ec.availableExams);
router.post('/:id/start', auth, role('student'), ec.startExam);
router.get('/:id/status', auth, role('student'), ec.examStatus);

// admin
router.get('/all', auth, role('admin'), ec.allExams);

module.exports = router;
