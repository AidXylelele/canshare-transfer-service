import jwt from "jsonwebtoken";
import { TokenOptions } from "../types/services/token.service.types";
import { AuthTokens, Identification } from "../types/services/user.service.types";

export class TokenTool {
  private tool = jwt;
  private accessOptions: TokenOptions;
  private refreshOptions: TokenOptions;

  constructor() {
    this.accessOptions = {
      secret: process.env.ACCESS_SECRET,
      expiresIn: process.env.ACCESS_EXPIRATION,
    };
    this.refreshOptions = {
      secret: process.env.REFRESH_SECRET,
      expiresIn: process.env.REFRESH_EXPIRATION,
    };
  }

  private generate(
    value: Identification,
    secret: string,
    expiresIn: string,
    isBearer: boolean = false,
  ) {
    const token = this.tool.sign(value, secret, { expiresIn });

    if (!isBearer) return token;

    return `Bearer ${token}`;
  }

  decodeToken(token: string) {
    const isAccessToken = token.includes("Bearer ");
    const { secret } = isAccessToken ? this.accessOptions : this.refreshOptions;

    if (isAccessToken) {
      token = token.replace("Bearer ", "");
    }

    return jwt.verify(token, secret);
  }

  getBasicToken(username: string, password: string) {
    const authData = `${username}:${password}`;
    const token = Buffer.from(authData).toString("base64");
    return `Basic ${token}`;
  }

  getAccessToken(value: Identification): string {
    const { secret, expiresIn } = this.accessOptions;
    const token = this.generate(value, secret, expiresIn, true);
    return token;
  }

  getRefreshToken(value: Identification): string {
    const { secret, expiresIn } = this.refreshOptions;
    const token = this.generate(value, secret, expiresIn);
    return token;
  }

  getTokens(value: Identification): AuthTokens {
    const accessToken = this.getAccessToken(value);
    const refreshToken = this.getRefreshToken(value);
    return { accessToken, refreshToken };
  }
}
