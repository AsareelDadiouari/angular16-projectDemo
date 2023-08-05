import {Supervisor} from "./supervisor.model";

export class Headmaster extends Supervisor {
  password: string | undefined;
  constructor(head : Headmaster) {
    super(head);
    this.password = head.password;
  }
}
