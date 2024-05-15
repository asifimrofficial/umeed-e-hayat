const verifyOTP=(serverOTP,userOTP)=>
{
    if(serverOTP==userOTP){
        return true;
    }
    return false;
}

module.exports=verifyOTP;