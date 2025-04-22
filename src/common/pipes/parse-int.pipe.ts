import { ArgumentMetadata, PipeTransform, BadRequestException, Injectable } from '@nestjs/common';

@Injectable()
export class ParseIntPipe implements PipeTransform<string, number> {
  transform(value: string, _metadata: ArgumentMetadata): number {
    const val = Number.parseInt(value, 10);

    if (Number.isNaN(val)) {
      throw new BadRequestException('id validation failed');
    }

    return val;
  }
}
