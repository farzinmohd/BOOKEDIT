
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

/*
create access token
*/

const AccessToken = (userId) => {
    const secret = process.env.ACCESS_TOKEN || 'your_access_token_secret_key_here';
    return jwt.sign({userId} , secret, {
      expiresIn: "3m",
    });
  };
  
  /*
  create a refresh token
  */
  
  const RefreshToken = (userId) => {
    const secret = process.env.REFRESH_TOKEN || 'your_refresh_token_secret_key_here';
    return jwt.sign( {userId} , secret, {
      expiresIn: "7d",
    });
  };
  
  export {
    AccessToken,
    RefreshToken
  }