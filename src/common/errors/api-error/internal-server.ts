import ApiError from "./base";

export default class InternalServerError extends ApiError {
  constructor(message: string) {
    super(message);
    this.name = "InternalServerError";
  }
}
