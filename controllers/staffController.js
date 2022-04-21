//const Staff = require('../models/staff');
const Student = require('../models/student');
const bigPromise = require('../middlewares/bigPromise');
const customError = require('../utils/customError');
const cloudinary = require('cloudinary');



module.exports.studentRegister = bigPromise( async (req, res, next) => {
 
    const{name,regNum,branch,year,semester,personalEmail,phoneNumber,address} = req.body;

    if(!name|| !regNum|| !branch|| !year|| !semester|| !personalEmail|| !phoneNumber|| !address)
    {
        return next(new customError("All fields are required for registration",400));
    }
    
    const image = req.files.photo;
    let imageArray = [];
    if(req.files)
    {
        const pics_folder = process.env.CLOUDINARY_CLOUD_STUDENT_FOLDER+'/'+regNum;
        let result  = await cloudinary.v2.uploader.upload(image.tempFilePath,{folder: pics_folder});
        imageArray.push({id: result.public_id, secure_url:result.secure_url});
    }

    console.log(imageArray)
    
    req.body.photo = imageArray[0];
    req.body.collegeEmail = regNum+"@cbit.edu";
    req.body.password = regNum;

    console.log(req.body);
    const student = await Student.create(req.body);

    res.status(200).json({
        success: true,
        Greeting: "Student Registered Successfully....",
        student
    });   
});