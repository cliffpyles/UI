export type FilterFieldType = "string" | "number" | "date" | "enum" | "boolean";

export type FilterOperator =
  | "eq"
  | "neq"
  | "gt"
  | "gte"
  | "lt"
  | "lte"
  | "contains"
  | "starts_with"
  | "ends_with"
  | "in"
  | "not_in"
  | "is_null"
  | "is_not_null"
  | "between"
  | "before"
  | "after"
  | "is_true"
  | "is_false";

export const filterOperatorLabels: Record<FilterOperator, string> = {
  eq: "equals",
  neq: "does not equal",
  gt: "greater than",
  gte: "greater or equal",
  lt: "less than",
  lte: "less or equal",
  contains: "contains",
  starts_with: "starts with",
  ends_with: "ends with",
  in: "in",
  not_in: "not in",
  is_null: "is empty",
  is_not_null: "is not empty",
  between: "between",
  before: "before",
  after: "after",
  is_true: "is true",
  is_false: "is false",
};

export const operatorsByType: Record<FilterFieldType, FilterOperator[]> = {
  string: ["eq", "neq", "contains", "starts_with", "ends_with", "is_null", "is_not_null"],
  number: ["eq", "neq", "gt", "gte", "lt", "lte", "between", "is_null", "is_not_null"],
  date: ["eq", "before", "after", "between", "is_null", "is_not_null"],
  enum: ["eq", "neq", "in", "not_in", "is_null", "is_not_null"],
  boolean: ["is_true", "is_false"],
};
