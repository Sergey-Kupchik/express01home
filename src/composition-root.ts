// import EmailAdapter from "./adapters/email-adapter";
// import RegistrationService from "./domain/registration-service";
// import EmailManager from "./managers/email-manager";
// import { BlogsRepo } from "./repositories/blogs-db-repository";
// import { CommentsRepo } from "./repositories/comments-db-repository";
// import { LikeRepo } from "./repositories/likes-db-repository";
// import { PostsRepo } from "./repositories/posts-db-repository";
// import { BlogsQueryRepository } from "./repositories/queries/blogs-query-repository";
// import { CommentsQueryRepo } from "./repositories/queries/comments-query-repository";
// import { LikeQueryRepo } from "./repositories/queries/likes-query-repository";
// import { PostsQueryRepo } from "./repositories/queries/posts-query-repository";
// import { UsersQueryRepo } from "./repositories/queries/users-query-repository";
// import { RefreshTokensRepo } from "./repositories/refresh-token-repository";
// import { UsersRepo } from "./repositories/users-db-repository";
// import { AuthController } from "./routes/controllers/auth-controller";
// import { BlogsController } from "./routes/controllers/blogs-controller";
// import { CommentsController } from "./routes/controllers/comments-controller";
// import { PostsController } from "./routes/controllers/posts-controller";
// import { SecurityController } from "./routes/controllers/security-controller";
// import { TestingController } from "./routes/controllers/testing-controller";
// import { UsersController } from "./routes/controllers/users-controller";
// import { BlogsService } from "./services/blogs-service";
// import { CommentsService } from "./services/coments-service";
// import { LikesService } from "./services/likes-service";
// import { PostsService } from "./services/posts-service";
// import { TokensService } from "./services/tokens-service";
// import { UsersService } from "./services/users-service";

// //Utils
// const emailAdapter:EmailAdapter = new EmailAdapter();
// const emailManager:EmailManager = new EmailManager(emailAdapter);

// // QueryRepositories
// const userQueryRepository: UsersQueryRepo = new UsersQueryRepo()
// export const commentsQueryRepository: CommentsQueryRepo = new CommentsQueryRepo()
// export const blogsQueryRepository: BlogsQueryRepository = new BlogsQueryRepository()
// const postsQueryRepository: PostsQueryRepo = new PostsQueryRepo()
// const likesQueryRepository: LikeQueryRepo = new LikeQueryRepo()


// //Repositories
// const refreshTokensRepository: RefreshTokensRepo = new RefreshTokensRepo()
// export const usersRepository: UsersRepo = new UsersRepo()
// const commentsRepository: CommentsRepo = new CommentsRepo()
// const blogsRepository: BlogsRepo = new BlogsRepo()
// const postsRepository: PostsRepo = new PostsRepo()
// const likesRepository: LikeRepo = new LikeRepo()


// //Services
// const likesService: LikesService = new LikesService(likesRepository, likesQueryRepository)
// export const tokensService: TokensService = new TokensService(refreshTokensRepository)
// export const usersService: UsersService = new UsersService(usersRepository, tokensService, refreshTokensRepository, likesService)
// const commentsService: CommentsService = new CommentsService(postsQueryRepository, commentsQueryRepository, commentsRepository, likesQueryRepository)
// const blogsService: BlogsService = new BlogsService(blogsRepository)
// const postsService: PostsService = new PostsService(postsRepository, blogsRepository, blogsQueryRepository)
// const registrationService: RegistrationService = new RegistrationService(usersService, emailManager);


// //Controllers
// export const securityController: SecurityController = new SecurityController(tokensService)
// export const usersController = new UsersController(usersService, userQueryRepository)
// export const commentsController = new CommentsController(commentsQueryRepository, commentsService, likesService, likesQueryRepository);
// export const blogsController = new BlogsController(postsQueryRepository, postsService, blogsQueryRepository, blogsService)
// export const postsController = new PostsController(postsQueryRepository, postsService, commentsService, commentsQueryRepository, likesQueryRepository)
// export const authController = new AuthController(tokensService, usersService, registrationService)




// export const testingController = new TestingController(postsRepository, blogsRepository, userQueryRepository, commentsQueryRepository, refreshTokensRepository, likesQueryRepository);
