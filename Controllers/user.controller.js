module.exports.getUser = async(req,res,next)=>{
    
        try {       
            const user= await User.findById(req.params.id).populate('account');;
            if(!user)
            {
            throw createError.NotFound('user details not found');
            }
            res.send(user);
        } catch (error) {
         next(error);   
        }
    
}

// module.exports={getUser}