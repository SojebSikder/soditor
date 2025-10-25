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
}
