import {NextResponse} from 'next/server';
import { validatePaymentVerification } from 'razorpay/dist/utils/razorpay-utils';
import Payment from '@/models/Payment';
import Razorpay from 'razorpay';
 import connectDb from '@/db/connectDb';
import User from '@/models/User';

 export async function POST(req) {
    await connectDb()
    let body=await req.formData()
    body=Object.fromEntries(body)

    // check if razorpay is present on the server
    let p= await Payment.findOne({oid:body.razorpay_order_id})
    if(!p){
        return NextResponse.json({success:false,message:"order id not found "})
    }
    //fetch the secret of the user who is geting the payment
    let user=await User.findOne({username: p.to_user})
    const secret=user.razorpaysecret;

    // verify the payment 
    let xx=validatePaymentVerification({
     "order_id": body.razorpay_order_id,
     "payment_id": body.razorpay_payment_id},
     body.razorpay_signature
    , secret)

    if(xx){
        //update the payment status
        const updatedPayment = await Payment.findOneAndUpdate({oid:body.razorpay_order_id}, {done:"true"},{new:true})
        return NextResponse.redirect(`${process.env.NEXT_PUBLIC_URL}/${updatedPayment.to_user}?paymentdone=true`)
    }

    else{
        return NextResponse.json({success:false,message: "Payment verification failed"});
    }
 }