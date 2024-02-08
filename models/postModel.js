const mongoose = require("mongoose");
/**
 * @swagger
 * components:
 *   schemas:
 *     Post:
 *       type: object
 *       required:
 *         - content
 *         - author
 *
 *       properties:
 *         content:
 *           type: string
 *         author:
 *           type: string
 *         createdAt:
 *           type: string
 *           format: date-time
 *         photos:
 *          type: array
 *
 *
 *       example:
 *         content: "Faaaaaaaaaaaaaaager is the best!"
 *         author: 1548162188454521
 *         createdAt: "2022-02-08T12:00:00Z"
 *         photos: ["https://www.google.com/image1.jpg", "https://www.google.com/image2.jpg"]
 */
// Define the Post schema
const postSchema = new mongoose.Schema(
  {
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
  },
  { toJSON: { virtuals: true }, toObject: { virtuals: true } }
);
postSchema.virtual("comments", {
  ref: "Comment",
  foreignField: "post",
  localField: "_id",
});

// Create a Post model based on the schema
const Post = mongoose.model("Post", postSchema);

// Export the Post model
module.exports = Post;
