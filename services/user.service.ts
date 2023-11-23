import { TokenService } from "./token.service";
import { CheckpointService } from "./checkpoint.service";
import { UriService } from "./uri.service";
import { PasswordTool } from "../tools/password.tool";
import { UserCombinedModel } from "../types/user.types";
import { User } from "../models/user.model";
import { CustomError } from "../tools/error.tool";
import { Cookies } from "../types/request.types";
import {
  AuthRedirect,
  AuthTokens,
  FinalStep,
  InitialStep,
  Login,
} from "../types/auth.types";

export class UserService {
  private uri: UriService;
  private token: TokenService;
  private password: PasswordTool;
  private model: UserCombinedModel;
  private checkpoint: CheckpointService;

  constructor() {
    this.model = User;
    this.uri = new UriService();
    this.token = new TokenService();
    this.password = new PasswordTool();
    this.checkpoint = new CheckpointService();
  }

  async getById(id: string) {
    const account = await this.model.findById(id);
    return account;
  }

  async getByEmail(email: string) {
    const account = await this.model.findByEmail(email);
    return account;
  }

  async createAccount(input: InitialStep): Promise<AuthRedirect> {
    const { email, password } = input;
    const hashedPassword = this.password.hash(password);

    const data = { email, password: hashedPassword };
    const account = await this.model.create(data);

    const _id = account._id.toString();
    await this.checkpoint.setState(_id);

    const encodedData = { _id, email };
    const accessToken = this.token.getAccessToken(encodedData);

    return { accessToken, url: "/registration/step-two" };
  }

  async fillInAccount(input: FinalStep): Promise<AuthTokens> {
    const { _id, email, ...data } = input;

    await this.uri.create(_id, data);
    await this.checkpoint.setState(_id);

    const tokens = await this.token.getTokens({ _id, email });
    return tokens;
  }

  async login(input: Login): Promise<AuthRedirect | AuthTokens> {
    const account = await this.getByEmail(input.email);
    const encoded = { _id: account._id.toString(), email: account.email };
    const similar = this.password.compare(input.password, account.password);
    const state = await this.checkpoint.getState(encoded._id);

    if (!similar) {
      throw new CustomError("Auth Error", "Invalid input!", 403);
    }

    if (similar && state) {
      const tokens = this.token.updateTokens(encoded);
      return tokens;
    }

    const accessToken = this.token.getAccessToken(encoded);
    return { accessToken, url: "/registration/step-two" };
  }

  async refresh(cookies: Cookies) {
    const { refreshToken } = cookies;
    const decoded = this.token.decodeToken(refreshToken);

    if (typeof decoded === "string") {
      throw new CustomError("Token Error", "Expired refresh token", 401);
    }

    const encoded = { _id: decoded._id, email: decoded.email };
    const accessToken = this.token.getAccessToken(encoded);
    return { accessToken, refreshToken };
  }
}
