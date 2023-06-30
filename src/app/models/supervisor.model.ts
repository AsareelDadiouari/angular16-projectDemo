export class Supervisor {
  id?: string
  code : string
  email : string
  firstname : string
  lastname : string
  studentCode?: string


  constructor(supervisor: Partial<Supervisor>) {
    this.code = supervisor.code || '';
    this.email = supervisor.email || '';
    this.firstname = supervisor.firstname || '';
    this.lastname = supervisor.lastname || '';
  }

  protected setStudentCode?(studentCode : string) {this.studentCode = studentCode}
  protected getStudentCode?() {return this.studentCode}

}
