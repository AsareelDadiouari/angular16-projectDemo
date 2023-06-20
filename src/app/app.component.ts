import {Component, effect, OnInit, signal} from '@angular/core';
import {takeUntilDestroyed, toObservable, toSignal} from "@angular/core/rxjs-interop";
import {interval, switchMap, tap} from "rxjs";

@Component({
  selector: 'app-root',
  template: `
    <style>
      :host {
        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol";
        font-size: 14px;
        color: #333;

      }

      h1,
      h2,
      h3,
      h4,
      h5,
      h6 {
        margin: 8px 0;
      }

      p {
        margin: 0;
      }

      .spacer {
        flex: 1;
      }

      .toolbar {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        height: 60px;
        display: flex;
        align-items: center;
        background-color: #1976d2;
        color: white;
        font-weight: 600;
      }

      .toolbar img {
        margin: 0 16px;
      }

      .toolbar #twitter-logo {
        height: 40px;
        margin: 0 8px;
      }

      .toolbar #youtube-logo {
        height: 40px;
        margin: 0 16px;
      }

      .toolbar #twitter-logo:hover,
      .toolbar #youtube-logo:hover {
        opacity: 0.8;
      }

      .content {
        display: flex;
        margin: 82px auto 32px;
        padding: 0 16px;
        max-width: 960px;
        flex-direction: column;
        align-items: center;
      }

      svg.material-icons {
        height: 24px;
        width: auto;
      }

      svg.material-icons:not(:last-child) {
        margin-right: 8px;
      }

      .card svg.material-icons path {
        fill: #888;
      }

      .card-container {
        display: flex;
        flex-wrap: wrap;
        justify-content: center;
        margin-top: 16px;
      }

      .card {
        all: unset;
        border-radius: 4px;
        border: 1px solid #eee;
        background-color: #fafafa;
        height: 40px;
        width: 200px;
        margin: 0 8px 16px;
        padding: 16px;
        display: flex;
        flex-direction: row;
        justify-content: center;
        align-items: center;
        transition: all 0.2s ease-in-out;
        line-height: 24px;
      }

      .card-container .card:not(:last-child) {
        margin-right: 0;
      }

      .card.card-small {
        height: 16px;
        width: 168px;
      }

      .card-container .card:not(.highlight-card) {
        cursor: pointer;
      }

      .card-container .card:not(.highlight-card):hover {
        transform: translateY(-3px);
        box-shadow: 0 4px 17px rgba(0, 0, 0, 0.35);
      }

      .card-container .card:not(.highlight-card):hover .material-icons path {
        fill: rgb(105, 103, 103);
      }

      .card.highlight-card {
        background-color: #1976d2;
        color: white;
        font-weight: 600;
        border: none;
        width: auto;
        min-width: 30%;
        position: relative;
      }

      .card.card.highlight-card span {
        margin-left: 60px;
      }

      svg#rocket {
        width: 80px;
        position: absolute;
        left: -10px;
        top: -24px;
      }

      svg#rocket-smoke {
        height: calc(100vh - 95px);
        position: absolute;
        top: 10px;
        right: 180px;
        z-index: -10;
      }

      a,
      a:visited,
      a:hover {
        color: #1976d2;
        text-decoration: none;
      }

      a:hover {
        color: #125699;
      }

      .terminal {
        position: relative;
        width: 80%;
        max-width: 600px;
        border-radius: 6px;
        padding-top: 45px;
        margin-top: 8px;
        overflow: hidden;
        background-color: rgb(15, 15, 16);
      }

      .terminal::before {
        content: "\\2022 \\2022 \\2022";
        position: absolute;
        top: 0;
        left: 0;
        height: 4px;
        background: rgb(58, 58, 58);
        color: #c2c3c4;
        width: 100%;
        font-size: 2rem;
        line-height: 0;
        padding: 14px 0;
        text-indent: 4px;
      }

      .terminal pre {
        font-family: SFMono-Regular, Consolas, Liberation Mono, Menlo, monospace;
        color: white;
        padding: 0 1rem 1rem;
        margin: 0;
      }

      .circle-link {
        height: 40px;
        width: 40px;
        border-radius: 40px;
        margin: 8px;
        background-color: white;
        border: 1px solid #eeeeee;
        display: flex;
        justify-content: center;
        align-items: center;
        cursor: pointer;
        box-shadow: 0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24);
        transition: 1s ease-out;
      }

      .circle-link:hover {
        transform: translateY(-0.25rem);
        box-shadow: 0px 3px 15px rgba(0, 0, 0, 0.2);
      }

      footer {
        margin-top: 8px;
        display: flex;
        align-items: center;
        line-height: 20px;
      }

      footer a {
        display: flex;
        align-items: center;
      }

      .github-star-badge {
        color: #24292e;
        display: flex;
        align-items: center;
        font-size: 12px;
        padding: 3px 10px;
        border: 1px solid rgba(27, 31, 35, .2);
        border-radius: 3px;
        background-image: linear-gradient(-180deg, #fafbfc, #eff3f6 90%);
        margin-left: 4px;
        font-weight: 600;
      }

      .github-star-badge:hover {
        background-image: linear-gradient(-180deg, #f0f3f6, #e6ebf1 90%);
        border-color: rgba(27, 31, 35, .35);
        background-position: -.5em;
      }

      .github-star-badge .material-icons {
        height: 16px;
        width: 16px;
        margin-right: 4px;
      }

      svg#clouds {
        position: fixed;
        bottom: -160px;
        left: -230px;
        z-index: -10;
        width: 1920px;
      }

      /* Responsive Styles */
      @media screen and (max-width: 767px) {
        .card-container > *:not(.circle-link),
        .terminal {
          width: 100%;
        }

        .card:not(.highlight-card) {
          height: 16px;
          margin: 8px 0;
        }

        .card.highlight-card span {
          margin-left: 72px;
        }

        svg#rocket-smoke {
          right: 120px;
          transform: rotate(-5deg);
        }
      }

      @media screen and (max-width: 575px) {
        svg#rocket-smoke {
          display: none;
          visibility: hidden;
        }
      }
    </style>

    <mat-drawer-container class="example-container" autosize>
      <mat-drawer #drawer class="example-sidenav" mode="side">
        <mat-list role="list">
          <mat-list-item role="listitem">Item 1</mat-list-item>
          <mat-list-item role="listitem">Item 2</mat-list-item>
          <mat-list-item role="listitem">Item 3</mat-list-item>
        </mat-list>
      </mat-drawer>

      <!-- Toolbar -->
      <div class="toolbar" role="banner">
        <button (click)="drawer.toggle()" mat-icon-button type="button" >
          <mat-icon *ngIf="!drawer.opened;">chevron_right</mat-icon>
          <mat-icon *ngIf="drawer.opened">chevron_left</mat-icon>
        </button>
        <img
          width="40"
          alt="Angular Logo"
          src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNTAgMjUwIj4KICAgIDxwYXRoIGZpbGw9IiNERDAwMzEiIGQ9Ik0xMjUgMzBMMzEuOSA2My4ybDE0LjIgMTIzLjFMMTI1IDIzMGw3OC45LTQzLjcgMTQuMi0xMjMuMXoiIC8+CiAgICA8cGF0aCBmaWxsPSIjQzMwMDJGIiBkPSJNMTI1IDMwdjIyLjItLjFWMjMwbDc4LjktNDMuNyAxNC4yLTEyMy4xTDEyNSAzMHoiIC8+CiAgICA8cGF0aCAgZmlsbD0iI0ZGRkZGRiIgZD0iTTEyNSA1Mi4xTDY2LjggMTgyLjZoMjEuN2wxMS43LTI5LjJoNDkuNGwxMS43IDI5LjJIMTgzTDEyNSA1Mi4xem0xNyA4My4zaC0zNGwxNy00MC45IDE3IDQwLjl6IiAvPgogIDwvc3ZnPg=="
        />
        <span>Welcome</span>
        <div class="spacer"></div>
        <a aria-label="Angular on twitter" target="_blank" rel="noopener" href="https://twitter.com/angular"
           title="Twitter">
          <svg id="twitter-logo" height="24" data-name="Logo" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400">
            <rect width="400" height="400" fill="none"/>
            <path
              d="M153.62,301.59c94.34,0,145.94-78.16,145.94-145.94,0-2.22,0-4.43-.15-6.63A104.36,104.36,0,0,0,325,122.47a102.38,102.38,0,0,1-29.46,8.07,51.47,51.47,0,0,0,22.55-28.37,102.79,102.79,0,0,1-32.57,12.45,51.34,51.34,0,0,0-87.41,46.78A145.62,145.62,0,0,1,92.4,107.81a51.33,51.33,0,0,0,15.88,68.47A50.91,50.91,0,0,1,85,169.86c0,.21,0,.43,0,.65a51.31,51.31,0,0,0,41.15,50.28,51.21,51.21,0,0,1-23.16.88,51.35,51.35,0,0,0,47.92,35.62,102.92,102.92,0,0,1-63.7,22A104.41,104.41,0,0,1,75,278.55a145.21,145.21,0,0,0,78.62,23"
              fill="#fff"/>
          </svg>
        </a>
        <a aria-label="Angular on YouTube" target="_blank" rel="noopener" href="https://youtube.com/angular"
           title="YouTube">
          <svg id="youtube-logo" height="24" width="24" data-name="Logo" xmlns="http://www.w3.org/2000/svg"
               viewBox="0 0 24 24" fill="#fff">
            <path d="M0 0h24v24H0V0z" fill="none"/>
            <path
              d="M21.58 7.19c-.23-.86-.91-1.54-1.77-1.77C18.25 5 12 5 12 5s-6.25 0-7.81.42c-.86.23-1.54.91-1.77 1.77C2 8.75 2 12 2 12s0 3.25.42 4.81c.23.86.91 1.54 1.77 1.77C5.75 19 12 19 12 19s6.25 0 7.81-.42c.86-.23 1.54-.91 1.77-1.77C22 15.25 22 12 22 12s0-3.25-.42-4.81zM10 15V9l5.2 3-5.2 3z"/>
          </svg>
        </a>
      </div>
      <!-- Main content -->
      <div class="content" role="main">
        <router-outlet></router-outlet>
      </div>

    </mat-drawer-container>
  `,
  //templateUrl: './app.component.html',
  //styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{
  image = signal<string | ArrayBuffer | null>(null);

  ngOnInit(): void {
  }

  uploadImageEvent($event: Event): void {
    const file = ($event.target as HTMLInputElement).files?.item(0);
    const imageFormData = new FormData();
    const fileReader = new FileReader();

    console.log()
    if (file ){
      imageFormData.append('image', file!, file?.name);
      fileReader.readAsDataURL(file);
      fileReader.onload = ($) => {
        this.image.set(fileReader.result);
      }
    }
  }
}
