export const isDev = process.env.NODE_ENV === 'development';
export function capitalizeFirst(input: string) {
  return input.charAt(0).toUpperCase() + input.slice(1);
}

export function addressShorten(address: string | undefined) {
  if (address) {
    const REGEX_ADDRESSIFY = /^(0x[a-zA-Z0-9]{3})[a-zA-Z0-9]+([a-zA-Z0-9]{4})$/;
    const match = address.match(REGEX_ADDRESSIFY);
    if (!match) return address;
    return `${match[1]}…${match[2]}`;
  } else return undefined;
}

export function arrayStringParse(string: string): number[] {
  let result = [];
  if (string && string.includes('[')) result = JSON.parse(string);
  return result;
}

export function isIdInArray(id: number, array: number[]) {
  try {
    return array.filter((elementId: number) => elementId === id).length > 0;
  } catch (error) {
    return false;
  }
}
