import { DataItem } from "@wix/data/build/cjs/src/data-v2-data-item.universal";

export class QueryCollectionOptions {
  public dataCollectionId: string;
  public consistentRead: boolean;

  constructor(collectionId: string, consistentRead: boolean = true) {
    this.dataCollectionId = collectionId;
    this.consistentRead = consistentRead;
  }
}

export class InsertAndUpdateCollectionOptions {
  public dataCollectionId: string;
  public dataItems: DataItem[];
  public returnEntity: boolean;

  constructor(collectionId: string, dataItems: DataItem[], returnEntity: boolean = true) {
    this.dataCollectionId = collectionId;
    this.dataItems = dataItems;
    this.returnEntity = returnEntity;
  }
}

export class RemoveCollectionOptions {
  public dataCollectionId: string;
  public dataItemIds: string[];
  public returnEntity: boolean;

  constructor(collectionId: string, dataItemIds: string[], returnEntity: boolean = true) {
    this.dataCollectionId = collectionId;
    this.dataItemIds = dataItemIds;
    this.returnEntity = returnEntity;
  }
}
