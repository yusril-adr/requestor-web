import ApiError from "@/common/errors/api-error";

export class RequestorAPIValidationError<T = {}> extends ApiError {
  constructor(
    public errors: {
      property: keyof T | string;
      messages: string[];
    }[],
  ) {
    super("Validation error");
    this.name = "RequestorAPIValidationError";
  }
}

export default RequestorAPIValidationError;
