"use client";
import React from "react";
import { useState, useEffect } from "react";
import Script from "next/script";
import { useSession } from "next-auth/react";
import { useParams, useRouter } from "next/navigation";
import { initiate } from "@/actions/useractions";
import { set } from "mongoose";
import { fetchuser, fetchpayments } from "@/actions/useractions";

const PaymentPage = ({ username }) => {
    const params = useParams();
    const router = useRouter();
    const { data: session } = useSession();

    // Get username from multiple sources
    const actualUsername = username || params?.username || params?.slug;
    
    const [paymentform, setpaymentform] = useState({
        name: "",
        message: "",
        amount: ""
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [currentuser, setcurrentuser] = useState({});
    const [payments, setPayments] = useState([]);

useEffect(() => {
  getData();
}, []);

    // Debug logging
    useEffect(() => {
        console.log("PaymentPage Debug Info:", {
            usernameProp: username,
            params: params,
            actualUsername: actualUsername,
            pathname: window.location.pathname
        });
    }, [username, params, actualUsername]);

    // Show error if no username is found
    if (!actualUsername) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="text-center">
                    <h1 className="text-2xl font-bold text-red-500 mb-4">Error: Username Not Found</h1>
                    <p className="text-gray-600 mb-4">
                        Unable to find username from URL or props.
                    </p>
                    <p className="text-sm text-gray-500 mb-4">
                        Current path: {typeof window !== 'undefined' ? window.location.pathname : 'Unknown'}
                    </p>
                    <button 
                        onClick={() => router.push('/')}
                        className="bg-blue-600 text-white px-4 py-2 rounded"
                    >
                        Go Home
                    </button>
                </div>
            </div>
        );
    }

    const handleChange = (e) => {
        setpaymentform({ ...paymentform, [e.target.name]: e.target.value });
        setError(null); // Clear error when user starts typing
    };


    const getData = async () => {
        let u = await fetchuser(username);
        setcurrentuser(u);
        let dbpayments = await fetchpayments(username);
        setPayments(dbpayments);
    };


    const pay = async (amount) => {
        // Reset error state
        setError(null);

        // Validate form data before proceeding
        if (!paymentform.name || !paymentform.name.trim()) {
            setError("Please enter your name");
            return;
        }

        if (!amount || amount <= 0) {
            setError("Please enter a valid amount");
            return;
        }

        if (!actualUsername) {
            setError("Username is missing. Please refresh the page.");
            return;
        }

        setLoading(true);
        
        try {
            // get the order_id and key from server
            console.log("Calling initiate with:", { amount, actualUsername, paymentform });
            let orderData = await initiate(amount, actualUsername, paymentform);
            let orderId = orderData.id;
            let razorpayKey = orderData.key_id;

            console.log("Order created:", { orderId, key: razorpayKey ? "Present" : "Missing" });

            if (!razorpayKey) {
                throw new Error("Razorpay API key is not available");
            }

            var options = {
                key: razorpayKey, // Use key from server response
                amount: amount,
                currency: "INR",
                name: "Buy me A CHAI",
                description: "Test Transaction",
                image: "https://example.com/your_logo",
                order_id: orderId,
                callback_url: `${process.env.NEXT_PUBLIC_URL}/api/razorpay`, // Hardcoded for now since we can't access server env vars
                prefill: {
                    name: paymentform.name,
                    email: session?.user?.email || "user@example.com",
                    contact: "+919876543210",
                },
                notes: {
                    address: "Razorpay Corporate Office",
                },
                theme: {
                    color: "#3399cc",
                },
                handler: function (response) {
                    alert("Payment successful!");
                    console.log("Payment response:", response);
                    setpaymentform({
                        name: "",
                        message: "",
                        amount: ""
                    });
                },
                modal: {
                    ondismiss: function () {
                        setLoading(false);
                    }
                }
            };

            if (window.Razorpay) {
                var rzp1 = new window.Razorpay(options);
                rzp1.open();
            } else {
                throw new Error("Razorpay SDK not loaded");
            }
        } catch (error) {
            console.error("Payment error:", error);
            setError(`Payment failed: ${error.message}`);
        } finally {
            setLoading(false);
        }
    };

    const handleFormSubmit = (e) => {
        e.preventDefault();
        const amount = parseFloat(paymentform.amount);
        if (amount && amount > 0) {
            pay(amount * 100);
        }
    };

    const handleQuickPay = (rupees) => {
        setpaymentform({ ...paymentform, amount: rupees });
        pay(rupees * 100);
    };

    return (
        <div className=" bg-gray-900 text-white">
            <Script 
                src="https://checkout.razorpay.com/v1/checkout.js"
                strategy="lazyOnload"
            />

            {/* Cover Section */}
            <div className="cover w-full relative">
                <img
                    className="object-cover w-full h-[300px] md:h-[400px]"
                    src="https://c10.patreonusercontent.com/4/patreon-media/p/campaign/4842667/452146dcfeb04f38853368f554aadde1/eyJ3IjoxOTIwLCJ3ZSI6MX0%3D/18.gif?token-hash=Mh-B5X0fAjX72C_3Ggf-nQMUUe4b4Os4Y0qll01wqq4%3D&token-time=1756944000"
                    alt="Cover"
                />
                <div className="absolute -bottom-10 left-1/2 transform -translate-x-1/2">
                    <img
                        className="w-20 h-20 border-white border-4 rounded-full object-cover"
                        src="https://c10.patreonusercontent.com/4/patreon-media/p/campaign/4842667/aa52624d1cef47ba91c357da4a7859cf/eyJoIjozNjAsInciOjM2MH0%3D/4.gif?token-hash=Yba7noaXrkDOMMsj2hso6HM0jHfMvZyC815qC9FWlPU%3D&token-time=1756425600"
                        alt="Profile"
                    />
                </div>
            </div>

            {/* Info Section */}
            <div className="info flex justify-center items-center mt-16 mb-8 flex-col gap-2 px-4">
                <div className="font-bold text-xl md:text-2xl">@{actualUsername}</div>
                <div className="text-slate-400 text-center">Creating Animated art for TV</div>
                <div className="text-slate-400 text-sm text-center">
                    97,123 Members || 82 POSTS || 450 RELEASES
                </div>
            </div>

            {/* Error Message */}
            {error && (
                <div className="w-full max-w-4xl mx-auto mb-6 px-4">
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                        {error}
                    </div>
                </div>
            )}

            {/* Payment Section */}
            <div className="payment-container w-full max-w-6xl mx-auto px-4 pb-8">
                <div className="payment flex flex-col lg:flex-row gap-6">
                    {/* Supporters Section */}
                    <div className="supporters w-full lg:w-1/2 bg-slate-800 rounded-lg p-6">
                        <h2 className="text-lg font-bold mb-4">Supporters</h2>
                        <ul className="space-y-4">
                            {payments.map((p,i) =>{
                             return <li key={i} className="flex gap-3 items-center">
                                <img 
                                    width={44} 
                                    height={44}
                                    src="avatar.gif" 
                                    alt="Supporter avatar"
                                    className="rounded-full"
                                />
                                <span className="text-sm">
                                    {p.name} donated <span className="font-bold">₹{p.amount}</span> with a message:
                                     {p.message}
                                </span>
                            </li>
})}
                        </ul>
                    </div>
                    
                    {/* Payment Form Section */}
                    <div className="makePayment w-full lg:w-1/2 bg-slate-800 rounded-lg p-6">
                        <h2 className="text-lg font-bold mb-4">Make a Payment</h2>
                        <form onSubmit={handleFormSubmit}>
                            <input
                                onChange={handleChange}
                                value={paymentform.name || ""}
                                name="name"
                                type="text"
                                placeholder="Enter your name"
                                className="w-full p-3 rounded-md bg-gray-700 text-white mb-4 border border-gray-600 focus:border-blue-500 focus:outline-none"
                                required
                            />
                            <textarea
                                onChange={handleChange}
                                value={paymentform.message || ""}
                                name="message"
                                placeholder="Enter your message"
                                className="w-full p-3 rounded-md bg-gray-700 text-white mb-4 border border-gray-600 focus:border-blue-500 focus:outline-none resize-vertical"
                                rows="3"
                            />
                            <input
                                onChange={handleChange}
                                value={paymentform.amount || ""}
                                name="amount"
                                type="number"
                                min="1"
                                step="0.01"
                                placeholder="Enter amount (₹)"
                                className="w-full p-3 rounded-md bg-gray-700 text-white mb-4 border border-gray-600 focus:border-blue-500 focus:outline-none"
                                required
                            />
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-blue-600 text-white p-3 rounded-md hover:bg-blue-700 disabled:bg-gray-600 transition-colors"
                            >
                                {loading ? "Processing..." : `Pay ₹${paymentform.amount || 0}`}
                            </button>
                        </form>
                        
                        {/* Quick Pay Buttons */}
                        <div className="flex flex-col sm:flex-row justify-center items-center gap-4 mt-4">
                            <button
                                className="w-full sm:w-auto bg-green-600 text-white px-6 py-2 rounded-md hover:bg-green-700 disabled:bg-gray-600 transition-colors"
                                disabled={loading || !paymentform.name.trim()}
                                onClick={() => handleQuickPay(20)}
                            >
                                Pay ₹20
                            </button>
                            <button
                                className="w-full sm:w-auto bg-green-600 text-white px-6 py-2 rounded-md hover:bg-green-700 disabled:bg-gray-600 transition-colors"
                                disabled={loading || !paymentform.name.trim()}
                                onClick={() => handleQuickPay(10)}
                            >
                                Pay ₹10
                            </button>
                        </div>
                        
                        {!paymentform.name.trim() && (
                            <p className="text-red-400 text-sm mt-2 text-center">
                                Please enter your name to make a payment
                            </p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PaymentPage;