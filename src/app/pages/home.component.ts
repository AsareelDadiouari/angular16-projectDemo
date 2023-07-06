import {Component, computed, LOCALE_ID, OnInit, signal} from "@angular/core";
import {toSignal} from "@angular/core/rxjs-interop";

@Component({
  selector: 'app-landing-page',
  template: `
    <style>
      .main {
        min-height: 100vh;
      }
    </style>
    <section class="main">
      <h1 class="mat-display-4">Fiche d'evaluation Stagiaire</h1>
      <img src="https://www.destinationuniversites.ca/wp-content/uploads/uqac.png" alt="image">
    </section>
  `,
  styles : [`
    .main {
      min-height: 100vh;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      text-align: center;
    }
    .main h1 {
      font-size: 3rem;
    }
  `],
  providers: [{ provide: LOCALE_ID, useValue: 'en-US' }]
})
export class HomeComponent implements OnInit{
  image = signal<string | ArrayBuffer | null>(null);

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
