"use client";
import React from "react";
import { useState, useEffect } from "react";
import Script from "next/script";
import { useSession } from "next-auth/react";
import { useParams, useRouter } from "next/navigation";
import { initiate } from "@/actions/useractions";
import { set } from "mongoose";
import { fetchuser, fetchpayments } from "@/actions/useractions";
import { Bounce, ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { notfound } from "next/navigation";
import { useSearchParams } from 'next/navigation'

const PaymentPage = ({ username }) => {
  // ALL HOOKS MUST BE AT THE TOP - SAME ORDER ALWAYS
  const params = useParams();
  const router = useRouter();
  const { data: session } = useSession();
  const searchParams = useSearchParams();

  // ALL useState HOOKS TOGETHER
  const [mounted, setMounted] = useState(false);
  const [paymentform, setpaymentform] = useState({
    name: "",
    message: "",
    amount: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentuser, setcurrentuser] = useState({});
  const [payments, setPayments] = useState([]);

  // Get username from multiple sources
  const actualUsername = username || params?.username || params?.slug;

  // DEFINE FUNCTIONS BEFORE useEffect
  const getData = async () => {
    try {
      if (!actualUsername) return;
      
      let u = await fetchuser(actualUsername);
      setcurrentuser(u || {});
      let dbpayments = await fetchpayments(actualUsername);
      setPayments(dbpayments || []);
    } catch (error) {
      console.error("Error fetching data:", error);
      if (mounted) {
        toast.error("Failed to load user data");
      }
    }
  };

  const handleChange = (e) => {
    setpaymentform({ ...paymentform, [e.target.name]: e.target.value });
    setError(null);
  };

  const pay = async (amount) => {
    setError(null);

    if (!paymentform.name || !paymentform.name.trim()) {
      setError("Please enter your name");
      toast.error("Please enter your name");
      return;
    }

    if (!amount || amount <= 0) {
      setError("Please enter a valid amount");
      toast.error("Please enter a valid amount");
      return;
    }

    if (!actualUsername) {
      setError("Username is missing. Please refresh the page.");
      toast.error("Username is missing. Please refresh the page.");
      return;
    }

    setLoading(true);

    try {
      console.log("Calling initiate with:", {
        amount,
        actualUsername,
        paymentform,
      });
      
      let orderData = await initiate(amount, actualUsername, paymentform);
      let orderId = orderData.id;
      let razorpayKey = orderData.key_id;

      console.log("Order created:", {
        orderId,
        key: razorpayKey ? "Present" : "Missing",
      });

      if (!razorpayKey) {
        throw new Error("Razorpay API key is not available");
      }

      var options = {
        key: currentuser.razorpayid,
        amount: amount,
        currency: "INR",
        name: "Buy me A CHAI",
        description: "Test Transaction",
        image: "https://example.com/your_logo",
        order_id: orderId,
        callback_url: `${process.env.NEXT_PUBLIC_URL}/api/razorpay`,
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
          toast.success("Payment successful! Thank you for your support!", {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            theme: "light",
            transition: Bounce,
          });
          
          console.log("Payment response:", response);
          setpaymentform({
            name: "",
            message: "",
            amount: "",
          });
          
          getData();
        },
        modal: {
          ondismiss: function () {
            setLoading(false);
            toast.info("Payment cancelled");
          },
        },
      };

      if (typeof window !== "undefined" && window.Razorpay) {
        var rzp1 = new window.Razorpay(options);
        rzp1.open();
      } else {
        throw new Error("Razorpay SDK not loaded");
      }
    } catch (error) {
      console.error("Payment error:", error);
      const errorMessage = `Payment failed: ${error.message}`;
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    const amount = parseFloat(paymentform.amount);
    if (amount && amount > 0) {
      pay(amount * 100);
    } else {
      toast.error("Please enter a valid amount");
    }
  };

  const handleQuickPay = (rupees) => {
    if (!paymentform.name.trim()) {
      toast.error("Please enter your name first");
      return;
    }
    setpaymentform({ ...paymentform, amount: rupees.toString() });
    pay(rupees * 100);
  };

  // ALL useEffect HOOKS AT THE END - SAME ORDER ALWAYS
  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted && actualUsername) {
      getData();
    }
  }, [mounted, actualUsername]);

  useEffect(() => {
    if (!mounted) return;
    
    if (searchParams.get("paymentdone") === "true") {
      toast.success("Thanks for your donation!", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
        transition: Bounce,
      });
      router.replace(`/${actualUsername}`, undefined, { shallow: true });
    }
  }, [mounted, searchParams, actualUsername, router]);

  // CONDITIONAL RENDERING AFTER ALL HOOKS
  if (!mounted) {
    return (
      <div className="bg-gray-900 text-white min-h-screen">
        <div className="flex justify-center items-center min-h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
            <p>Loading...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!actualUsername) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-900 text-white">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-500 mb-4">
            Error: Username Not Found
          </h1>
          <p className="text-gray-600 mb-4">
            Unable to find username from URL or props.
          </p>
          <button
            onClick={() => router.push("/")}
            className="bg-blue-600 text-white px-4 py-2 rounded"
          >
            Go Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
        transition={Bounce}
      />
      
      <div className="bg-gray-900 text-white">
        <Script
          src="https://checkout.razorpay.com/v1/checkout.js"
          strategy="lazyOnload"
        />

        {/* Cover Section */}
        <div className="cover w-full relative">
          <img
            className="object-cover w-full h-[300px] md:h-[400px]"
            src={currentuser.coverpic || "/default-cover.jpg"}
            alt="Cover"
          />
          <div className="absolute -bottom-10 left-1/2 transform -translate-x-1/2">
            <img
              className="w-20 h-20 border-white border-4 rounded-full object-cover"
              src={currentuser.profilepic || "/default-avatar.jpg"}
              alt="Profile"
            />
          </div>
        </div>

        {/* Info Section */}
        <div className="info flex justify-center items-center mt-16 mb-8 flex-col gap-2 px-4">
          <div className="font-bold text-xl md:text-2xl">@{actualUsername}</div>
          <div className="text-slate-400 text-center">
            Lets help {username} get a chai 
           </div>
          <div className="text-slate-400 text-sm text-center">
          {payments.length} Payments. {payments.reduce((acc, p) => acc + p.amount, 0).toFixed(2)} raised
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
        <div className="payment-container w-full max-w-6xl mx-auto px-4 pb-8 flex flex-col md:flex-row">
          <div className="payment flex flex-col lg:flex-row gap-6">
            {/* Supporters Section */}
            <div className="supporters w-full md:w-1/2 bg-slate-800 rounded-lg p-6">
              <h2 className="text-lg font-bold mb-4">Top 10 Supporters</h2>
              <ul className="space-y-4">
                {payments.length === 0 && <li>No Payments</li>}
                {payments.map((p, i) => {
                  return (
                    <li key={`payment-${i}-${p.name || 'anonymous'}`} className="flex gap-3 items-center">
                      <img
                        width={44}
                        height={44}
                        src="/avatar.gif"
                        alt="Supporter avatar"
                        className="rounded-full"
                      />
                      <span className="text-sm">
                        {p.name} donated{" "}
                        <span className="font-bold">₹{p.amount}</span> with a
                        message:- {p.message}
                      </span>
                    </li>
                  );
                })}
              </ul>
            </div>

            {/* Payment Form Section */}
            <div className="makePayment  w-full md:w-1/2 bg-slate-800 rounded-lg p-6">
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
                  autoComplete="name"
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
                  autoComplete="off"
                />
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-blue-600 text-white p-3 rounded-md hover:bg-blue-700 disabled:bg-gray-600 transition-colors"
                >
                  {loading
                    ? "Processing..."
                    : `Pay ₹${paymentform.amount || 0}`}
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
    </>
  );
};

export default PaymentPage;