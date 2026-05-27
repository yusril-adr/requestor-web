import ApiError from "./base";

class NotFoundError extends ApiError {
  constructor(message: string) {
    super(message);
    this.name = "NotFoundError";
  }
}

export default NotFoundError;
