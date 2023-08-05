import {Component, inject} from "@angular/core";
import {NotificationService} from "../services/notification.service";

@Component({
  selector: 'spinner',
  template: `
    <ng-container>
      <div #spinner class="spinner-overlay">
        <mat-progress-spinner color="primary" mode="indeterminate"></mat-progress-spinner>
      </div>
    </ng-container>
  `,
  styles: [`
    .spinner-overlay {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      display: flex;
      justify-content: center;
      align-items: center;
      background-color: rgba(255, 255, 255, 0.5); /* Set the background color with transparency */
      /*background-color: rgba(0, 0, 0, 0.5); /* Set the background color with transparency */
      z-index: 9999;
    }
  `]
})
export class SpinnerComponent {}
