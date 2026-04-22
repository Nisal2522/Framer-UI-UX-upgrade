import { Component } from '@angular/core';
import {
  CoopWeekCalendarComponent,
  type CoopCalendarCategory,
  type CoopCalendarEvent
} from '@/app/module/calendar/coop-week-calendar/coop-week-calendar.component';

@Component({
  selector: 'app-calendar-training-page',
  standalone: true,
  imports: [CoopWeekCalendarComponent],
  templateUrl: './calendar-training-page.component.html',
  styleUrl: './calendar-training-page.component.scss',
})
export class CalendarTrainingPageComponent {
  readonly categories: CoopCalendarCategory[] = [
    { key: 'classroom', label: 'Group training', colorClass: 'bg-[#032EA1]' },
    { key: 'extension', label: 'Extension visit', colorClass: 'bg-sky-500' },
    { key: 'demo', label: 'Demo / field day', colorClass: 'bg-emerald-500' },
    { key: 'cert', label: 'Assessment / certification', colorClass: 'bg-amber-500' }
  ];

  readonly events: CoopCalendarEvent[] = [
    {
      id: 't1',
      date: new Date(2026, 3, 9),
      title: 'GAP refresher — record keeping',
      category: 'classroom',
      presenter: 'GDA',
      time: '08:30 – 12:00',
      location: 'AC meeting hall',
      notes: 'Registered members: 28. Bring member ID lists; register at arrival desk.'
    },
    {
      id: 't2',
      date: new Date(2026, 3, 11),
      title: 'District extension — pest scouting',
      category: 'extension',
      presenter: 'FAO',
      time: '09:00',
      location: 'Maize demonstration plot',
      notes: 'Joint visit with PDA; photo documentation for reporting.'
    },
    {
      id: 't3',
      date: new Date(2026, 3, 16),
      title: 'Financial literacy — savings circles',
      category: 'classroom',
      presenter: 'MAFF',
      time: '14:00 – 16:30',
      location: 'Commune office (Annex)',
      notes: 'Women’s committee priority slots; interpreter on request.'
    },
    {
      id: 't4',
      date: new Date(2026, 3, 19),
      title: 'Post-harvest handling demo',
      category: 'demo',
      presenter: 'DACP',
      time: '07:00 – 11:00',
      location: 'Central warehouse apron',
      notes: 'Moisture meters + hermetic bags; Q&A with storage officer.'
    },
    {
      id: 't5',
      date: new Date(2026, 3, 24),
      title: 'Board & committee orientation',
      category: 'classroom',
      presenter: 'GDA',
      time: '13:00 – 17:00',
      location: 'AC meeting hall',
      notes: 'Governance module; new bylaws overview.'
    },
    {
      id: 't6',
      date: new Date(2026, 3, 25),
      title: 'Internal GAP self-assessment',
      category: 'cert',
      presenter: 'FAO',
      time: '08:00 – 15:00',
      location: 'Multiple sites',
      notes: 'Checklist v2; findings feed into Ministry reporting template.'
    },
    {
      id: 't7',
      date: new Date(2026, 4, 2),
      title: 'Youth agri-entrepreneur workshop',
      category: 'classroom',
      presenter: 'MAFF',
      time: '09:00 – 12:00',
      location: 'Online + hall hybrid',
      notes: 'Market linkage pitch training; max 40 participants.'
    },
    {
      id: 't8',
      date: new Date(2026, 4, 7),
      title: 'Safe pesticide use — field school',
      category: 'demo',
      presenter: 'DACP',
      time: '06:30 – 10:00',
      location: 'Vegetable cluster (east)',
      notes: 'PPE distribution; sign-in for attendance records.'
    },
    {
      id: 't9',
      date: new Date(2026, 4, 15),
      title: 'Certification readiness review',
      category: 'cert',
      presenter: 'GDA',
      time: '10:00',
      location: 'AC office',
      notes: 'Pre-audit with support partner; gaps logged as actions.'
    },
    {
      id: 't10',
      date: new Date(2026, 3, 7),
      title: 'Climate-smart planting schedule clinic',
      category: 'extension',
      presenter: 'FAO',
      time: '08:30 – 10:30',
      location: 'Rice cluster, Block B',
      notes: 'Farmer plot calendars aligned with wet-season windows and irrigation slots.'
    },
    {
      id: 't11',
      date: new Date(2026, 3, 8),
      title: 'Soil health & compost application practical',
      category: 'demo',
      presenter: 'MAFF',
      time: '10:30 – 12:00',
      location: 'Cassava learning plot',
      notes: 'Hands-on compost mixing, field application rates, and farmer record updates.'
    },
    {
      id: 't12',
      date: new Date(2026, 3, 10),
      title: 'Water management for dry spells',
      category: 'classroom',
      presenter: 'DACP',
      time: '09:00 – 11:00',
      location: 'AC training room',
      notes: 'Irrigation timing, water-saving practices, and field scheduling for smallholders.'
    }
  ];
}
