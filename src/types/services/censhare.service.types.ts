export type Entity = {
  name: string;
  link: string;
};

export type EntityPage = {
  result: any[];
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

export type ListOfEntities = {
  [key: string]: Entity;
};

export type FilterCondition = (asset: any) => boolean;

export type UpdateCenshareData = {
  [key: string]: string;
};
