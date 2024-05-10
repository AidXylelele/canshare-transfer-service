import { FetchTool } from "../../tools/fetch.tool";
import { CustomError } from "../../dto/error.dto";
import { ListOfEntities } from "../../types/services/censhare.service.types";

export class CenshareValidator extends FetchTool {
  constructor() {
    super(process.env.CENSHARE_API_URL);
  }

  private validate(list: ListOfEntities) {
    const { length } = Object.keys(list);

    if (!length) {
      throw new CustomError("Censhare Auth", "Invalid credentials!", 401);
    }

    return true;
  }

  async checkCredentials(username: string, password: string) {
    const route = "/";
    const auth = { username, password };
    const request = this.tool.get(route, { auth });
    const response: ListOfEntities = await this.handler(request);
    return this.validate(response);
  }
}
