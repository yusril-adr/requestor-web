import BadRequestError from "@/common/errors/api-error/bad-request";
import InternalServerError from "@/common/errors/api-error/internal-server";
import NotFoundError from "@/common/errors/api-error/not-found";
import UnauthorizedError from "@/common/errors/api-error/unauthorized";

export default function throwAPIError(code: number, message: string) {
  switch (code) {
    case 400:
      throw new BadRequestError(message);
    case 401:
      throw new UnauthorizedError(message);
    case 404:
      throw new NotFoundError(message);
    case 500:
      throw new InternalServerError(message);
    default:
      // throw default error to show its not api error
      throw new Error(message);
  }
}
