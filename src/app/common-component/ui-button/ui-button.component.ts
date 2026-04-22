import { Component, EventEmitter, Input, Output } from '@angular/core';

type Variant = 'primary' | 'secondary' | 'ghost';

@Component({
  selector: 'app-ui-button',
  standalone: true,
  templateUrl: './ui-button.component.html',
  styleUrl: './ui-button.component.scss',
})
export class UiButtonComponent {
  @Input() label = 'Button';
  @Input() variant: Variant = 'primary';
  @Input() disabled = false;

  @Output() readonly buttonClick = new EventEmitter<void>();

  get classes(): string {
    const base = 'inline-flex items-center justify-center rounded-md px-4 py-2 text-sm font-medium transition disabled:opacity-50';
    switch (this.variant) {
      case 'secondary':
        return `${base} border border-slate-300 bg-white text-slate-700 hover:bg-slate-50`;
      case 'ghost':
        return `${base} text-slate-700 hover:bg-slate-100`;
      default:
        return `${base} bg-[#0F2F8F] text-white hover:bg-[#032EA1]`;
    }
  }
}