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


    </section>
  `,
  styles : [`
  `],
  providers: [{ provide: LOCALE_ID, useValue: 'en-US' }]
})
export class HomeComponent implements OnInit{
  image = signal<string | ArrayBuffer | null>(null);
  test = computed(() => {
    return 1;
  });

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
