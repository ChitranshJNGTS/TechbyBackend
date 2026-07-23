const razorpay = require("../config/razorpay");
const Interview = require("../models/DemoInterviewModel");
const crypto = require("crypto");
// const Interview = require("../models/DemoInterviewModel");


exports.createOrder = async (req,res)=>{

    try{


        const {interviewId}=req.body;


        const interview = await Interview.findById(interviewId);


        if(!interview){

            return res.status(404).json({
                success:false,
                message:"Interview slot not found"
            });

        }



        if(interview.bookedSeats >= interview.totalSeats){

            return res.status(400).json({
                success:false,
                message:"Seats are full"
            });

        }



        const options={

            amount: interview.price * 100,

            currency:"INR",

            receipt:`interview_${Date.now()}`,

            notes:{

                interviewId:interview._id.toString()

            }

        };



        const order = await razorpay.orders.create(options);



        res.status(200).json({

            success:true,

            order

        });



    }
    catch(error){

        console.log(error);


        res.status(500).json({

            success:false,

            message:"Order creation failed"

        });

    }

}; 


exports.verifyPayment = async (req, res) => {
    try {

        const {
            razorpay_order_id,
            razorpay_payment_id,
            razorpay_signature,
            interviewId
        } = req.body;

        if (
            !razorpay_order_id ||
            !razorpay_payment_id ||
            !razorpay_signature ||
            !interviewId
        ) {
            return res.status(400).json({
                success: false,
                message: "Missing payment details"
            });
        }

        // Create signature
        const generatedSignature = crypto
            .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
            .update(
                razorpay_order_id + "|" + razorpay_payment_id
            )
            .digest("hex");

        // Verify signature
        if (generatedSignature !== razorpay_signature) {
            return res.status(400).json({
                success: false,
                message: "Invalid payment signature"
            });
        }

        // Find Interview
        const interview = await Interview.findById(interviewId);

        if (!interview) {
            return res.status(404).json({
                success: false,
                message: "Interview not found"
            });
        }

        // Check seat availability
        if (interview.bookedSeats >= interview.totalSeats) {
            return res.status(400).json({
                success: false,
                message: "Seats are already full"
            });
        }

        // Increase booked seats
        interview.bookedSeats += 1;

        await interview.save();

        return res.status(200).json({
            success: true,
            message: "Payment verified & interview booked successfully",
            paymentId: razorpay_payment_id,
            orderId: razorpay_order_id
        });

    } catch (error) {

        console.log(error);

        return res.status(500).json({
            success: false,
            message: "Payment verification failed"
        });

    }
};