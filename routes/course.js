const express = require('express')
const CourseController = require('../controllers/course')
const md_auth = require('../middlewares/authenticated')

const api = express.Router()

api.post('/add-course',[md_auth],CourseController.addCourse)
api.get('/get-courses',CourseController.getCourses)
api.delete('/delete-course/:id',[md_auth],CourseController.deleteCourse)
api.put('/update-course/:id',[md_auth],CourseController.updateCourse)

module.exports = api

