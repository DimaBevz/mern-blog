import mongoose from "mongoose";

const CommentSchema = new mongoose.Schema({
    text: {
        type: String,
        required: true,
        unique: false,
    },
    postId: {
        type: String,
        required: true,
        unique: false,
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    },
    post: {
        type: mongoose.Schema.Types.ObjectId, 
        ref: "Post"
    }
},
{
    timestamps: true,
});

export default mongoose.model('Comment', CommentSchema);