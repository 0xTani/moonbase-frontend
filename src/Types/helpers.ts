export const isDev = process.env.NODE_ENV === 'development';
export function capitalizeFirst(input: string) {
  return input.charAt(0).toUpperCase() + input.slice(1);
}
