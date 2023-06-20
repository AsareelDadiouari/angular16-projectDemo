import {Pipe, PipeTransform, Type} from "@angular/core";

@Pipe({
  name: 'cast',
  pure: true
})
export class CastPipe implements PipeTransform {
  transform<S, T extends S>(value: S, type?: new () => T): T {
    return <T>value;
  }
}
