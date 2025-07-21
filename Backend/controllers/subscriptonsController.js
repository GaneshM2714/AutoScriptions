const mongoose = require('mongoose')
const Subscription = require("../models/subscriptions");

const get_subscriptions = async (req, res) => {
    try {
        // Get user ID from JWT middleware
        // console.log(req.user.id);
        const userid = req.user.id;
 
        // Find ALL subscriptions belonging to this user
        const userSubscriptions = await Subscription.find({
            user_id: userid
        });

        return res.status(200).json({
            success: true,
            user_id: userid,
            data: userSubscriptions,
            count: userSubscriptions.length,
            message: 'Yes working'
        });
        
    } catch (error) {
        console.error('Error fetching subscriptions:', error);
        return res.status(500).json({
            success: false,
            message: "Internal server error while fetching subscriptions"
        });
    }
};

const new_subscriptions = async(req,res) =>{
    try{
        const user_id = req.user.id;

        const {subscription_name,price,renewal_date,category,notes} = req.body;

        const newSubscription = new Subscription({
            user_id,
            subscription_name,
            price,
            renewal_date,
            category,
            notes
        });

        const saved = await newSubscription.save();

        return res.status(201).json({
            success: true,
            data: saved
        });


    }
    catch(error){
        return res.status(404).json({
            success: false,
            message: "Error creating subscription"
        })
    }
}

const update_subscriptions = async(req,res)=>{
    try{
        const subscriptionId = req.params.id;
        const userid = req.user.id;

        const update_data = req.body;

        const updated_Subscription = await Subscription.findOneAndUpdate({
            _id: subscriptionId,
            user_id : userid
        }, update_data , {new:true});


        if (!updated_Subscription) {
            return res.status(404).json({
                success: false,
                message: "Subscription not found or unauthorized"
            });
        }
        
        res.status(200).json({
            success: true,
            data: updated_Subscription
        });

    }
    catch(error){
        res.status(500).json({
            success: false,
            message: "Error updating subscription"
        });
    }
}

const delete_subscriptions = async(req,res)=>{
    try{
        const subscriptionId = req.params.id;
        const userid = req.user.id;

        const deleted_subscription = await Subscription.findOneAndDelete({
            _id:subscriptionId,
            user_id:userid
        });

        if (!deleted_subscription) {
            return res.status(404).json({
                success: false,
                message: "Subscription not found or unauthorized"
            });
        }

        return res.status(200).json({
            success: true,
            data: deleted_subscription,
        })
    }
    catch(error){
        res.status(500).json({
            success: false,
            message: "Error deleting subscription"
        });
    }

}

module.exports = { get_subscriptions , new_subscriptions, update_subscriptions, delete_subscriptions};
