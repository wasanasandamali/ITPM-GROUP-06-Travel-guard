import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    comment: { type: String, required: true },
    rating: { type: Number, required: true },
  },
  {
    timestamps: true,
  }
);
const postSchema = new mongoose.Schema(
  {
    caption: { type: String, required: true, unique: true },
    image: { type: String, required: true },
    images: [String],
    description: { type: String, required: true },
    type: { type: String, required: true },
    location: { type: String, required: true },
    // email: { type: String, required: true, unique: true },

    rating: { type: Number, required: true },
    numReviews: { type: Number, required: true },
    reviews: [reviewSchema],
  },
  {
    timestamps: true,
  }
);

const Post = mongoose.model('Post', postSchema);
export default Post;
