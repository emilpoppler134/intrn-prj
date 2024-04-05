export function dynamicClassNames(...classes: Array<string>): string {
  return classes.filter(Boolean).join(" ");
}
