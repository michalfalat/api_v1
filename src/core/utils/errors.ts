export class GeneralError extends Error {
  constructor(message) {
    super();
    this.message = message;
  }

  getCode(): number {
    if (this instanceof BadRequest) {
      return 400;
    }
    if (this instanceof NotAuthorized) {
      return 401;
    }
    if (this instanceof AccessForbidden) {
      return 403;
    }
    if (this instanceof NotFound) {
      return 404;
    }
    return 500;
  }
}

export class BadRequest extends GeneralError {}
export class NotFound extends GeneralError {}
export class NotAuthorized extends GeneralError {}
export class AccessForbidden extends GeneralError {}
