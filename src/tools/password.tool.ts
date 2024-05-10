import crypto from "node:crypto";

export class PasswordTool {
  private tool = crypto;
  private salt: string;
  private length: number;
  private method: BufferEncoding;

  constructor() {
    this.salt = process.env.HASH_SALT;
    this.length = 64;
    this.method = "hex";
  }
  hash(password: string) {
    return this.tool.scryptSync(password, this.salt, this.length).toString(this.method);
  }
  compare(password: string, hash: string) {
    const hashedPassword = this.hash(password);
    return hashedPassword === hash;
  }
}
