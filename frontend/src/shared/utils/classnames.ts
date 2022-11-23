export const classnames = (
  str: string | Array<string | null | boolean | undefined>
): string => {
  if (typeof str === "string") {
    return str;
  }

  return str.reduce(
    (res: string, className: string | null | undefined | boolean) =>
      className === null ||
      className === undefined ||
      className === "" ||
      typeof className === "boolean"
        ? res
        : res + className + " ",
    ""
  );
};
