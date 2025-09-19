export class ApiResponseListDto {
  constructor({
    result = true,
    data = null,
    message = 'Success',
    path = '',
    takenTime = 0,
  }) {
    this.result = result;
    this.data = data;
    this.message = message;
    this.path = path;
    this.date = new Date().toISOString();
    this.takenTime = takenTime; // ms
  }
}
