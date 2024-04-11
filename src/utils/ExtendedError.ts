export class ExtendedError extends Error {
  closeable: boolean;

  constructor(message: string, closeable: boolean = false) {
    super(message);
    this.closeable = closeable;
  }
}
