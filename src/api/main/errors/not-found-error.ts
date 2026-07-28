import ApiError from "@/common/errors/api-error";

export class MainAPINotFoundError extends ApiError {
  constructor(message: string) {
    super(message);
    this.name = "MainAPINotFoundError";
  }
}

export default MainAPINotFoundError;
