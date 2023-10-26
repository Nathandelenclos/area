import { Controller } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Ctx, MessagePattern, RmqContext } from '@nestjs/microservices';
import {
  MicroServiceController,
  MicroServiceHttpCodeProps,
  HttpCode,
  MicroServiceResponse,
  ValidationError,
  AlreadyExistError,
  UnauthorizeError,
} from '@app/common';

@Controller()
export class AuthController extends MicroServiceController {
  constructor(private readonly authService: AuthService) {
    super();
  }

  @MessagePattern({ cmd: 'register' })
  async register(@Ctx() context: RmqContext) {
    let props: MicroServiceHttpCodeProps = {
      code: HttpCode.OK,
      message: 'OK',
    };
    try {
      props.data = await this.authService.register(this.ack(context));
    } catch (error) {
      if (error instanceof ValidationError) {
        props = {
          code: HttpCode.BAD_REQUEST,
          message: error.message,
        };
      } else if (error instanceof AlreadyExistError) {
        props = {
          code: HttpCode.CONFLICT,
          message: error.message,
        };
      } else {
        props = {
          code: HttpCode.INTERNAL_SERVER_ERROR,
          message: 'Internal server error',
        };
      }
    }
    return new MicroServiceResponse(props);
  }

  @MessagePattern({ cmd: 'signing' })
  async signIn(@Ctx() context: RmqContext) {
    let props: MicroServiceHttpCodeProps = {
      code: HttpCode.OK,
      message: 'OK',
    };
    try {
      props.data = await this.authService.signIn(this.ack(context));
    } catch (error) {
      if (error instanceof ValidationError) {
        props = {
          code: HttpCode.BAD_REQUEST,
          message: error.message,
        };
      } else if (error instanceof UnauthorizeError) {
        props = {
          code: HttpCode.UNAUTHORIZED,
          message: error.message,
        };
      } else {
        props = {
          code: HttpCode.INTERNAL_SERVER_ERROR,
          message: 'Internal server error',
        };
      }
    }
    return new MicroServiceResponse(props);
  }

  @MessagePattern({ cmd: 'signoauth' })
  async signOAuth(@Ctx() context: RmqContext) {
    let props: MicroServiceHttpCodeProps = {
      code: HttpCode.OK,
      message: 'OK',
    };
    try {
      props.data = await this.authService.signOAuth(this.ack(context));
    } catch (error) {
      console.error(`[ERROR] ${error}`);
      if (error instanceof ValidationError) {
        props = {
          code: HttpCode.BAD_REQUEST,
          message: error.message,
        };
      } else if (error instanceof UnauthorizeError) {
        props = {
          code: HttpCode.UNAUTHORIZED,
          message: error.message,
        };
      } else {
        props = {
          code: HttpCode.INTERNAL_SERVER_ERROR,
          message: 'Internal server error',
        };
      }
    }
    return new MicroServiceResponse(props);
  }

  @MessagePattern({ cmd: 'me' })
  async me(@Ctx() context: RmqContext) {
    let props: MicroServiceHttpCodeProps = {
      code: HttpCode.OK,
      message: 'OK',
    };
    try {
      props.data = await this.authService.me(this.ack(context));
    } catch (error) {
      console.error(`[ERROR] ${error}`);
      props = {
        code: HttpCode.INTERNAL_SERVER_ERROR,
        message: 'Internal server error',
      };
    }
    return new MicroServiceResponse(props);
  }

  @MessagePattern({ cmd: 'recover-password' })
  async recoverPassword() {
    let props: MicroServiceHttpCodeProps = {
      code: HttpCode.OK,
      message: 'OK',
    };
    try {
      props.data = await this.authService.recoverPassword();
    } catch (error) {
      console.error(`[ERROR] ${error}`);
      props = {
        code: HttpCode.INTERNAL_SERVER_ERROR,
        message: 'Internal server error',
      };
    }
    return new MicroServiceResponse(props);
  }

  @MessagePattern({ cmd: 'reset-password' })
  async resetPassword(@Ctx() context: RmqContext) {
    let props: MicroServiceHttpCodeProps = {
      code: HttpCode.OK,
      message: 'OK',
    };
    try {
      props.data = await this.authService.resetPassword(this.ack(context));
    } catch (error) {
      console.error(`[ERROR] ${error}`);
      props = {
        code: HttpCode.INTERNAL_SERVER_ERROR,
        message: 'Internal server error',
      };
    }
    return new MicroServiceResponse(props);
  }

  @MessagePattern({ cmd: 'connect-oauth' })
  async connectOAuth(@Ctx() context: RmqContext) {
    let props: MicroServiceHttpCodeProps = {
      code: HttpCode.OK,
      message: 'OK',
    };
    try {
      props.data = await this.authService.connectOAuth(this.ack(context));
    } catch (error) {
      console.error(`[ERROR] ${error}`);
      if (error instanceof ValidationError) {
        props = {
          code: HttpCode.BAD_REQUEST,
          message: error.message,
        };
      } else {
        props = {
          code: HttpCode.INTERNAL_SERVER_ERROR,
          message: 'Internal server error',
        };
      }
    }
    return new MicroServiceResponse(props);
  }
}
