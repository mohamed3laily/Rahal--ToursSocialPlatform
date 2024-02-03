const mongoose = require("mongoose");

// Define the Post schema
const postSchema = new mongoose.Schema({
  content: {
    type: String,
    required: true,
  },
  author: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
    required: [true, "post must belong to a user."],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },

  photos: {
    type: [String], // Array of image URLs
    validate: {
      validator: function (value) {
        // Allow only a maximum of 4 photos
        return value.length <= 4;
      },
      message: "Maximum of 4 photos allowed",
    },
  },
});

// Create a Post model based on the schema
const Post = mongoose.model("Post", postSchema);

// Export the Post model
module.exports = Post;
