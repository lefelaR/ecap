export class ReferenceNumberGenerator {
  static async next(getMaxSequence: () => Promise<number>): Promise<string> {
    const year = new Date().getFullYear();
    const max = await getMaxSequence();
    return `ECAP-${year}-${String(max + 1).padStart(5, '0')}`;
  }
}
