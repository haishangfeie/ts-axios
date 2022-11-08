export default class Cancel {
  constructor(public message?: string) {}
}

export function isCancel(val: unknown): val is Cancel {
  return val instanceof Cancel
}
