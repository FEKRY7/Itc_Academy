const express = require('express');

const userRouter = require('./src/modules/auth/auth.routes.js')
const categoryRouter = require('./src/modules/category/category.routes.js')
const ServiceRouter = require('./src/modules/services/services.routes.js')
const LectureRouter = require('./src/modules/lectuers/lectuers.routes.js')
const CourseRouter = require('./src/modules/course/course.routes.js')
const InstructorRouter = require('./src/modules/instructor/instructor.routes.js')
const QuestionRouter = require('./src/modules/Qesustion/Questions.routes.js')
const EaxmRouter = require('./src/modules/Eaxm/Eaxm.routes.js')
const groupRouter = require('./src/modules/group/group.routes.js')
const AbsenceRouter = require('./src/modules/Absence/Absence.router.js')
const ReviewRouter = require('./src/modules/review/review.router.js')
const PaymentRouter = require('./src/modules/payment/payment.router.js')
const ResultRouter = require('./src/modules/Result/Result.Router.js')
const TrackesRouter = require('./src/modules/trackes/tracke.roter.js')
const SessionRouter = require('./src/modules/Session/Session.router.js')


const mongoConnection = require('./Database/dbConnection.js');
const dotenv = require('dotenv');
const cors = require('cors');


 
dotenv.config()
const app = express()
mongoConnection();
//convert Buffer Data
// Middleware to parse JSON
app.use(express.json());
app.use(express.urlencoded({ extended: false }))
app.use(cors())



  


// Routes
app.use('/api/auth',userRouter)
app.use('/api/Category',categoryRouter)
app.use('/api/Service',ServiceRouter)
app.use('/api/lecture',LectureRouter)
app.use('/api/Course',CourseRouter)
app.use('/api/Instructor',InstructorRouter)
app.use('/api/Question',QuestionRouter)
app.use('/api/Eaxm',EaxmRouter)
app.use('/api/group',groupRouter)
app.use('/api/Absence',AbsenceRouter)
app.use('/api/Review',ReviewRouter)
app.use('/api/Payment',PaymentRouter)
app.use('/api/Result',ResultRouter)
app.use('/api/Trackes',TrackesRouter)
app.use('/api/Session',SessionRouter)





// Set up server to listen on specified port (default to 3000)
const PORT = process.env.PORT ;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});



// 404 route
app.use('*', (req, res) => {
    res.status(404).json({ 'Msg': 'I Can\'t Found' });
});