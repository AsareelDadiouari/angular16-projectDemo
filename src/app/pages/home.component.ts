import {Component, OnInit} from "@angular/core";

@Component({
  selector: 'app-landing-page',
  template: `
    <style>
      .main {
        min-height: 100vh;
      }
    </style>
    <section class="main">Hi</section>
  `,
  //styleUrls: ['./landing-page.component.css']
})
export class HomeComponent implements OnInit{
  ngOnInit(): void {
  }
}
