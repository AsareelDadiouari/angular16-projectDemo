import {Supervisor} from "./supervisor.model";

export class Professor extends Supervisor {
  password: string | undefined;
  constructor(professor : Professor) {
    super(professor);
    this.password = professor.password;
  }
}
