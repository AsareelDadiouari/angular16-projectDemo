import {Component, OnInit, signal} from "@angular/core";
import {NgTemplateOutlet} from "@angular/common";

@Component({
  selector: 'app-landing-page',
  template: `
    <style>
      .main {
        min-height: 100vh;
      }
    </style>
    <section class="main">
      <input type="file" (change)="uploadImageEvent($event)">
      <div *ngIf="image()"><img [src]="image() | safeBASE64" alt="image" width="200px"></div>

      <ng-container [ngTemplateOutlet]="template1" [ngTemplateOutletContext]="array"></ng-container>

      <ng-template #template1 let-data>
        <div *ngFor="let i in data">
          {{i}}AAAAAAAAAAAAAAAAAAAAAAAAAA
        </div>
      </ng-template>
    </section>
  `,
  //styleUrls: ['./landing-page.component.css']
})
export class HomeComponent implements OnInit{
  image = signal<string | ArrayBuffer | null>(null);
  array: number[] = [1,2,3,4,5,6,7,8,9,0];

  ngOnInit(): void {
  }

  uploadImageEvent($event: Event): void {
    const file = ($event.target as HTMLInputElement).files?.item(0);
    const imageFormData = new FormData();
    const fileReader = new FileReader();

    if (file ){
      imageFormData.append('image', file!, file?.name);
      fileReader.readAsDataURL(file);
      fileReader.onload = ($) => {
        this.image.set(fileReader.result);
      }
    }
  }
}
