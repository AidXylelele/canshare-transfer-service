import { FilterTool } from "../asset/tools/filter.tool";
import { DownloadTool } from "../asset/tools/download.tool";
import { QueueService } from "./queue.service";
import { CenshareService } from "./censhare.service";
import { CenshareNotification, RawAsset } from "../types/external/asset.types";

export class MessageService {
  private downloadTool: DownloadTool;
  private filterTool: FilterTool;
  private censhareService: CenshareService;
  private queueService: QueueService;

  constructor() {
    this.downloadTool = new DownloadTool();
    this.filterTool = new FilterTool();
    this.censhareService = new CenshareService();
    this.queueService = new QueueService();
  }

  async synchronization(user_id: string) {
    const censhareAuth = await this.censhareService.getByUserId(user_id);
    const rawAssets = await this.downloadTool.getAllCenshareAssets(censhareAuth);
    const grouped = this.filterTool.groupAssetsBySize(rawAssets);
    await this.queueService.upload<RawAsset[]>(user_id, grouped);
  }

  async notificationAboutChanges(user_id: string, data: CenshareNotification) {
    console.log("Message Service", {user_id, notification: data});
    const { ids, subscription } = data;
    const { key } = subscription;
    const censhareAuth = await this.censhareService.getByUserId(user_id);
    const rawAssets = await this.downloadTool.getChangedCenshareAssets(censhareAuth, key, ids);
    const separated = this.filterTool.filterAssetsByChangeEvents(rawAssets);
    const { deleting, updating } = separated;
    const updatingGrouped = this.filterTool.groupAssetsBySize(updating);
    const deletingGrouped = this.filterTool.groupAssetsBySize(deleting);
    await this.queueService.update<RawAsset[]>(user_id, updatingGrouped);
    await this.queueService.delete<RawAsset[]>(user_id, deletingGrouped);
  }
}
