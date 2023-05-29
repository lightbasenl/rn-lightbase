export type DeepPartial<T> = {
  [P in keyof T]?: DeepPartial<T[P]>;
};

export function mergeDeepRight<T>(target: T, ...sources: DeepPartial<T>[]): T {
  if (!sources.length) {
    return target;
  }

  const source = sources.shift();

  if (source && typeof source === "object") {
    for (const key in source) {
      if (Object.prototype.hasOwnProperty.call(source, key)) {
        const sourceValue = source[key];
        const targetValue = target[key];

        if (
          sourceValue &&
          typeof sourceValue === "object" &&
          targetValue &&
          typeof targetValue === "object"
        ) {
          target[key] = mergeDeepRight(targetValue, sourceValue);
        } else if (sourceValue !== undefined) {
          target[key] = sourceValue as T[Extract<keyof T, string>];
        }
      }
    }
  }

  return mergeDeepRight(target, ...sources);
}

export function mergeDeepLeft<T>(target: T, ...sources: DeepPartial<T>[]): T {
  if (!sources.length) {
    return target;
  }

  const source = sources.shift();

  if (source && typeof source === "object") {
    for (const key in source) {
      if (Object.prototype.hasOwnProperty.call(source, key)) {
        const sourceValue = source[key];
        const targetValue = target[key];

        if (
          sourceValue &&
          typeof sourceValue === "object" &&
          targetValue &&
          typeof targetValue === "object"
        ) {
          target[key] = mergeDeepLeft(sourceValue as any, targetValue);
        } else if (sourceValue !== undefined) {
          target[key] = sourceValue as T[Extract<keyof T, string>];
        }
      }
    }
  }

  return mergeDeepLeft(target, ...sources);
}
