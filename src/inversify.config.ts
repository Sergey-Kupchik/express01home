import "reflect-metadata";
import { Container } from "inversify";
import EmailAdapter from "./adapters/email-adapter";
import EmailManager from "./managers/email-manager";
import {UsersQueryRepo} from "./repositories/queries/users-query-repository";
import {CommentsQueryRepo} from "./repositories/queries/comments-query-repository";
import {BlogsQueryRepository} from "./repositories/queries/blogs-query-repository";
import {PostsQueryRepo} from "./repositories/queries/posts-query-repository";
import {LikeQueryRepo} from "./repositories/queries/likes-query-repository";
import {RefreshTokensRepo} from "./repositories/refresh-token-repository";
import {UsersRepo} from "./repositories/users-db-repository";
import {CommentsRepo} from "./repositories/comments-db-repository";
import {BlogsRepo} from "./repositories/blogs-db-repository";
import {PostsRepo} from "./repositories/posts-db-repository";
import {LikeRepo} from "./repositories/likes-db-repository";
import {LikesService} from "./services/likes-service";
import {TokensService} from "./services/tokens-service";
import {UsersService} from "./services/users-service";
import {BlogsService} from "./services/blogs-service";
import {PostsService} from "./services/posts-service";
import RegistrationService from "./domain/registration-service";
import {CommentsService} from "./services/coments-service";
import {SecurityController} from "./routes/controllers/security-controller";
import {UsersController} from "./routes/controllers/users-controller";
import {CommentsController} from "./routes/controllers/comments-controller";
import {BlogsController} from "./routes/controllers/blogs-controller";
import {PostsController} from "./routes/controllers/posts-controller";
import {AuthController} from "./routes/controllers/auth-controller";
import {TestingController} from "./routes/controllers/testing-controller";


export const myContainer = new Container();

//Utils
myContainer.bind<EmailAdapter>(EmailAdapter).toSelf()
myContainer.bind<EmailManager>(EmailManager).toSelf()

// QueryRepositories
myContainer.bind<UsersQueryRepo>(UsersQueryRepo).toSelf()
myContainer.bind<CommentsQueryRepo>(CommentsQueryRepo).toSelf()
myContainer.bind<BlogsQueryRepository>(BlogsQueryRepository).toSelf()
myContainer.bind<PostsQueryRepo>(PostsQueryRepo).toSelf()
myContainer.bind<LikeQueryRepo>(LikeQueryRepo).toSelf()

//Repositories
myContainer.bind<RefreshTokensRepo>(RefreshTokensRepo).toSelf()
myContainer.bind<UsersRepo>(UsersRepo).toSelf()
myContainer.bind<CommentsRepo>(CommentsRepo).toSelf()
myContainer.bind<BlogsRepo>(BlogsRepo).toSelf()
myContainer.bind<PostsRepo>(PostsRepo).toSelf()
myContainer.bind<LikeRepo>(LikeRepo).toSelf()

//Services
myContainer.bind<LikesService>(LikesService).toSelf()
myContainer.bind<TokensService>(TokensService).toSelf()
myContainer.bind<UsersService>(UsersService).toSelf()
myContainer.bind<CommentsService>(CommentsService).toSelf()
myContainer.bind<BlogsService>(BlogsService).toSelf()
myContainer.bind<PostsService>(PostsService).toSelf()
myContainer.bind<RegistrationService>(RegistrationService).toSelf()

//Controllers
myContainer.bind<SecurityController>(SecurityController).toSelf()
myContainer.bind<UsersController>(UsersController).toSelf()
myContainer.bind<CommentsController>(CommentsController).toSelf()
myContainer.bind<BlogsController>(BlogsController).toSelf()
myContainer.bind<PostsController>(PostsController).toSelf()
myContainer.bind<AuthController>(AuthController).toSelf()
myContainer.bind<TestingController>(TestingController).toSelf()