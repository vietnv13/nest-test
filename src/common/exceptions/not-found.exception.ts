import { NotFoundException } from '@nestjs/common';
import { sample } from 'lodash';

export const NotFoundMessage = ['404, Not Found'];

export class LocationFoundException extends NotFoundException {
  constructor() {
    super(sample(NotFoundMessage));
  }
}
