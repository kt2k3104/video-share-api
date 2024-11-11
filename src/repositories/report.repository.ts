import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Report } from 'src/entities/report.entity';

@Injectable()
export class ReportRepository extends Repository<Report> {
  constructor(
    @InjectRepository(Report)
    private reportRepository: Repository<Report>,
  ) {
    super(
      reportRepository.target,
      reportRepository.manager,
      reportRepository.queryRunner,
    );
  }
}
