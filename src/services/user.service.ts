import { User } from "../models/user.model";
import { WixService } from "./wix.service";
import { CustomError } from "../dto/error.dto";
import { PasswordTool } from "../tools/password.tool";
import { TokenService } from "./token.service";
import { CenshareService } from "./censhare.service";
import { CheckpointService } from "./checkpoint.service";
import { UserCombinedModel } from "../types/models/user.model.types";
import {
  Login,
  Refresh,
  FinalStep,
  AuthTokens,
  InitialStep,
  AuthRedirect,
  ChangePassword,
} from "../types/services/user.service.types";

export class UserService {
  private wix: WixService;
  private token: TokenService;
  private password: PasswordTool;
  private model: UserCombinedModel;
  private censhare: CenshareService;
  private checkpoint: CheckpointService;

  constructor() {
    this.model = User;
    this.wix = new WixService();
    this.token = new TokenService();
    this.password = new PasswordTool();
    this.censhare = new CenshareService();
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
    const { _id, email, censhare, wix } = input;
    await this.censhare.create(_id, censhare);
    await this.wix.create(_id, wix);
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
      throw new CustomError("Auth Error", "Invalid input!", 401);
    }

    if (similar && state) {
      const tokens = this.token.updateTokens(encoded);
      return tokens;
    }

    const accessToken = this.token.getAccessToken(encoded);
    return { accessToken, url: "/registration/step-two" };
  }

  async refresh(input: Refresh) {
    const { refreshToken } = input;
    const decoded = this.token.decodeToken(refreshToken);

    if (typeof decoded === "string") {
      throw new CustomError("Token Error", "Expired refresh token", 401);
    }

    const encoded = { _id: decoded._id, email: decoded.email };
    const accessToken = this.token.getAccessToken(encoded);
    return { accessToken, refreshToken };
  }

  async changePassword(id: string, input: ChangePassword) {
    const user = await this.model.findById(id);
    const similar = this.password.compare(input.oldPassword, user.password);

    if (!similar) {
      throw new CustomError("User Error", "Invalid old password", 401);
    }

    const password = this.password.hash(input.newPassword);
    await this.model.changePassword(id, password);
  }

  async delete(id: string) {
    await this.model.findByIdAndDelete(id);
    await this.token.delete(id);
    await this.censhare.delete(id);
    await this.wix.delete(id);
    await this.checkpoint.delete(id);
  }
}
