import { PipeTransform, Injectable, ArgumentMetadata } from '@nestjs/common';
import { plainToClass } from 'class-transformer';
import { validate } from 'class-validator';
import { BadRequestError } from '@libs/exceptions';

@Injectable()
export class ExceptionPipe implements PipeTransform {
  async transform(value: any, metadata: ArgumentMetadata) {
    const data = plainToClass(metadata.metatype, value);
    const errors = await validate(data);

    if (errors.length) {
      const details = [];

      errors.forEach(({ property, constraints }) => {
        Object.keys(constraints).forEach((key) => {
          details.push({
            field: property,
            message: constraints[key].replace(property, '').trim(),
          });
        });
      });

      throw new BadRequestError(details);
    }

    return data;
  }
}
