import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-ui-dialog',
  standalone: true,
  templateUrl: './ui-dialog.component.html',
  styleUrl: './ui-dialog.component.scss',
})
export class UiDialogComponent {
  @Input() open = false;
  @Input() title = 'Dialog';

  @Output() readonly close = new EventEmitter<void>();
}