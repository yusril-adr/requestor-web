import ApiError from "@/common/errors/api-error";

export class RequestorAPINotFoundError extends ApiError {
  constructor(message: string) {
    super(message);
    this.name = "RequestorAPINotFoundError";
  }
}

export default RequestorAPINotFoundError;
