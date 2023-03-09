import {WithId} from 'mongodb'


type UserDbType = WithId<{
    accountData: {
        id: string
        login: string
        email: string
        hash: string
        createdAt: string
        invalidRefreshTokens: string[]
    },
    emailConfirmation: EmailConfirmationType,
    resetPasswordHash?: string,
    // resetPasswordExpires?: string
}>;

type EmailConfirmationType ={
    confirmationCode: string
    expirationDate: Date
    isConfirmed: boolean
}

type PostDbType = WithId<{
    id: string
    title: string
    shortDescription: string
    content: string
    blogId: string
    blogName: string
    createdAt: string
}>;

type BlogDbType = WithId<{
    id: string
    name: string
    websiteUrl: string
    createdAt: string
    description: string
}>;

type CommentDbType = WithId<{
    id: string
    content: string
    userId: string
    userLogin: string
    createdAt: string
    postId: string
}>;
type LikeDbType = WithId<{
    userId: string
    comments: {
        like: Array<string>,
        dislike: Array<string>,
    }
    posts: {
        like: Array<string>,
        dislike: Array<string>,
    }
}>;

type RefreshTokensInfoDbType = WithId<{
    userId: string,
    refreshTokensInfo: Array<{
        deviceId: string,
        lastActiveDate: string,
        ip: string,
        title: string,
        expiresIn: string,
    }>
}>;

export {UserDbType, PostDbType, BlogDbType, CommentDbType, RefreshTokensInfoDbType, LikeDbType}