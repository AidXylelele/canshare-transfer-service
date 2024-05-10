import {
  DataItem,
  BulkInsertDataItemsResponse,
  BulkRemoveDataItemsResponse,
  BulkUpdateDataItemsResponse,
} from "@wix/data/build/cjs/src/data-v2-data-item.universal";
import * as Wix from "@wix/sdk";
import { items } from "@wix/data";
import { files } from "@wix/media";
import { BulkImportFileResponse } from "@wix/media/build/cjs/src/media-site-media-v1-file-descriptor.universal";

// ASSET METADATA TYPES
export type RawAssetBrand = {
  name?: string;
};

export type RawAssetDate = {
  von?: string;
  bis?: string;
};

export type RawAssetVariantMaster = {
  size: number;
  link: string;
  width: number;
  type: string;
  height: number;
};

export type RawAssetVariant = {
  varints: RawAssetVariantMaster;
};

export type RawAsset = {
  titleIPTC: string;
  kanalExport: boolean;
  dateigroeße: number;
  schlagwoerter: string;
  ALTtext: string;
  land: string;
  gueltigkeit: RawAssetDate;
  masterdata?: RawAssetVariant;
  jpg_300dpi?: RawAssetVariant;
  jpg_300dpi_600x600?: RawAssetVariant;
  schlagwoerterIPTC: string;
  dateityp: string;
  assetId: number;
  veroeffentlichung: RawAssetDate;
  name: string;
  ausgabekanal: string;
  nebenmarke: RawAssetBrand;
  hauptmarke: RawAssetBrand;
  wixDeletion?: boolean;
  toUpdate?: boolean;
};

export type Asset = {
  fileId?: string;
  titleIptc: string;
  channelExport: boolean;
  size: number;
  keywords: string;
  alt: string;
  language: string;
  link: string;
  validFrom: string;
  validTo: string;
  keywordsIptc: string;
  dataType: string;
  assetId: number;
  publishFrom: string;
  publishTo: string;
  filename: string;
  outputChannel: string;
  subBrand: string;
  mainBrand: string;
};

export type AssetRecord = Asset & {
  _id: string;
  _createdDate?: string;
  _updatedDate?: string;
};

export type GroupedAssetsOnCollectionId<T> = {
  [key: string]: T[];
};

export type FilteredAssetsByChangingEvent = {
  deleting: RawAsset[];
  updating: RawAsset[];
};

export type CheckedAssets = {
  existing: AssetRecord[];
  nonExsiting: Asset[];
};

// WIX CLIENT TYPES
export type WixClientModules = {
  items: typeof items;
  files: typeof files;
};

export type WixClientConfig = {
  auth: Wix.IApiKeyStrategy;
  modules: WixClientModules;
};

// WIX SDK REQUEST TYPES

export type DataItemResponse = {
  dataItem: DataItem;
};

export type CollectionMapping = {
  [key: string]: string;
};

// ASSET OPERATION TYPES
export type WixFailure = Failure | Error;

export type CacheOperation = Promise<void>;

export type CollectionOperation = Promise<
  BulkInsertDataItemsResponse | BulkUpdateDataItemsResponse | BulkRemoveDataItemsResponse
>;

export type FileOperation = Promise<BulkImportFileResponse | void>;

export type Failure<T = Asset | RawAsset | AssetRecord> = {
  asset: T;
  message: string;
  action: string;
};

// CENSHARE TYPES
export type CenshareNotification = {
  ids: number[];
  subscription: {
    filter: string;
    name: string;
    url: string;
    key: string;
  };
};

export type CenshareEntity = {
  name: string;
  link: string;
};

export type CenshareEntitiesList = {
  [key: string]: CenshareEntity;
};

export type CenshareEntityPage = {
  result: RawAsset[];
  offset: number;
  limit: number;
  count: number;
  "total-count": number;
  page: {
    current: string;
    last: string;
    first: string;
  };
};

// ASSET COMMON TYPES
export type UrlHeaders = {
  [key: string]: any;
};
