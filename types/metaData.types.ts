export type ImageSize = {
  width: number;
  dpi: number;
  height: number;
};

export type ColorInfo = {
  schema: string;
  bits: number;
};

export type MetaData = {
  preview: {
    size: ImageSize;
    downloadLink: string;
    mime: string;
  };
  thumbnail: {
    size: ImageSize;
    downloadLink: string;
    mime: string;
  };
  size: ImageSize;
  color: ColorInfo;
  downloadLink: string;
  mime: string;
  name: string;
  id: number;
  media: string;
  uuid: string;
};
