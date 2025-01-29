export default class CustomError {
  private statusCode: number;
  timestamp = new Date().toISOString();
  public error: any;

  constructor(statusCode: number = 500, message?: string, error?: any) {
    this.statusCode = statusCode; // default to 500 if not passed
    this.error = error;
  }
}
