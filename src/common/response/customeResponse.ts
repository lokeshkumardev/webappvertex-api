export class CustomResponse<T> {
  status: string;
  message: string;
  data?: T;

  constructor(status: string, message: string, data?: T) {
    this.status = status;
    this.message = message;
    this.data = data;
  }

  static success<T>(message: string, data?: T): CustomResponse<T> {
    return new CustomResponse('success', message, data);
  }

  static error<T>(message: string, data?: T): CustomResponse<T> {
    return new CustomResponse('error', message, data);
  }
}
