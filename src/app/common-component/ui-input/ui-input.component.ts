import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-ui-input',
  standalone: true,
  templateUrl: './ui-input.component.html',
  styleUrl: './ui-input.component.scss',
})
export class UiInputComponent {
  @Input() label = 'Label';
  @Input() value = '';
  @Input() placeholder = '';
  @Input() type = 'text';

  @Output() readonly valueChange = new EventEmitter<string>();

  onInput(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    this.valueChange.emit(value);
  }
}