export function isEmptyOrUndefined(object: Record<string, any>) {
  return (
    typeof object === 'undefined' ||
    (Object.keys(object).length === 0 && typeof object === 'object')
  );
}
