const express = require('express')
const router = express.Router();

const {studentRegister} = require('../controllers/staffController');

router.route('/admin/register_student').post(studentRegister);

module.exports = router;