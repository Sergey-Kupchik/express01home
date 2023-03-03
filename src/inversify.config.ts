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
myContainer.bind<EmailAdapter>(EmailAdapter).to(EmailAdapter);
myContainer.bind<EmailManager>(EmailManager).to(EmailManager);

// QueryRepositories
myContainer.bind<UsersQueryRepo>(UsersQueryRepo).to(UsersQueryRepo);
myContainer.bind<CommentsQueryRepo>(CommentsQueryRepo).to(CommentsQueryRepo);
myContainer.bind<BlogsQueryRepository>(BlogsQueryRepository).to(BlogsQueryRepository);
myContainer.bind<PostsQueryRepo>(PostsQueryRepo).to(PostsQueryRepo);
myContainer.bind<LikeQueryRepo>(LikeQueryRepo).to(LikeQueryRepo);

//Repositories
myContainer.bind<RefreshTokensRepo>(RefreshTokensRepo).to(RefreshTokensRepo);
myContainer.bind<UsersRepo>(UsersRepo).to(UsersRepo);
myContainer.bind<CommentsRepo>(CommentsRepo).to(CommentsRepo);
myContainer.bind<BlogsRepo>(BlogsRepo).to(BlogsRepo);
myContainer.bind<PostsRepo>(PostsRepo).to(PostsRepo);
myContainer.bind<LikeRepo>(LikeRepo).to(LikeRepo);

//Services
myContainer.bind<LikesService>(LikesService).to(LikesService);
myContainer.bind<TokensService>(TokensService).to(TokensService);
myContainer.bind<UsersService>(UsersService).to(UsersService);
myContainer.bind<CommentsService>(CommentsService).to(CommentsService);
myContainer.bind<BlogsService>(BlogsService).to(BlogsService);
myContainer.bind<PostsService>(PostsService).to(PostsService);
myContainer.bind<RegistrationService>(RegistrationService).to(RegistrationService);

//Controllers
myContainer.bind<SecurityController>(SecurityController).to(SecurityController);
myContainer.bind<UsersController>(UsersController).to(UsersController);
myContainer.bind<CommentsController>(CommentsController).to(CommentsController);
myContainer.bind<BlogsController>(BlogsController).to(BlogsController);
myContainer.bind<PostsController>(PostsController).to(PostsController);
myContainer.bind<AuthController>(AuthController).to(AuthController);
myContainer.bind<TestingController>(TestingController).to(TestingController);