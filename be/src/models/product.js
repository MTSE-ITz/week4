import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  brand: { type: String, required: true },
  price: { type: Number, required: true },
  description: { type: String },
  specifications: {
    screen: String,
    cpu: String,
    ram: String,
    storage: String,
    battery: String,
    camera: String,
    os: String,
  },
  images: [String],
  inStock: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
  totalSold: { type: Number, default: 0 },
  totalReviews: { type: Number, default: 0 },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    required: true,
  },
});

const Product = mongoose.model('Product', productSchema);
export default Product;
