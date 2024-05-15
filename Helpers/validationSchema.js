// Purpose: To validate the email address of the user.
const verifyEmail=(email)=>{
    const emailRegex = /\b[A-Za-z0-9._%+-]+@uog\.edu\.pk\b/;
    return emailRegex.test(email);
}

module.exports = {verifyEmail};