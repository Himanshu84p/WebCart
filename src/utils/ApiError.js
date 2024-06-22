//api error class for reusability of code
class ApiError {
    constructor(statusCode, message = "Api Error occured whith custom class") {
      this.statusCode = statusCode;
      this.message = message;
      this.success = false;
      this.data = null;
    }
  }
  
  export { ApiError };