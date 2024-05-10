import { TokenTool } from "../../tools/token.tool";
import { ClientTool } from "./client.tool";
import { FileRequest } from "../../dto/file.request.dto";
import { OperationResult } from "../../dto/operationResult.dto";
import { CenshareService } from "../../services/censhare.service";
import { Asset, AssetRecord, FileOperation, UrlHeaders } from "../../types/external/asset.types";

export class FileTool extends ClientTool {
  private tokenTool: TokenTool;
  private censhareService: CenshareService;

  constructor() {
    super();
    this.tokenTool = new TokenTool();
    this.censhareService = new CenshareService();
  }

  private async setFileRequestHeaders(user_id: string): Promise<UrlHeaders> {
    const authData = await this.censhareService.getByUserId(user_id);
    const { username, password } = authData;
    const token = this.tokenTool.getBasicToken(username, password);
    return { Authorization: token };
  }

  private async createFileRequests(
    user_id: string,
    assets: (Asset | AssetRecord)[],
  ): Promise<FileRequest[]> {
    const result = [];
    const headers = await this.setFileRequestHeaders(user_id);

    for (const asset of assets) {
      const { filename, dataType, link } = asset;
      const options = new FileRequest(filename, dataType, link, headers);
      result.push(options);
    }

    return result;
  }

  private processError<T>(assets: T[], result: OperationResult<T>) {
    const message = "Unexpected Error";

    for (const asset of assets) {
      result.fail(asset, message);
    }

    return result;
  }

  private async handle<T extends Asset>(
    method: string,
    operation: FileOperation,
    assets: T[] = [],
  ) {
    const action = `File ${method} operation`;
    const operationResult = new OperationResult<T>(action);

    try {
      const response = await operation;

      if (!response || !response.results) return operationResult;

      for (const { item, itemMetadata } of response.results) {
        const { success, error, originalIndex } = itemMetadata;
        const asset = assets[originalIndex];

        if (!item && error) operationResult.fail(asset, error.description);

        if (item && success) {
          const { _id, url } = item;
          operationResult.success({ ...asset, fileId: _id, link: url });
        }
      }

      return operationResult;
    } catch (error) {
      return this.processError(assets, operationResult);
    }
  }

  async upload<T extends Asset>(user_id: string, assets: T[]) {
    const fileRequests = await this.createFileRequests(user_id, assets);
    const client = await this.getClient(user_id);
    const operation = client.files.bulkImportFile(fileRequests);
    const result = await this.handle("upload", operation, assets);
    return result;
  }

  async update(user_id: string, assets: AssetRecord[]) {
    await this.delete(user_id, assets);
    const result = await this.upload(user_id, assets);
    return result;
  }

  async delete(user_id: string, assets: AssetRecord[]) {
    const fileIds = assets.map((item) => item.fileId);
    const client = await this.getClient(user_id);
    const operation = client.files.bulkDeleteFiles(fileIds);
    const result = await this.handle("delete", operation);
    return result;
  }
}
