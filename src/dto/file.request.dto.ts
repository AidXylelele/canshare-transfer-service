import { UrlHeaders } from "../types/external/asset.types";

export class FileRequest {
  public displayName: string;
  public mimeType: string;
  public urlHeaders: UrlHeaders;
  public url: string;

  constructor(filename: string, dataType: string, link: string, headers = {}) {
    this.displayName = filename;
    this.mimeType = dataType;
    this.urlHeaders = headers;
    this.url = link;
  }
}
