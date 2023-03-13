import mongoose from "mongoose";
import {BlogDbType, CommentDbType, LikeDbType, PostDbType, RefreshTokensInfoDbType, UserDbType} from "./types";

const userSchema = new mongoose.Schema<UserDbType>({
    accountData: {
        id: {type: String, required: true,},
        login: {type: String, required: true,},
        email: {type: String, required: true,},
        hash: {type: String, required: true,},
        createdAt: {type: String, required: true,},
        invalidRefreshTokens: [{type: String, required: true,},],
        resetPasswordHash: {type: String, required: false},
        // resetPasswordExpires: {type: String, required: false},
    },
    emailConfirmation: {
        confirmationCode: {type: String, required: true,},
        expirationDate: Date,
        isConfirmed: Boolean,
    },
});

const postSchema = new mongoose.Schema<PostDbType>({
    id: {type: String, required: true,},
    title: {type: String, required: true,},
    shortDescription: {type: String, required: true,},
    content: {type: String, required: true,},
    blogId: {type: String, required: true,},
    blogName: {type: String, required: true,},
    createdAt: {type: String, required: true,},
});

const blogSchema = new mongoose.Schema<BlogDbType>({
    id: {type: String, required: true,},
    name: {type: String, required: true,},
    websiteUrl: {type: String, required: true,},
    createdAt: {type: String, required: true,},
    description: {type: String, required: true,},
});

const commentSchema = new mongoose.Schema<CommentDbType>({
    id: {type: String, required: true,},
    content: {type: String, required: true},
    userId: {type: String, required: true},
    userLogin: {type: String, required: true},
    createdAt: {type: String, required: true},
    postId: {type: String, required: true},
});

const likeSchema = new mongoose.Schema<LikeDbType>({
    userId: {type: String, required: true},
    comments: {
        like: [{type: String, default: []}],
        dislike: [{type: String, default: []}],
    },
    posts: {
        like: [
            {
                postId: {type: String},
                addedAt: {type: String},
            },
        ],
        dislike: [{type: String, default: []}],
    }
});

const refreshTokensInfoSchema = new mongoose.Schema<RefreshTokensInfoDbType>({
    userId: {type: String, required: true},
    refreshTokensInfo: [{
        deviceId: {type: String, required: true},
        lastActiveDate: {type: String, required: true},
        ip: {type: String, required: true},
        title: {type: String, required: true},
        expiresIn: {type: String, required: true},
    }]
});

export {userSchema, refreshTokensInfoSchema, commentSchema, blogSchema, postSchema, likeSchema}