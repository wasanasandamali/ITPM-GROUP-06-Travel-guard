import express from 'express';
import Product from '../models/productModel.js';
import data from '../data.js';
import User from '../models/userModel.js';
import Post from '../models/postModel.js';

const seedRouter = express.Router();

seedRouter.get('/', async (req, res) => {
  await Product.remove({});
  const createdProducts = await Product.insertMany(data.products);
  await User.remove({});
  const createdUsers = await User.insertMany(data.users);
  await Post.remove({});
  const createdPosts = await Post.insertMany(data.posts);

  res.send({ createdProducts, createdUsers, createdPosts });
});
export default seedRouter;
