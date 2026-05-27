import ApiError from "./base";

export default class UnauthorizedError extends ApiError {
  constructor(message: string) {
    super(message);
    this.name = "UnauthorizedError";
  }
}
