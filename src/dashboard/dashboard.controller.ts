import { Controller, Get, Post } from '@nestjs/common';
import { DashboardService } from './dashboard.service';

@Controller('dashboard')
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Get()
  async getDashboardStats() {
    return await this.dashboardService.getDashboardStats();
  }

  @Post()
  async createDashboardStats() {
    return await this.dashboardService.createDashboardStats();
  }
}
