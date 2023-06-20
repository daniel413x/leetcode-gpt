export const removeEscape = (string: string) => string.replace(/\n/g, '');

export const rParse = (s: string) => {
  if (typeof s !== 'string') {
    return s;
  }
  const a = JSON.parse(s);
  if (typeof a !== 'string') {
    return a;
  }
  rParse(a);
};

export const errorCatch = (error: any): string => {
  if (error.response && error.response.data) {
    if (typeof error.response.data.message === 'object') {
      return error.response.data.message[0];
    }
    return error.response.data.message;
  }
  return error.message;
};

export function getMaxPage(dbCount: number, itemsPerPage: number) {
  return Math.ceil(dbCount / itemsPerPage);
}
