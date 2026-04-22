import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

type ReportKey = 'ac-registration' | 'business-plan' | 'asset-inventory' | 'member-demographics';

@Component({
  selector: 'app-reports-page',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './reports-page.component.html',
  styleUrl: './reports-page.component.scss',
})
export class ReportsPageComponent {
  language = 'EN';
  selectedReport: ReportKey = 'ac-registration';

  readonly reports: Array<{ id: ReportKey; title: string }> = [
    { id: 'ac-registration', title: 'AC Registration Summary' },
    { id: 'business-plan', title: 'Business Plan Status' },
    { id: 'asset-inventory', title: 'Asset Inventory' },
    { id: 'member-demographics', title: 'Member Demographics' }
  ];

  readonly acRegistrationData = [
    {
      regNumber: 'AC-KT-2024-157',
      name: 'Prasat Sambor Rung Roeang Modern Agricultural Cooperative',
      province: 'Kampong Thom',
      district: 'Baray',
      graduationStage: 'Expanding',
      status: 'Active',
      totalMembers: 447
    }
  ];

  readonly businessPlanData = [
    {
      planName: 'Rice Production Expansion 2024',
      planYear: '2024',
      planType: 'Production Expansion',
      status: 'Approved',
      progress: 73
    }
  ];

  readonly assetInventoryData = [
    {
      assetId: 'AST-001',
      assetName: 'Rice Mill Machine',
      type: 'Equipment',
      condition: 'Good',
      estimatedValue: '$12,000',
      lastMaintenance: '2024-02-15'
    },
    {
      assetId: 'AST-002',
      assetName: 'Delivery Truck',
      type: 'Vehicle',
      condition: 'Fair',
      estimatedValue: '$28,000',
      lastMaintenance: '2024-01-20'
    }
  ];

  readonly memberDemographicsData = {
    totalMembers: 447,
    genderBreakdown: { male: 259, female: 188 },
    avgLandArea: 4.8
  };
}
