export class ApiResponse {
  constructor({
    result = true,
    message = 'Success',
    path = '',
    takenTime = 0,
  }) {
    this.result = result;
    this.message = message;
    this.path = path;
    this.date = new Date().toISOString();
    this.takenTime = takenTime;
  }
}
