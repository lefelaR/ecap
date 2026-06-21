import { AuthorityRepository } from '../repositories/AuthorityRepository';
import { EmailNotificationRepository } from '../repositories/EmailNotificationRepository';
import { ServiceReportRepository } from '../repositories/ServiceReportRepository';
import { UserSessionRepository } from '../repositories/UserSessionRepository';
import { AuthService } from '../services/AuthService';
import { AuthorityService } from '../services/AuthorityService';
import { CognitoService } from '../services/CognitoService';
import { EmailNotificationService } from '../services/EmailNotificationService';
import { ReportService } from '../services/ReportService';
import { StatisticsService } from '../services/StatisticsService';

export class ServiceContainer {
  private static instance: ServiceContainer | null = null;

  readonly reportRepository = ServiceReportRepository.getInstance();
  readonly authorityRepository = AuthorityRepository.getInstance();
  readonly emailRepository = EmailNotificationRepository.getInstance();
  readonly sessionRepository = UserSessionRepository.getInstance();

  readonly emailService = new EmailNotificationService(this.emailRepository);
  readonly reportService = new ReportService(this.reportRepository, this.emailService);
  readonly authorityService = new AuthorityService(this.authorityRepository);
  readonly authService = new AuthService(this.authorityRepository, this.sessionRepository);
  readonly cognitoService = new CognitoService();
  readonly statisticsService = new StatisticsService(this.reportRepository);

  static getInstance(): ServiceContainer {
    if (!this.instance) {
      this.instance = new ServiceContainer();
    }
    return this.instance;
  }
}
