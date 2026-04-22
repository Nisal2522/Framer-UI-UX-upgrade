import { Component, computed, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-route-placeholder',
  standalone: true,
  templateUrl: './route-placeholder.component.html',
  styleUrl: './route-placeholder.component.scss',
})
export class RoutePlaceholderComponent {
  private readonly route = inject(ActivatedRoute);

  readonly title = computed(() => (this.route.snapshot.data['title'] as string | undefined) ?? 'Route Placeholder');
}