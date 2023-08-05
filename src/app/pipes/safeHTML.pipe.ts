import {inject, Pipe, PipeTransform} from "@angular/core";
import {DomSanitizer, SafeHtml} from "@angular/platform-browser";

@Pipe({
  name: 'safeHTML',
  pure: true
})
export class SafeHTMLPipe implements PipeTransform {
  domSanitizer = inject(DomSanitizer);

  transform(html: string): SafeHtml {
    return this.domSanitizer.bypassSecurityTrustHtml(html);
  }
}
