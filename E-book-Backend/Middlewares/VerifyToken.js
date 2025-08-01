import jwt, { decode } from "jsonwebtoken";

export const VerifyToken = (req, res, next)=>{
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (!token) {
        return res.status(401).json({ message: "No access token" })
    }
    try {
        const secret = process.env.ACCESS_TOKEN || 'your_access_token_secret_key_here';
        const decode = jwt.verify(token, secret)
        req.userId = decode.userId;
        next()
    } catch (error) {
        console.log('error', error)
        return res.status(401).json({ message : "invalid or expired token" })
    }
}


export const  AdminVerifyToken = (req,res, next)=>{
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]
    if (!token) {
        return res.status(401).json({ message: "Access Token required" })
    }
    try {
        const secret = process.env.ACCESS_TOKEN || 'your_access_token_secret_key_here';
        const decode = jwt.verify(token, secret);
        req.userId = decode.userId;
        next();
    } catch (error) {
        console.log(error);
        return res.status(401).json({ message : "invalid or expired token" })
    }
}
