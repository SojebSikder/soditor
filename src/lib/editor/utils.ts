export class Utils {
  /**
   * Generate unique id
   * @param prefix
   * @returns
   */
  static generateId(prefix = "soditor"): string {
    if (typeof crypto !== "undefined" && crypto.randomUUID) {
      return `${prefix}-${crypto.randomUUID()}`;
    }
    return `${prefix}-${Date.now().toString(36)}-${Math.random()
      .toString(36)
      .substring(2, 10)}`;
  }

  static debounce<T extends (...args: any[]) => void>(func: T, delay: number): T {
    let timeoutId: number | null = null;
    return function (this: any, ...args: any[]) {
      if (timeoutId !== null) {
        clearTimeout(timeoutId);
      }
      timeoutId = window.setTimeout(() => func.apply(this, args), delay);
    } as T;
  }
}
