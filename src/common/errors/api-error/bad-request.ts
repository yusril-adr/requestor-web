import ApiError from "./base";

export default class BadRequestError extends ApiError {
  constructor(message: string) {
    super(message);
    this.name = "BadRequestError";
  }
}
