import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
  role: String,
  favorites: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }],
  viewedProducts: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }],
});

const User = mongoose.model('User', userSchema);
export default User;
