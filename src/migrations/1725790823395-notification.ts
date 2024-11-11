import { NotificationType } from 'src/common/enums/notification.enum';
import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
} from 'typeorm';

export class Notification1725790823395 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'notifications',
        columns: [
          { name: 'id', type: 'serial', isPrimary: true },
          { name: 'user_id', type: 'int', isNullable: false },
          {
            name: 'type',
            type: 'enum',
            enum: Object.values(NotificationType),
            isNullable: false,
          },
          { name: 'related_id', type: 'int', isNullable: true },
          { name: 'actor_id', type: 'int', isNullable: false },
          {
            name: 'created_at',
            type: 'timestamp with time zone',
            default: 'CURRENT_TIMESTAMP',
            isNullable: false,
          },
          // {
          //   name: 'updated_at',
          //   type: 'timestamp with time zone',
          //   default: 'CURRENT_TIMESTAMP',
          //   onUpdate: 'CURRENT_TIMESTAMP',
          //   isNullable: true,
          // },
        ],
      }),
    );
    await queryRunner.createForeignKey(
      'notifications',
      new TableForeignKey({
        columnNames: ['user_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'users',
        onDelete: 'CASCADE',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('notifications');
  }
}
