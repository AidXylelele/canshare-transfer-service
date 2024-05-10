import lodash from "lodash";
import { FlattenObject, NestedObject } from "../types/external/messages/parser.message.types";

export class ObjectHelpers {
  private tool = lodash;

  getKey<T extends object, R>(obj: T, path: string): R | null {
    return this.tool.get(obj, path, null);
  }

  flatten<T extends NestedObject>(obj: T, parentKey: string = ""): FlattenObject {
    let result: FlattenObject = {};

    for (const key in obj) {
      const value = obj[key];

      if (!Object.hasOwn(obj, key)) continue;

      const newKey = parentKey ? `${parentKey}.${key}` : key;

      if (typeof value !== "object" && value !== null) {
        result[newKey] = value;
        continue;
      }

      const nested = this.flatten(value as NestedObject, newKey);
      result = { ...result, ...nested };
    }

    return result;
  }

  omitFields<T extends object>(obj: T, fields: (keyof T)[]): Omit<T, keyof T> {
    return this.tool.omit(obj, fields);
  }
}
