const express = require("express");
const router = express.Router();
const User = require("../Models/User.model");
const Temp = require("../Models/tempAccount.model");
const createError = require("http-errors");
const bcrypt = require('bcrypt');
const veifyOTP=require('../Helpers/verifyOTP')
const getuser = require("../Controllers/user.controller");
const { verifyEmail } = require("../Helpers/validationSchema");
const otpGenerator = require("otp-generator");
const { otpGen } = require('otp-gen-agent');
const transporter = require("../Helpers/nodeMailer");
const verifyOTP = require("../Helpers/verifyOTP");
const { verifyAccessToken,signAccessToken } = require('../Helpers/jwtHelper');
const Request = require("../Models/Request");
// const cryptojs = require('crypto-js');
// router.get('/:id',getuser);

router.post("/signup", async (req, res, next) => {
  try {
    
    const email = req.body.email;
    const isEmail = verifyEmail(email);
    if (!isEmail) {
      return res
        .status(400)
        .send({ status:"ERROR", message: "Invalid Email Format" });
    }
    const tempuser = await Temp.findOne({ email: email });
    if (!tempuser) {
      return res.send({
        status:"ERROR",
        message: "Email Doesnot Exists",
        data: "",
      });
    } else {
        const OTPVerified= verifyOTP(tempuser.otp,req.body.otp);
        if(OTPVerified){
          console.log("otp verified");
        const newUser= new User(
            {
                name: tempuser.name,
                email: tempuser.email,
                hashedPassword: tempuser.hashedPassword,
                loginAttempts: tempuser.loginAttempts,
                city: tempuser.city,
                contact:tempuser.contact,
                bloodgroup: tempuser.bloodgroup,
                gender:tempuser.gender,
                isdonor: tempuser.isdonor,
                image: tempuser.image,
                deviceToken: tempuser.deviceToken,
            }
        );
        const savedUser = await newUser.save();
        const accessToken = await signAccessToken(savedUser.id);
        if(savedUser){
            tempuser.deleteOne();
            res.status(200).send({
                status: "COMPLETED",
                data: {
                  user:{
                  name: savedUser.name,
                  email: savedUser.email,
                  city: savedUser.city,
                  contact: savedUser.contact,
                  bloodgroup: savedUser.bloodgroup,
                  gender: savedUser.gender,
                  isdonor: savedUser.isdonor,
                  image: savedUser.image,
                    },
                    token: accessToken
                },
                message: "Login Successful",
              });
            }
        }else{
            res.status(404).send({
                data:"",
                message:"OTP IS IN CORRECT",
                status:"ERROR"
            })
        }
    }
  } catch (error) {
    console.log("error in user post" + error.trace);
    next(error);
  }
});
router.post("/signup/sendOTP", async (req, res, next) => {
    try {
      const email = req.body.email;
      const password = req.body.password;
      const isEmail = verifyEmail(email);
      if (!isEmail) {
        return res
          .status(400)
          .send({ status:"ERROR", message: "Invalid Email format" });
      }
      const isTempUser= await Temp.findOne({email:email});
      if (isTempUser) {
        isTempUser.deleteOne();
      }
        
      const doesExist = await User.findOne({ email: email });
      if (doesExist) {
        return res.send({
          status:"ERROR",
          message: "Email already exists",
          data: "",
        });
      } else {
        bcrypt.hash(password, 10, async (err, hash) => {
          if (err) {
            console.log(err);
          } else {
            const otp = await otpGen();
            console.log(otp);
            const tempUser = new Temp({

              name: req.body.name,
              email: email,
              hashedPassword: hash,
              loginAttempts: 0,
              city: req.body.city,
              contact: req.body.contact,
              bloodgroup: req.body.bloodgroup,
              gender: req.body.gender,
              isdonor: req.body.isdonor,
              otp:otp,
              image:req.body.image,
              deviceToken: req.body.deviceToken,

            });
            console.log(tempUser);
            const savedTempUser = await tempUser.save();
            const mailOptions = {
                from: 'umeed.e.hayat@gmail.com', // Replace with your email address
                to: email,
                subject: 'OTP Verification',
                text: `Your OTP is: ${otp}`,
              };
              const info = await transporter.sendMail(mailOptions);
                console.log('Email sent:', info.messageId);
            if(info){
                res.status(200).send({status:"COMPLETED", data: savedTempUser.email,message:"OTP Sended"});
            }
            
      }});
      }
    } catch (error) {
      console.log("Error in user post" + error.trace);
      next(error);
    }
});
router.post("/resetPassword/otp", async (req, res, next) => {
    try {
      const email = req.body.email;
      const password = req.body.password;
      const isEmail = verifyEmail(email);
      if (!isEmail) {
        return res
          .status(400)
          .send({ status:"ERROR", message: "invalid email format" });
      }
      const doesTempExist= await Temp.findOne({email:email});
      if(doesTempExist){
        doesTempExist.deleteOne();
      }
      const doesExist = await User.findOne({ email: email });
      if (!doesExist) {
        return res.send({
          status:"ERROR",
          message: "account not found",
          data: "",
        });
      } else {
        bcrypt.hash(password, 10, async (err, hash) => {
          if (err) {
            console.log(err);
          } else {
            const otp = await otpGen();
            const tempUser = new Temp({
            email: email,
            hashedPassword:hash,
            otp:otp
            });
            console.log(tempUser);
            const savedTempUser = await tempUser.save();
            const mailOptions = {
                from: 'umeed.e.hayat@gmail.com', // Replace with your email address
                to: email,
                subject: 'OTP Verification',
                text: `Your OTP is: ${otp}`,
              };
              const info = await transporter.sendMail(mailOptions);
                console.log('Email sent:', info.messageId);
            if(info){
                res.status(200).send({status:"COMPLETED", data: savedTempUser.email,message:"OTP Sended"});
            }
            
      }});
      }
    } catch (error) {
      console.log("error in user post" + error.trace);
      next(error);
    }
});
router.post("/resetPassword",async (req, res, next) => {
    try {
      const email = req.body.email;
      const isEmail = verifyEmail(email);
      if (!isEmail) {
        return res
          .status(400)
          .send({ status:"ERROR", message: "invalid email format" });
      } else {
        const tempuser = await Temp.findOne({ email: email });
        if (!tempuser) {
          return res.send({
            status:"ERROR",
            message: "email doesnot exists",
            data: "",
          });
        } 
            const OTPVerified= verifyOTP(tempuser.otp,req.body.otp);
            if(OTPVerified){
                const user = await User.findOneAndUpdate(
                    {email:email},
                    {
                      hashedPassword: tempuser.hashedPassword,
                    },
                    { new: true }
                  );
            if(user){
                tempuser.deleteOne();
                res.status(200).send({
                    status: "COMPLETED",
                    data: {
                      name: user.name,
                      email: user.email,
                      city: user.city,
                      contact: user.contact,
                      bloodgroup: user.bloodgroup,
                      gender: user.gender,
                      isdonor: user.isdonor,
                    },
                    message: "login successful",
                  });
                }
            }else{
                res.status(404).send({
                    data:"",
                    message:"OTP IS IN CORRECT",
                    status:"ERROR"
                })
            }
        
    
      }
    } catch (error) {
      console.log("error in user post" + error.trace);
      next(error);
    }
});
//user api to get all the users
router.get("/get/all/users", async (req, res,next) => {
  const users = await User.find();
  if(users){
    res.status(200).send({
        status: "COMPLETED",
        data: users,
        message: "users found successful",
      });
  }
  res.status(404).send({
    status: "ERROR",
        data: "",
        message: "users not found",
  });
});
router.get("/get/:id", async (req, res) => {
  try{
  const userid= req.params.id;
  console.log(userid);
  const user = await User.findById(userid);
  const requests = await Request.find({user:userid});
  if(user){
    res.status(200).send({
        status: "COMPLETED",
        data: {
          id: user._id,
          name: user.name,
          email: user.email,
          city: user.city,
          contact: user.contact,
          bloodgroup: user.bloodgroup,
          gender: user.gender,
          isdonor: user.isdonor,
          image: user.image,
          noOfDonations: user.noOfDonations,
          noOfRequests: requests.length,
          deviceToken: user.deviceToken,

            },
        message: "users found successful",
      });
  }else{
   res.status(404).send({
    status: "ERROR",
        data: "",
        message: "user not found",
  });
}
  } catch(error){
    
  }
});
router.get("/get/all/donors", async (req, res) => {
  const donors = await User.find({isdonor:true}).select('name bloodgroup city contact image _id isdonor gender noOfDonations deviceToken').sort({updatedAt:-1});
  if(donors){
    return res.status(200).send({
        status: "COMPLETED",
        data: donors,
        message: "Donors found successful",
      });
  }
  res.status(404).send({
    status: "ERROR",
        data: "",
        message: "Donors not found",
  });
});

router.post("/login", async (req, res, next) => {
  try {
    const email = req.body.email;
    const password = req.body.password;

    console.log("email is" + email);
    console.log("password is" + password);
    const isEmail = verifyEmail(email);
    if (!isEmail) {
      return res
        .status(400)
        .send({ status: "ERROR", message: "invalid email format" });
    } else {
      const user = await User.findOne({ email: email });
      if (!user) {
        return res
          .status(404)
          .send({ status: "ERROR", message: "user not found" });
      }
      if (user.loginAttempts >= 3) {
        user.isLocked = true;
        await user.save();

        setTimeout(
          async () => {
            user.loginAttempts = 0;
            await user.save();
            console.log("user is unlocked");
          },

          8000
        );

        console.log(user.isLocked);
        return res
          .status(401)
          .send({ status: "ERROR", message: "account is locked" });
      }

      bcrypt.compare(password, user.hashedPassword, async (err, isMatch) => {
        if (err)
          return res
            .status(500)
            .send({ status: "ERROR", message: "something went wrong" });
        if (!isMatch) {
          user.loginAttempts += 1;
          user.save();
          return res
            .status(401)
            .send({ status: "ERROR", message: "Username/password not valid" });
        } else {
          const accessToken = await signAccessToken(user.id);
          return res.status(200).send({
            status: "COMPLETED",
            data: {
              id:user._id,
              name: user.name,
              email: user.email,
              city: user.city,
              contact: user.contact,
              bloodgroup: user.bloodgroup,
              gender: user.gender,
              isdonor: user.isdonor,
              image:user.image
            },
             token: accessToken,
            message: "login successful",
          });
        }
      });
    }
  } catch (error) {
    if (error.isJoi == true) {
      (error.status = 400), (error.message = error);
    }
    next(error);
  }
});

router.put("/update/devicetoken/:id", async (req, res, next) => {
  try {
    const id = req.params.id;
    const user= await User.findByIdAndUpdate(id,{
      deviceToken: req.body.deviceToken,
    },{new:true});
    const savedUser = await user.save();
    if(savedUser){
       return res.status(200).send({
        status: "COMPLETED",
        data: '',
        message: "User Profile Updated Successful",
      });
    }
    res.status(404).send({
      status: "ERROR",
          data: "",
          message: "user not found",
    });
  } catch (error) {
    next(error);
  }
});
router.put("/update/:id", async (req, res, next) => {
  try {
    console.log(req.body);
    const id = req.params.id;
    const user= await User.findByIdAndUpdate(id,{
      name: req.body.name,
      email: req.body.email,
      city: req.body.location,
      contact: req.body.contact,
      bloodgroup: req.body.bloodgroup,
      isdonor: req.body.isdonor,
      noOfDonations: req.body.noOfDonations,
      noOfRequests: req.body.noOfRequests,
      deviceToken: req.body.deviceToken,
      image: req.body.image,
    },{new:true});
    const savedUser = await user.save();
    if(savedUser){
       return res.status(200).send({
        status: "COMPLETED",
        data: {
          name: savedUser.name,
          email: savedUser.email,
          city: savedUser.city,
          contact: savedUser.contact,
          bloodgroup: savedUser.bloodgroup,
          gender: savedUser.gender,
          isdonor: savedUser.isdonor,
          image: savedUser.image,

            },
        message: "User Profile Updated Successful",
      });
    }
    res.status(404).send({
      status: "ERROR",
          data: "",
          message: "user not found",
    });
  } catch (error) {
    next(error);
  }
});

router.delete("/:id", async (req, res, next) => {
  try {
    const oldUser = await User.findByIdAndRemove(req.params.id);
    if (oldUser) {
      res.send({ success: true, message: "User deleted Successfully" });
    } else {
      throw createError[500]("user not found");
    }
  } catch (error) {
    next(error);
  }
});

router.get("/deviceTokens",async(req,res,next)=>{
  try{
    const deviceToken = await User.find().select('deviceToken');
    if(deviceToken){
      return res.status(200).send({
        status: "COMPLETED",
        data: deviceToken,
        message: "device token found successful",
      });
    }
    res.status(404).send({
      status: "ERROR",
          data: "",
          message: "device token not found",
    });
  }catch(error){
    next(error);
  }
});


module.exports = router;
