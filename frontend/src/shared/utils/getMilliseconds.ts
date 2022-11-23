export const getMilliseconds = (dateString: string): number => {
  return +new Date(dateString);
};
