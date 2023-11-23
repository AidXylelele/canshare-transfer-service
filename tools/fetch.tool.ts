import { CustomError } from "./error.tool";
import axios, { Axios, AxiosError } from "axios";

export class FetchTool {
  private tool: Axios;
  private readonly resentCases = [502, 429];
  private readonly options = {
    headers: { "Content-Type": "application/json" },
  };

  constructor() {
    this.tool = axios;
  }

  private isResent(error: any) {
    if (!(error instanceof AxiosError)) return false;

    const { response } = error;

    if (!response) return false;

    if (this.resentCases.includes(response.status)) return true;

    return false;
  }

  async send(url: string, body: any) {
    try {
      const response = await this.tool.post(url, body, this.options);
      return response.data;
    } catch (error: any) {
      const resendability = this.isResent(error);

      if (!resendability) return error;

      await this.delay(60000);
      await this.send(url, body);
    }
  }

  async ping(url: string) {
    const status = await axios
      .post(url)
      .then((response) => response.status)
      .catch((error) => error.response.status);

    if (status === 400) return;

    throw new CustomError("Fetch", `Failed to ping ${url}`, 500);
  }

  private delay(time: number) {
    return new Promise((resolve) => setTimeout(resolve, time));
  }
}
