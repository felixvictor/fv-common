// src/sort.ts
var sortBy = (propertyNames) => (a, b) => {
  for (const property of propertyNames) {
    const propertyString = String(property);
    const desc = propertyString.startsWith("-");
    const key = desc ? propertyString.slice(1) : propertyString;
    const valueA = a[key];
    const valueB = b[key];
    if (valueA === valueB) {
      continue;
    }
    if (valueA == void 0) {
      return desc ? -1 : 1;
    }
    if (valueB == void 0) {
      return desc ? 1 : -1;
    }
    const typeA = typeof valueA;
    const typeB = typeof valueB;
    let result = 0;
    if (typeA === typeB) {
      switch (typeA) {
        case "number": {
          result = simpleNumberSort(valueA, valueB);
          break;
        }
        case "boolean": {
          result = valueA ? 1 : -1;
          break;
        }
        case "string": {
          result = simpleStringSort(valueA, valueB);
          break;
        }
      }
    } else {
      const numberA = Number(valueA);
      const numberB = Number(valueB);
      result = !Number.isNaN(numberA) && !Number.isNaN(numberB) ? simpleNumberSort(numberA, numberB) : simpleStringSort(String(valueA), String(valueB));
    }
    if (result !== 0) {
      return desc ? -result : result;
    }
  }
  return 0;
};
var simpleNumberSort = (a, b) => {
  if (a == void 0 && b == void 0) {
    return 0;
  }
  if (a == void 0) {
    return 1;
  }
  if (b == void 0) {
    return -1;
  }
  return a - b;
};
var simpleStringSort = (a, b) => {
  if (a == void 0 && b == void 0) {
    return 0;
  }
  if (a == void 0) {
    return 1;
  }
  if (b == void 0) {
    return -1;
  }
  return a.localeCompare(b, void 0, { numeric: true, sensitivity: "base" });
};
export {
  simpleNumberSort,
  simpleStringSort,
  sortBy
};
