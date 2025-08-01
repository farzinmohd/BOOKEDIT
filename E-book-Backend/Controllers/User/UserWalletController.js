import Wallet from "../../Models/WalletModel.js";


/**
 * add wallet 
 */


// const addWallet = async (req,res)=>{
//     try {
//         const user_id = req.userId;
//         const {amount,productName,order_id,payment_id} = req.body;
//         console.log("check this ", amount, productName, order_id, payment_id);
        
//         if (payment_id) {
//             const user = await Wallet.findOne({user_id:user_id})
//             if (user) {
//                 user.data.push({
//                     order_id:order_id,
//                     item:productName,
//                     amount:amount,
//                     date: Date.now()
//                 })
//                 await user.save()
//             }else{
//                 const user = await Wallet.create({
//                     user_id:user_id,
//                     balance_amount:amount,
//                     data:[{
//                         order_id:order_id,
//                         item:productName,
//                         amount:amount,
//                         date: Date.now()
//                     }]
//                 }) 
//             }
//         }
//         await res.status(200).json({ message: "wallet add successfully "})
//     } catch (error) {
//         await res.status(401).json({ message: "wallet add failed "})
//     }
// }



const addWallet = async (req, res) => {
    try {
        const user_id = req.userId;
        const { amount, productName, order_id, payment_id } = req.body;
        if (!payment_id) {
            return res.status(400).json({ message: "Payment ID is required" });
        }
        const user = await Wallet.findOne({ user_id: user_id });

        if (user) {
            const existingTransaction = user.data.find(txn => txn.order_id === order_id);
            if (existingTransaction) {
                return res.status(400).json({ message: "Transaction already exists" });
            }
            user.data.push({
                order_id: order_id,
                item: productName, 
                amount: amount,
                date: Date.now(),
            });
            user.balance_amount += amount;
            await user.save();
        } else {
            await Wallet.create({
                user_id: user_id,
                balance_amount: amount,
                data: [
                    {
                        order_id: order_id,
                        item: productName,
                        amount: amount,
                        date: Date.now(),
                    },
                ],
            });
        }

        res.status(200).json({ message: "Wallet updated successfully" });
    } catch (error) {
        console.error("Error in addWallet:", error);
        res.status(500).json({ message: "Failed to update wallet", error: error.message });
    }
};


/**
 * get wallet detailes
 */

const getWallet = async (req, res) =>{
    try {
        const user_id = req.userId;

        const wallet = await Wallet.findOne({user_id:user_id}).sort({createdAt: -1});
        console.log('check wallet', Wallet)
        await res.status(200).json({ message: " get wallet detiales  successfully", wallet})
    } catch (error) {
        await res.status(404).json({ message: " get wallet detiales  failed"})
    }
}

export {
    addWallet,
    getWallet
}