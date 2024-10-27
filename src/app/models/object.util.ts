import { Injectable } from "@angular/core";

@Injectable({
  providedIn: "root"
})
export class ObjectUtil {
  public static readonly Instance = new ObjectUtil();

  public isNullOrUndefined(value: any): boolean {
    return value === null || typeof value === "undefined";
  }

  /**
   * Does a deep comparison to see if two objects are equivalent, excluding methods.
   * @param value1 First compare value.
   * @param value2 Second compare value.
   */
  public areEqualDeep(value1: any, value2: any): boolean {
    const hasValue1 = !this.isNullOrUndefined(value1);
    const hasValue2 = !this.isNullOrUndefined(value2);
    return (
      hasValue1 &&
      hasValue2 &&
      JSON.stringify(value1) === JSON.stringify(value2)
    );
  }

  public isObject(value: any): boolean {
    return value !== null && typeof value === "object";
  }

  public isNumeric(value: any): boolean {
    return !isNaN(parseFloat(value)) && isFinite(value);
  }

  public isString(value: any): boolean {
    return typeof value === "string";
  }

  public isDate(value: any): boolean {
    return value instanceof Date;
  }

  public deepAssign(modify: any, ...changeList: any[]): any {
    changeList.forEach(changes => {
      if (changes instanceof Object && modify instanceof Object) {
        Object.keys(changes)
          .sort()
          .forEach(name => {
            const entry = changes[name];
            if (entry instanceof Array) {
              if (modify[name] instanceof Array) {
                modify[name].splice(0, modify[name].length);
              } else {
                modify[name] = [];
              }
              this.deepAssign(modify[name], entry);
            } else if (
              entry instanceof Object &&
              entry instanceof Date === false
            ) {
              if (!modify[name]) {
                modify[name] = this.newOf(entry);
              }
              this.deepAssign(modify[name], entry);
            } else {
              modify[name] = entry;
            }
          });
      }
    });

    return modify;
  }

  public newOf<T>(value: T): T {
    return value
      ? ((value instanceof Array
          ? []
          : Object.create(Object.getPrototypeOf(value))) as T)
      : value;
  }

  public getNestedValue(obj: any, path: string, separator = "."): any {
    if (!path || !obj) {
      return undefined;
    }

    try {
      return path
        .replace("[", separator)
        .replace("]", "")
        .split(separator)
        .reduce((currObj, property) => currObj[property], obj);
    } catch (err) {
      return undefined;
    }
  }

  public setNestedValue(
    obj: any,
    value: any,
    path: string,
    separator = "."
  ): void {
    if (!path) {
      return undefined;
    }

    try {
      const pList = path.split(separator);
      const key = pList.pop();
      const pointer = pList.reduce((accumulator, currentValue) => {
        if (accumulator[currentValue] === undefined) {
          accumulator[currentValue] = {};
        }
        return accumulator[currentValue];
      }, obj);
      pointer[key] = value;
      return obj;
    } catch (err) {}
  }

  private getDifferencesRecursive<TInstance extends object>(
    original: TInstance,
    modified: TInstance,
    differences: TInstance
  ): boolean {
    let hasChanges = false;
    if (original && modified) {
      Object.keys(modified).forEach(key => {
        const originalValue = original[key];
        const modifiedValue = modified[key];
        if (
          (originalValue === undefined || originalValue === null) &&
          (modifiedValue === undefined || modifiedValue === null)
        ) {
          return; // continue to the next key
        }

        if (modifiedValue instanceof Date) {
          if (
            !originalValue ||
            modifiedValue.valueOf() !== originalValue.valueOf()
          ) {
            differences[key] = modifiedValue;
            hasChanges = true;
          }
        } else if (this.isObject(modifiedValue)) {
          const childDifferences =
            originalValue instanceof Array || modifiedValue instanceof Array
              ? []
              : {};
          if (
            this.getDifferencesRecursive(
              originalValue || ({} as TInstance),
              modifiedValue,
              childDifferences
            )
          ) {
            differences[key] = childDifferences;
            hasChanges = true;
          }
        } else if (originalValue !== modifiedValue) {
          // Do not show changed when modified value is undefined or both are empty strings or undefined.
          const modifiedType = typeof modifiedValue;
          if (
            modifiedType !== "undefined" &&
            (modifiedType !== "string" ||
              this.hasStringChange(originalValue, modifiedValue))
          ) {
            differences[key] = modifiedValue;
            hasChanges = true;
          }
        }
      });
    }

    return hasChanges;
  }

  private hasStringChange(original: string, modified: string): boolean {
    return (
      (!!original && !!modified) ||
      (!!original && !modified) ||
      (!original && !!modified)
    );
  }
}
