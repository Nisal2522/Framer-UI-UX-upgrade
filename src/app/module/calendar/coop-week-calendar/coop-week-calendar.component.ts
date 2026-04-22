import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

export type CoopCalendarEvent = {
  id: string;
  date: Date;
  title: string;
  category: string;
  presenter?: string;
  time?: string;
  location?: string;
  notes?: string;
};

export type CoopCalendarCategory = {
  key: string;
  label: string;
  colorClass: string;
};

@Component({
  selector: 'app-coop-week-calendar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './coop-week-calendar.component.html',
  styleUrl: './coop-week-calendar.component.scss',
})
export class CoopWeekCalendarComponent {
  @Input({ required: true }) pageTitle = '';
  @Input({ required: true }) events: CoopCalendarEvent[] = [];
  @Input({ required: true }) categories: CoopCalendarCategory[] = [];

  currentStart = this.startOfWeek(new Date());
  readonly hours = Array.from({ length: 11 }, (_, i) => i + 8);

  moveWeek(days: number): void {
    const next = new Date(this.currentStart);
    next.setDate(next.getDate() + days);
    this.currentStart = this.startOfWeek(next);
  }

  goToday(): void {
    this.currentStart = this.startOfWeek(new Date());
  }

  weekDays(): Date[] {
    return Array.from({ length: 5 }, (_, index) => {
      const day = new Date(this.currentStart);
      day.setDate(this.currentStart.getDate() + index);
      return day;
    });
  }

  rangeLabel(): string {
    const days = this.weekDays();
    return `${this.longDate(days[0])} – ${this.longDate(days[4])}`;
  }

  dayOfMonth(date: Date): string {
    return String(date.getDate());
  }

  dayLabel(date: Date): string {
    return new Intl.DateTimeFormat('en-US', { weekday: 'short' }).format(date);
  }

  longDate(date: Date): string {
    return new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric' }).format(date);
  }

  isToday(date: Date): boolean {
    const today = new Date();
    return (
      date.getFullYear() === today.getFullYear() &&
      date.getMonth() === today.getMonth() &&
      date.getDate() === today.getDate()
    );
  }

  formatHour(hour: number): string {
    return hour <= 12 ? `${hour} AM` : `${hour - 12} PM`;
  }

  eventsForDay(day: Date): CoopCalendarEvent[] {
    return this.events.filter(
      (event) =>
        event.date.getFullYear() === day.getFullYear() &&
        event.date.getMonth() === day.getMonth() &&
        event.date.getDate() === day.getDate()
    );
  }

  categoryClass(categoryKey: string): string {
    return this.categories.find((category) => category.key === categoryKey)?.colorClass ?? 'bg-indigo-600';
  }

  eventCardClass(categoryKey: string): string {
    return `absolute left-1.5 right-1.5 rounded-md border border-black/20 px-2 py-1.5 text-[11px] text-white shadow ${this.categoryClass(categoryKey)}`;
  }

  legendDotClass(colorClass: string): string {
    return `h-2 w-2 rounded-full ${colorClass}`;
  }

  eventTop(event: CoopCalendarEvent): number {
    const start = this.parseStartMinutes(event.time);
    const hourOffset = start / 60 - 8;
    return Math.max(0, hourOffset * 64);
  }

  eventHeight(event: CoopCalendarEvent): number {
    const durationMinutes = this.parseDurationMinutes(event.time);
    return Math.max(38, (durationMinutes / 60) * 64);
  }

  private parseStartMinutes(time?: string): number {
    if (!time) return 12 * 60;
    const normalized = time.replace('–', '-');
    const startPart = normalized.split('-')[0]?.trim() ?? '12:00';
    return this.toMinutes(startPart) ?? 12 * 60;
  }

  private parseDurationMinutes(time?: string): number {
    if (!time) return 60;
    const normalized = time.replace('–', '-');
    const [startPart, endPart] = normalized.split('-').map((part) => part.trim());
    const start = this.toMinutes(startPart);
    const end = this.toMinutes(endPart);
    if (start === null || end === null) return 60;
    const delta = end >= start ? end - start : end + 24 * 60 - start;
    return Math.max(60, delta);
  }

  private toMinutes(value?: string): number | null {
    if (!value) return null;
    const match = value.match(/^(\d{1,2})(?::(\d{2}))?$/);
    if (!match) return null;
    const hour = Number(match[1]);
    const minute = Number(match[2] ?? '0');
    if (Number.isNaN(hour) || Number.isNaN(minute)) return null;
    return hour * 60 + minute;
  }

  private startOfWeek(date: Date): Date {
    const start = new Date(date);
    const day = start.getDay();
    const diff = day === 0 ? -6 : 1 - day;
    start.setDate(start.getDate() + diff);
    start.setHours(0, 0, 0, 0);
    return start;
  }
}
