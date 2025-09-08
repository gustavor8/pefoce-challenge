import { CommonModule, AsyncPipe } from '@angular/common';
import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { LoaderComponent } from '../loader/loader.component';
import { LoadingOverlayService } from '../../../core/services/loading-overlay.service';

@Component({
  selector: 'app-loading-overlay',
  templateUrl: './loading-overlay.component.html',
  styleUrls: ['./loading-overlay.component.scss'],
  standalone: true,
  imports: [CommonModule, LoaderComponent],
})
export class LoadingOverlayComponent {
  /** An observable that emits the current loading state. Controls the visibility of the overlay. */
  readonly isLoading$: Observable<boolean>;

  constructor(private loadingOverlayService: LoadingOverlayService) {
    this.isLoading$ = this.loadingOverlayService.isLoading$;
  }

  /**
   * Prevents any user interaction with the elements behind the overlay.
   * This stops click and other events from passing through the overlay.
   */
  preventInteraction(event: Event) {
    event.preventDefault();
    event.stopPropagation();
    return false;
  }
}
