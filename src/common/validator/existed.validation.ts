import {
  registerDecorator,
  ValidationOptions,
  ValidationArguments,
} from 'class-validator';
import { getRepository } from 'typeorm';

export function IsExisted(
  table: string,
  column: string,
  validationOptions?: ValidationOptions,
) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'IsExisted',
      target: object.constructor,
      propertyName: propertyName,
      constraints: [table, column],
      options: validationOptions,
      validator: {
        async validate(value: any, args: ValidationArguments) {
          const [table, column] = args.constraints;
          const repository = getRepository(table);
          const result = await repository.findOne({
            where: { [column]: value },
          });
          return result !== null; // Trả về true nếu giá trị tồn tại, false nếu không
        },
        defaultMessage(args: ValidationArguments) {
          return `${args.property} does not exist in ${args.constraints[0]}`;
        },
      },
    });
  };
}
