import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

type PhaseBand = { start: number; end: number };

type CropCycle = {
  id: string;
  cycle: string;
  details: string;
  planting: PhaseBand;
  growing: PhaseBand;
  harvesting: PhaseBand;
};

type CropPlan = {
  id: string;
  region: string;
  crop: string;
  cycles: CropCycle[];
};

@Component({
  selector: 'app-calendar-harvesting-planning-page',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './calendar-harvesting-planning-page.component.html',
  styleUrl: './calendar-harvesting-planning-page.component.scss',
})
export class CalendarHarvestingPlanningPageComponent {
  readonly months = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];

  readonly plans: CropPlan[] = [
    {
      id: 'p1',
      region: 'Battambang',
      crop: 'Rice',
      cycles: [
        {
          id: 'p1-a',
          cycle: 'A-Cycle',
          details: 'Lowland field (rain-fed)',
          planting: { start: 4, end: 5 },
          growing: { start: 5, end: 8 },
          harvesting: { start: 9, end: 10 }
        },
        {
          id: 'p1-b',
          cycle: 'B-Cycle',
          details: 'Midland plot (short-cycle)',
          planting: { start: 2, end: 2 },
          growing: { start: 3, end: 4 },
          harvesting: { start: 5, end: 5 }
        }
      ]
    },
    {
      id: 'p2',
      region: 'Kampong Thom',
      crop: 'Cassava',
      cycles: [
        {
          id: 'p2-a',
          cycle: 'A-Cycle',
          details: 'Upland block (savanna)',
          planting: { start: 8, end: 9 },
          growing: { start: 9, end: 10 },
          harvesting: { start: 10, end: 11 }
        }
      ]
    },
    {
      id: 'p3',
      region: 'Siem Reap',
      crop: 'Maize',
      cycles: [
        {
          id: 'p3-a',
          cycle: 'A-Cycle',
          details: 'High land (rain-fed)',
          planting: { start: 4, end: 4 },
          growing: { start: 5, end: 7 },
          harvesting: { start: 8, end: 9 }
        }
      ]
    }
  ];

  phaseLeft(phase: PhaseBand): number {
    return (phase.start / 12) * 100;
  }

  phaseWidth(phase: PhaseBand): number {
    return (((phase.end - phase.start + 1) / 12) * 100);
  }

  growingLeft(cycle: CropCycle): number {
    const start = ((cycle.planting.end + 1) / 12) * 100;
    const end = (cycle.harvesting.start / 12) * 100;
    return Math.min(start, end);
  }

  growingWidth(cycle: CropCycle): number {
    const start = ((cycle.planting.end + 1) / 12) * 100;
    const end = (cycle.harvesting.start / 12) * 100;
    return Math.abs(end - start);
  }
}
