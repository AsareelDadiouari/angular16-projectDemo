import {inject, Pipe, PipeTransform} from "@angular/core";
import {DomSanitizer, SafeHtml, SafeUrl} from "@angular/platform-browser";

@Pipe({
  name: 'safeBASE64',
  pure: true
})
export class SafeBASE64Pipe implements PipeTransform {
  domSanitizer = inject(DomSanitizer);

  transform(base64: string | ArrayBuffer | null): SafeUrl {
    return this.domSanitizer.bypassSecurityTrustResourceUrl(<string>base64);
  }
}
