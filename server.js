const express = require('express');
const Razorpay = require('razorpay');
const app = express();

app.use(express.static('.'));
app.use(express.json());

const razorpay = new Razorpay({
    key_id: 'rzp_test_xxxxxxxxxxxx',       // Your Razorpay test Key ID
    key_secret: 'xxxxxxxxxxxxxxxxxxxxxxx'  // Your Razorpay test Key Secret
});

app.post('/create-order', async (req, res) => {
    const { amount } = req.body;
    const options = {
        amount: amount * 100, // amount in paise
        currency: "INR",
        receipt: "order_rcptid_11"
    };
    try {
        const order = await razorpay.orders.create(options);
        res.json(order);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.listen(3000, () => console.log('Server running on http://localhost:3000'));