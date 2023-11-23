import { Token } from "../models/token.model";
import { TokenTool } from "../tools/token.tool";
import { Identification } from "../types/auth.types";
import { TokenCombinedModel } from "../types/token.types";

export class TokenService {
  private tool: TokenTool;
  private model: TokenCombinedModel;

  constructor() {
    this.tool = new TokenTool();
    this.model = Token;
  }

  decodeToken(token: string) {
    const data = this.tool.decodeToken(token);
    return data;
  }

  getAccessToken(value: Identification) {
    return this.tool.getAccessToken(value);
  }

  async getTokens(value: Identification) {
    const user_id = value._id;
    const { accessToken, refreshToken } = this.tool.getTokens(value);
    const data = { user_id, refreshToken };
    const isExists = await this.model.getByUserId(user_id);

    if (isExists) {
      await this.model.update(user_id, refreshToken);
    } else {
      await this.model.create(data);
    }

    return { accessToken, refreshToken };
  }

  async updateTokens(value: Identification) {
    const { accessToken, refreshToken } = this.tool.getTokens(value);
    await this.model.update(value._id, refreshToken);
    return { accessToken, refreshToken };
  }
}
