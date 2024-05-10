import lodash from "lodash";

export class ArrayHelpers {
  private tool = lodash;

  getDifference<A, B>(array: A[], values: B[], condition: keyof B) {
    return this.tool.differenceBy(array, values, condition);
  }

  getIntersectionWithMerge<A extends B, B>(array: A[], values: B[], condition: keyof B): A[] {
    const result: A[] = [];

    for (const item of array) {
      for (const value of values) {
        if (item[condition] !== value[condition]) continue;

        result.push({ ...item, ...value });
      }
    }

    return result;
  }

  flatMap<T, R>(key: string, ...items: T[]): R[] {
    return this.tool.flatMap(items, key);
  }

  flatten<T>(arr: T[] | T[][]): T[] {
    return this.tool.flattenDeep(arr);
  }
}
