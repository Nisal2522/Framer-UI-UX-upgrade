import { Component } from '@angular/core';
import { NationalDashboardPageComponent } from '@/app/module/admin/national-dashboard-page/national-dashboard-page.component';

@Component({
  selector: 'app-provincial-dashboard-page',
  standalone: true,
  imports: [NationalDashboardPageComponent],
  templateUrl: './provincial-dashboard-page.component.html',
  styleUrl: './provincial-dashboard-page.component.scss',
})
export class ProvincialDashboardPageComponent {}
