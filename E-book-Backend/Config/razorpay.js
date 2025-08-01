import Razorpay from 'razorpay'


const razorpayInstance = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID, 
    key_secret: process.env.RAZORPAY_KEY_SECRET, 
})

console.log('working');
export default razorpayInstance