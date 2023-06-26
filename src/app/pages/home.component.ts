import {Component, OnInit, signal} from "@angular/core";

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
