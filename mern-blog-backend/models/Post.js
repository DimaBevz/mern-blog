import mongoose from "mongoose";

const PostSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true, 
    },
    text: {
        type: String,
        required: true,
        unique: true,
    },
    tags: {
        type: Array,
        // якщо ж ми не передаємо теги, тоді при створенні документу ми в теги зберігаємо пустий масив
        default: [],
    },
    imageUrl: {
        type: String,
        required: false,
    },
    viewsCount: {
        type: Number,
        // якщо ж ми не передаємо "viewsCount", тоді при створенні документу ми сюди записуємо 0
        default: 0
    },
    comments: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Comment",
    }],
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        require: true,
    },

    avatarUrl: String,

},
{
    timestamps: true,
});

export default mongoose.model('Post', PostSchema);