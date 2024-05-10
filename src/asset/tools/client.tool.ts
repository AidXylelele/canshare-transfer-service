import { items } from "@wix/data";
import { files } from "@wix/media";
import * as Wix from "@wix/sdk";
import { WixService } from "../../services/wix.service";
import { WixClientConfig, WixClientModules } from "../../types/external/asset.types";

export class ClientTool {
  private tool = Wix;
  private modules: WixClientModules = { items, files };
  private client: Wix.WixClient | null;
  public wixService: WixService;

  constructor() {
    this.client = null;
    this.wixService = new WixService();
  }

  private getModules() {
    return this.modules;
  }

  private async getAuth(user_id: string): Promise<Wix.IApiKeyStrategy> {
    const { siteId, apiKey } = await this.wixService.getByUserId(user_id);
    return this.tool.ApiKeyStrategy({ siteId, apiKey });
  }

  private async getConfig(user_id: string): Promise<WixClientConfig> {
    const auth = await this.getAuth(user_id);
    const modules = this.getModules();
    return { auth, modules };
  }

  async getClient(user_id: string) {
    if (!this.client) {
      const config = await this.getConfig(user_id);
      this.client = this.tool.createClient(config);
    }
    return this.client;
  }
}
