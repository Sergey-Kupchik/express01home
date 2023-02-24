import {UsersRepo} from "./repositories/users-db-repository";
import {UsersQueryRepo} from "./repositories/queries/users-query-repository";
import {RefreshTokensRepo} from "./repositories/refresh-token-repository";
import {TokensService} from "./services/tokens-service";
import {SecurityController} from "./routes/controllers/security-controller";
import {UsersController} from "./routes/controllers/users-controller";
import {UsersService} from "./services/users-service";
import {PostsController} from "./routes/controllers/posts-controller";
import {PostsService} from "./services/posts-service";
import {PostsRepo} from "./repositories/posts-db-repository";
import {BlogsRepo} from "./repositories/blogs-db-repository";
import {BlogsQueryRepository} from "./repositories/queries/blogs-query-repository";
import {PostsQueryRepo} from "./repositories/queries/posts-query-repository";
import {CommentsService} from "./services/coments-service";
import {CommentsRepo} from "./repositories/comments-db-repository";
import {CommentsQueryRepo} from "./repositories/queries/comments-query-repository";
import {CommentsController} from "./routes/controllers/comments-controller";
import {TestingController} from "./routes/controllers/testing-controller";
import {BlogsService} from "./services/blogs-service";
import {BlogsController} from "./routes/controllers/blogs-controller";
import {AuthController} from "./routes/controllers/auth-controller";
import RegistrationService from "./domain/registration-service";
import EmailAdapter from "./adapters/email-adapter";
import EmailManager from "./managers/email-manager";
import {LikeQueryRepo} from "./repositories/queries/likes-query-repository";
import {LikeRepo} from "./repositories/likes-db-repository";
import {LikesService} from "./services/likes-service";

//Utils
const emailAdapter:EmailAdapter = new EmailAdapter();
const emailManager:EmailManager = new EmailManager(emailAdapter);

// QueryRepositories
const userQueryRepository: UsersQueryRepo = new UsersQueryRepo()
export const commentsQueryRepository: CommentsQueryRepo = new CommentsQueryRepo()
export const blogsQueryRepository: BlogsQueryRepository = new BlogsQueryRepository()
const postsQueryRepository: PostsQueryRepo = new PostsQueryRepo()
const likesQueryRepository: LikeQueryRepo = new LikeQueryRepo()


//Repositories
const refreshTokensRepository: RefreshTokensRepo = new RefreshTokensRepo()
export const usersRepository: UsersRepo = new UsersRepo()
const commentsRepository: CommentsRepo = new CommentsRepo()
const blogsRepository: BlogsRepo = new BlogsRepo()
const postsRepository: PostsRepo = new PostsRepo()
const likesRepository: LikeRepo = new LikeRepo()


//Services
const likesService: LikesService = new LikesService(likesRepository)
export const tokensService: TokensService = new TokensService(refreshTokensRepository)
export const usersService: UsersService = new UsersService(usersRepository, tokensService, refreshTokensRepository, likesService)
const commentsService: CommentsService = new CommentsService(postsQueryRepository, commentsQueryRepository, commentsRepository)
const blogsService: BlogsService = new BlogsService(blogsRepository)
const postsService: PostsService = new PostsService(postsRepository, blogsRepository, blogsQueryRepository)
const registrationService: RegistrationService = new RegistrationService(usersService, emailManager);


//Controllers
export const securityController: SecurityController = new SecurityController(tokensService)
export const usersController = new UsersController(usersService, userQueryRepository)
export const commentsController = new CommentsController(commentsQueryRepository, commentsService, likesService);
export const blogsController = new BlogsController(postsQueryRepository, postsService, blogsQueryRepository, blogsService)
export const postsController = new PostsController(postsQueryRepository, postsService, commentsService, commentsQueryRepository)
export const authController = new AuthController(tokensService, usersService, registrationService)




export const testingController = new TestingController(postsRepository, blogsRepository, userQueryRepository, commentsQueryRepository, refreshTokensRepository, likesQueryRepository);
