export class Supervisor {
  id?: string
  code : string
  email : string
  firstname : string
  lastname : string
  studentCode?: string

  constructor(code : string, email : string, firstname : string, lastname : string) {
    this.code = code;
    this.email = email;
    this.firstname = firstname;
    this.lastname = lastname;
  }

  protected setStudentCode(studentCode : string) {this.studentCode = studentCode}
  protected getStudentCode() {return this.studentCode}

}
