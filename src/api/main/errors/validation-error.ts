import ApiError from "@/common/errors/api-error";

export class MainAPIValidationError<T = unknown> extends ApiError {
  constructor(
    public errors: {
      property: keyof T | string;
      messages: string[];
    }[],
  ) {
    super("Validation error");
    this.name = "MainAPIValidationError";
  }
}

export default MainAPIValidationError;
