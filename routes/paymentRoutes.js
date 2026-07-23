const express=require("express");

const router=express.Router();


const {createOrder,verifyPayment}=require("../controllers/paymentController");


router.post("/verify", verifyPayment);
router.post("/create-order",createOrder);



module.exports=router;