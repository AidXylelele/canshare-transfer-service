export type FlattenObject = {
  [key: string]: ObjectFieldValue;
};

export type ObjectFieldValue = string | number | boolean;

export type NestedObject = {
  [key: string]: ObjectFieldValue | NestedObject;
};
