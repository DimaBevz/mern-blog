import CommentModel from "../models/Comment.js";
import PostModel from "../models/Post.js";

export const create = async (req, res) => {
  try {
    const doc = new CommentModel({
      text: req.body.text,
      postId: req.body.postId,
      user: req.userId,
      post: req.body.postId
    });

    const comment = await doc.save();

    await PostModel.findByIdAndUpdate(
      req.body.postId,
      {
        $push: {
          comments: comment._id
        }
      }
    );

    // повертаємо відповідь
    res.json(comment);
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Failed to create comment",
    });
  }
};

export const getComments = async (req, res) => {
  try {
    const postId = req.params.postId;
    const comments = await CommentModel.find({postId: postId}).populate("user");

    if (!comments) {
      res.status(404).json({
        message: "Not found comments",
      });
    }

    res.json(comments);
  } catch (error) {
    console.log(error);
    res.status(404).json({
      message: "Not found comments",
    });
  }
};

export const getLastComments = async (req, res) => {
  try {
    const postId = req.params.postId;
    const comments = await CommentModel.find({postId: postId});
    const lastComments = comments.slice(-3);

    if (!lastComments) {
      res.status(404).json({
        message: "Not found comments",
      });
    }

    res.json(lastComments);
  } catch (error) {
    console.log(error);
    res.status(404).json({
      message: "Not found comments",
    });
  }
};