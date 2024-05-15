const express = require('express');
const router= express.Router();
const User= require('../Models/User.model');
const Request= require('../Models/Request');
const FullfilledRequest= require('../Models/fullFiledRequest');
const {verifyAccessToken, verfiyRefreshToken} = require('../Helpers/jwtHelper');

router.get('/:id',verifyAccessToken,async(req,res,next)=>{
    try{
        const request= await Request.findById(req.params.id).populate('user');
        if(!request){
            throw createError.NotFound('Request details not found');
        }
        res.status(200).send({status: 'COMPLETED', message:"Request details found", request: request});
    }catch(error){
        res.send({status: 'ERROR', message:"Error in getting Request details"});
    }
}); 
//get list of requests by user
router.get('/user_requests/:id',async(req,res,next)=>{
    try{
        const requests= await Request.find({user: req.params.id}).select('name bloodgroup location hospital contact isactive isfulfilled hb user note createdAt updatedAt');
        if(!requests){
            throw createError.NotFound('Requests not found');
        }
        res.status(200).send({status: "COMPLETED", message:"Requests found", data: requests});
    }catch(error){
        res.send({status: 'ERROR', message:"Error in getting Requests"});
    }
}
);
//get list of active requests
router.get('/active/requests',async(req,res,next)=>{
    try{
        const requests = await Request.find({ isfulfilled: false })
        .select('name bloodgroup location hospital contact isactive isfulfilled hb user note createdAt updatedAt').sort({createdAt: -1});
      
        if(!requests){
            throw createError.NotFound('Requests not found');
        }
        if(requests.length==0){
            return res.status(404).send({status: 'NOTFOUND', message:"Requests not found", data:[]});
        }
        res.status(200).send({status: 'COMPLETED', message:"Requests found", data: requests});
    }catch(error){
        res.send({status: 'ERROR', message:"Error in getting Requests"});
    }
}
);
//get list of active requests by user
router.get('/user/:id',async(req,res,next)=>{
    try{
        console.log(req.params.id);
        const requests= await Request.find({user: req.params.id}).select('name bloodgroup location hospital contact isactive isfulfilled hb user note createdAt updatedAt');
        if(requests.length==0){
            return res.status(404).send({status: 'NOTFOUND', message:"Requests not found", data:[]});
        }
        res.status(200).send({status: 'COMPLETED', message:"Requests found", data: requests});
    }catch(error){
        res.send({status: 'ERROR', message:"Error in getting Requests"});
    }
}
);
//get list of fulfilled requests
router.get('/fulfilled',async(req,res,next)=>{
    try{
        const requests= await Request.find({isfulfilled: true});
        if(!requests){
            throw createError.NotFound('Requests not found');
        }
        res.status(200).send({status: 'COMPLETED', message:"Requests found", requests: requests});
    }catch(error){
        res.send({status: 'ERROR', message:"Error in getting Requests"});
    }
}
);
//post request
router.post('/post',async(req,res,next)=>{
    try{
        const request= new Request({
            user: req.body.user,
            bloodgroup: req.body.bloodgroup,
            isactive: true,
            isfulfilled: false,
            note: req.body.note,
            hospital: req.body.hospital,
            location: req.body.location,
            contact: req.body.contact,
            hb: req.body.hb,
            name: req.body.name

        });
        const savedRequest= await request.save();
        if(!savedRequest){
            throw createError.NotFound('Error in saving request');
        }
        res.status(200).send({status: 'COMPLETED', message:"Request saved", request: savedRequest});
    }catch(error){
        next(error);
    }
}
);
//update request
router.put('/update/:id',async(req,res,next)=>{
    try{
        const request= await Request.findByIdAndUpdate(req.params.id,{
            name: req.body.name,
            hospital: req.body.hospital,
            bloodgroup: req.body.bloodGroup,
            note: req.body.note,
            location: req.body.location,
            contact: req.body.contact,
            hb: req.body.hb,
        },{new: true});
        if(!request){
           
            res.status(404).send({status: 'ERROR', message:"Request not found",  });
        }
        res.status(200).send({status: 'COMPLETED', message:"Request updated", });
    }catch(error){
        next(error);
    }
}
);
//delete request
router.delete('/delete/:id',async(req,res,next)=>{
    try{
        const request= await Request.findByIdAndDelete(req.params.id);
        if(!request){
            throw createError.NotFound('Error in deleting request');
        }
        res.status(200).send({status: 'COMPLETED', message:"Request deleted",});
    }catch(error){
        res.send({status: 'ERROR', message:"Error in deleting Request"});
    }
}
);
//fulfill request
router.put('/fulfill/:id',async(req,res,next)=>{
    try{
        const request= await Request.findByIdAndUpdate(req.params.id,{
            isfulfilled: req.body.isfulfilled,
        });
        if(!request){
           return res.send({status: 'ERROR', message:"Error in fulfilling Request"});
        }
        return res.status(200).send({status: 'COMPLETED', message:"Request fulfilled", request: request});
    }catch(error){
        res.send({status: 'ERROR', message:"Error in fulfilling Request"});
    }
}
);
module.exports= router;


//write dummy data for post request api

// {
//     "user": "60b9f0b3b9b3c71f1c0b3b1f",
//     "bloodGroup": "A+",
//     "isactive": true,
//     "isfulfilled": false,
//     "note": "Need blood urgently",
//     "hospital": "Apollo Hospital",
//     "location": "Chennai",
//     "contact": "9876543210",
//     "hb": "12",
//     "name": "Rahul"
// }

// {
//     "_id": "64cffe66ece16636b221c8b2",
//     "bloodgroup": "B+",
//     "name": "Adeel",
//     "location": "Gujrat ",
//     "hospital": "Doctors Hospital ",
//     "contact": "030426065866",
//     "isactive": true,
//     "isfulfilled": "false",
//     "hb": 8.5,
//     "user": "64cf6e900f724190b54710d2",
//     "note": "The patient is feeling very unhappy ",
//     "createdAt": "2023-08-06T20:11:18.502Z",
//     "updatedAt": "2023-08-06T20:11:18.502Z"
// },