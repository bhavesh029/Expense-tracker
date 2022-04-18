const Razorpay = require('razorpay');
const Order = require('../Models/order');
const dotenv = require('dotenv');
dotenv.config();
exports.purchasePreminum = async (req, res) => {
    try{
        var rzp = new Razorpay({
            Key_id: process.env.Razorpay_id,
            key_secret: process.env.RazorpaySecretKey
        })
        var details = {
            amount : 25 *100,
            currency: 'INR'
        }

        rzp.orders.create(details, (err, order) => {
            if(err){
                throw new Error(err);
            }
            req.user.createOrder( {orderid: order.id, status:'PENDING'}).then(() => {
                return res.status(201).json({order, Key_id: rzp.Key_id});
            }).catch(err => {
                throw new Error(err);
            })
        })
    }
    catch(err) {
        console.log(err);
        res.status(403).json({message: "Something Went Wrong", error:err});
    }
}


exports.updateTransactionStatus = (req, res) => {
    try {
        const {payment_id, order_id} = req.body;
        Order.findOne({where: {orderid : order_id}}).then(order => {
            order.update({ paymentid: payment_id, status: 'SUCCESSFUL'}).then(() => {
                req.user.update({ispremiumuser: true})
                return res.status(202).json({success: true, message: "Transaction Successful"});
            }).catch(err => {
                throw new Error(err);
            }).catch(err => {
                throw new Error(err);
            })
        })
    }
    catch(err){
        console.log(err);
        res.status(403).json({errpr: err, message: "Something went wrong"});
    }
}