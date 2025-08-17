"use server";
import Razorpay from "razorpay";
import Payment from "@/models/Payment";
import connectDB from "@/db/connectDb";
import User from "@/models/User";

export const initiate = async (amount, to_username, paymentform) => {
    await connectDB();
        let user=await User.findOne({username:to_username})
        const secret=user.razorpaysecret;
    
    
    
    // Validate required fields before proceeding
    if (!paymentform?.name || !paymentform.name.trim()) {
        throw new Error("Name is required");
    }
    
    if (!to_username || to_username.trim() === '') {
        throw new Error("Username is required");
    }
    
    if (!amount || amount <= 0) {
        throw new Error("Valid amount is required");
    }

    if (!user.razorpayid || !secret) {
        throw new Error("Razorpay credentials are not configured properly");
    }

    var instance = new Razorpay({
        key_id: user.razorpayid,
        key_secret: secret
    });

    // Use the actual amount, not hardcoded value
    let options = {
        amount: Number.parseInt(amount), // This should already be in paise
        currency: "INR",
        receipt: `receipt_${Date.now()}`, // Generate unique receipt
        notes: {
            to_user: to_username,
            from_name: paymentform.name
        }
    };

    try {
        let x = await instance.orders.create(options);

        // Create a payment object which shows a pending payment in the database
        await Payment.create({
            oid: x.id,
            amount: amount / 100, // Convert back to rupees for storage
            to_user: to_username,
            name: paymentform.name.trim(),
            message: paymentform.message || "",
        });

        // Return both order details and the key_id for frontend
        return {
            id: x.id,
            amount: x.amount,
            currency: x.currency,
            key_id: user.razorpayid, // Send key to frontend
            receipt: x.receipt
        };
    } catch (error) {
         throw new Error("Failed to create payment order: " + error.message);
    }
};

export const fetchuser = async (username) => {
    await connectDB();
    let u = await User.findOne({ username });
    return u ? JSON.parse(JSON.stringify(u)) : null;
};

export const fetchpayments = async (username) => {
    await connectDB();
    let p = await Payment.find({ to_user: username })
        .sort({ amount: -1 }).limit(10)
        .lean();

    return p.map(payment => ({
        ...payment,
        _id: payment._id.toString(),
    }));
};

export const updateProfile = async (data, oldusername) => {
  try {
    await connectDB();
    let ndata = data;

    if (oldusername !== ndata.username) {
      let user = await User.findOne({ username: ndata.username });
      if (user) {
        return { success: false, message: "Username is already taken" };
      }

      await User.updateOne({ email: ndata.email }, ndata);
      await Payment.updateMany({ to_user: oldusername }, { to_user: ndata.username });
    } else {
      await User.updateOne({ email: ndata.email }, ndata);
    }

    return { success: true };
  } catch (err) {
    return { success: false, message: err.message };
  }
}


