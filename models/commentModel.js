const mongoose = require("mongoose");

// Define the commen schema
const commentSchema = new mongoose.Schema(
  {
    content: {
      type: String,
      required: true,
    },
    post: {
      type: mongoose.Schema.ObjectId,
      ref: "Post",
      required: [true, "comment must belong to a post."],
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
          return value.length <= 1;
        },
        message: "Maximum of 4 photos allowed",
      },
    },
  },
  { toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

commentSchema.pre(/^find/, function (next) {
  this.populate({
    path: "author",
    select: "userName photo",
  });
  next();
});
// Create a Post model based on the schema
const Comment = mongoose.model("Comment", commentSchema);

// Export the Post model
module.exports = Comment;
