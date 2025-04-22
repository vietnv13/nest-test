import { Type, applyDecorators, HttpStatus, RequestMethod } from '@nestjs/common';
import { METHOD_METADATA } from '@nestjs/common/constants';
import { ApiExtraModels, ApiResponse, getSchemaPath } from '@nestjs/swagger';

import { Response } from '~/common/model/response.model';

const baseTypeNames = ['String', 'Number', 'Boolean'];

function genBaseProp(type: Type<any>) {
  if (baseTypeNames.includes(type.name)) {
    return { type: type.name.toLocaleLowerCase() };
  } else {
    return { $ref: getSchemaPath(type) };
  }
}

export function ApiResult<TModel extends Type<any>>({
  type,
  isPage,
  status,
}: {
  type?: TModel | TModel[];
  isPage?: boolean;
  status?: HttpStatus;
}) {
  let prop = null;

  if (Array.isArray(type)) {
    if (isPage) {
      prop = {
        type: 'object',
        properties: {
          list: {
            type: 'array',
            items: { $ref: getSchemaPath(type[0]) },
          },
          metadata: {
            type: 'object',
            properties: {
              total: { type: 'number', default: 0 },
            },
          },
        },
      };
    } else {
      prop = {
        type: 'array',
        list: genBaseProp(type[0]),
      };
    }
  } else if (type) {
    prop = genBaseProp(type);
  } else {
    prop = { type: 'null', default: null };
  }

  const model = Array.isArray(type) ? type[0] : type;

  return applyDecorators(
    ApiExtraModels(model),
    (target: object, key: string | symbol, descriptor: TypedPropertyDescriptor<any>) => {
      queueMicrotask(() => {
        const isPost = Reflect.getMetadata(METHOD_METADATA, descriptor.value) === RequestMethod.POST;

        ApiResponse({
          status: status ?? (isPost ? HttpStatus.CREATED : HttpStatus.OK),
          schema: {
            allOf: [
              { $ref: getSchemaPath(Response) },
              {
                properties: {
                  data: prop,
                },
              },
            ],
          },
        })(target, key, descriptor);
      });
    },
  );
}
