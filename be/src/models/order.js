import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  products: [
    {
      product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
      quantity: { type: Number, default: 1 },
    },
  ],
  status: {
    type: String,
    enum: ['pending', 'paid', 'shipped'],
    default: 'pending',
  },
  createdAt: { type: Date, default: Date.now },
});

const Order = mongoose.model('Order', orderSchema);
export default Order;
