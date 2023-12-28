const { validateToken } = require("../services/authentication");

function checkForAuthenticationCookie(cookieName) {
    return (req, res, next) =>{
        //console.log('Middleware executed');
        const tokenCookieValue = req.cookies[cookieName];
        if(!tokenCookieValue){
            return next();
        }

        try {
            const userPayload = validateToken(tokenCookieValue);
            //console.log("Decoded payload from token:", userPayload);
            req.user = {
                _id: userPayload._id,
                email: userPayload.email,
                role: userPayload.role,
                fullName: userPayload.fullName, // Include fullName here
              };

        } catch ( error) {
            console.error('Token validation error:', error.message);
        }

        return next();
    }
}

module.exports = checkForAuthenticationCookie;