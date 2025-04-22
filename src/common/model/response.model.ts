import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

import { RESPONSE_SUCCESS_CODE, RESPONSE_SUCCESS_MSG } from '~/common/constants/response.constant';

export class Response<T> {
  @ApiPropertyOptional()
  data?: T;

  @ApiProperty({ type: 'number', default: RESPONSE_SUCCESS_CODE })
  code: number;

  @ApiProperty({ type: 'string', default: RESPONSE_SUCCESS_MSG })
  message: string;

  constructor(code: number, data: T, message = RESPONSE_SUCCESS_MSG) {
    this.code = code;
    this.data = data;
    this.message = message;
  }

  static success<T>(data?: T, message?: string) {
    return new Response(RESPONSE_SUCCESS_CODE, data, message);
  }

  static error(code: number, message: string) {
    return new Response(code, {}, message);
  }
}
