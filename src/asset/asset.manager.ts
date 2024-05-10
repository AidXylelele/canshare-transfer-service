import { FileTool } from "./tools/file.tool";
import { ParserTool } from "./tools/parser.tool";
import { ArrayHelpers } from "../helpers/array.helpers";
import { ValidatorTool } from "./tools/validator.tool";
import { CollectionTool } from "./tools/collection.tool";
import { Failure, RawAsset } from "../types/external/asset.types";

export class AssetManager {
  private fileTool: FileTool;
  private parserTool: ParserTool;
  private arrayHelpers: ArrayHelpers;
  private validatorTool: ValidatorTool;
  private collectionTool: CollectionTool;

  constructor() {
    this.fileTool = new FileTool();
    this.parserTool = new ParserTool();
    this.arrayHelpers = new ArrayHelpers();
    this.validatorTool = new ValidatorTool();
    this.collectionTool = new CollectionTool();
  }

  private handle(...results: any[]): Failure[] {
    const key = "failed";
    return this.arrayHelpers.flatMap(key, ...results);
  }

  async upload(user_id: string, rawAssets: RawAsset[]) {
    const validated = this.validatorTool.validate(rawAssets);
    const parsed = this.parserTool.parse(validated.result);
    const checked = await this.collectionTool.checkAssetsInCollection(user_id, parsed);
    const { nonExsiting } = checked;

    if (!nonExsiting.length) return this.handle(validated);

    const files = await this.fileTool.upload(user_id, nonExsiting);
    const records = await this.collectionTool.upload(user_id, files.result);
    return this.handle(files, records, validated);
  }

  async update(user_id: string, rawAssets: RawAsset[]) {
    const validated = this.validatorTool.validate(rawAssets);
    const parsed = this.parserTool.parse(validated.result);
    const checked = await this.collectionTool.checkAssetsInCollection(user_id, parsed);
    const { existing, nonExsiting } = checked;

    if (nonExsiting.length) await this.upload(user_id, rawAssets);

    if (!existing.length) return this.handle(validated);

    const files = await this.fileTool.update(user_id, existing);
    const records = await this.collectionTool.update(user_id, files.result);
    return this.handle(files, records, validated);
  }

  async delete(user_id: string, rawAssets: RawAsset[]) {
    const parsed = this.parserTool.parse(rawAssets);
    const checked = await this.collectionTool.checkAssetsInCollection(user_id, parsed);
    const { existing } = checked;

    if (!existing.length) return [];

    const files = await this.fileTool.delete(user_id, existing);
    const records = await this.collectionTool.delete(user_id, existing);
    return this.handle(records, files);
  }

  async error(user_id: string, failures: (Failure | Error)[]): Promise<Failure[]> {
    const records = await this.collectionTool.error(user_id, failures);
    return this.handle(records);
  }
}
