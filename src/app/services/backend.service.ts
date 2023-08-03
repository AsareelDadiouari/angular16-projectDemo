// Import the functions you need from the SDKs you need
import {initializeApp} from "firebase/app";
import {getAnalytics} from "firebase/analytics";
import {computed, effect, inject, Injectable, signal} from "@angular/core";
import {environment} from "../../environments/environment";
import {AngularFireDatabase} from "@angular/fire/compat/database";
import {Supervisor} from "../models/entities/supervisor.model";
import {Professor} from "../models/entities/professor.model";
import {Headmaster} from "../models/entities/headmaster.model";
import {NotificationService} from "./notification.service";
import {LoginModel} from "../models/entities/login.model";
import {Router} from "@angular/router";
import {
  catchError,
  combineLatest, debounceTime,
  forkJoin,
  from, fromEvent,
  map,
  mergeMap,
  Observable, of, shareReplay,
  switchMap,
  take,
  tap,
  throwError
} from "rxjs";
import {toObservable, toSignal} from "@angular/core/rxjs-interop";
import {HttpClient} from "@angular/common/http";
import {Intern} from "../models/entities/intern";
import {AngularFireAuth} from "@angular/fire/compat/auth";
import {AssessmentForm} from "../models/entities/assessmentForm.model";
import utils from "../utils";
import firebase from "firebase/compat";


@Injectable({
  providedIn: 'root'
})
export class BackendService {
  public app = initializeApp(environment.firebaseConfig);
  public analytics = getAnalytics(this.app);
  db = inject(AngularFireDatabase)
  fbAuth = inject(AngularFireAuth)
  notificationService = inject(NotificationService);
  router = inject(Router);
  http = inject(HttpClient);
  fbUser = toSignal(this.fbAuth.user.pipe(
    tap(value => {

      if (value === null) {
        localStorage.removeItem('auth');
        localStorage.removeItem('refreshToken');
        this.authenticated.set({value: undefined, state: false})
      }

      if (value && this.authenticated().value){
        this.authenticated.set({value: this.authenticated().value, state: true})
      }
    })
  ));

  authenticated= signal({
    value : this.getSupervisorFromLocalStorage(),
    state : this.fbUser() !== undefined && this.fbUser() !== null
  })

  constructor() {
    effect(() => {
    })
    fromEvent<StorageEvent>(window, "storage").subscribe(event => {
      console.log("EVENT : ",event);
    })
  }

  createSupervisor(supervisor: Professor | Headmaster){
    const pathRef = supervisor instanceof Professor ? "supervisor/professors" : "supervisor/headmaster";

    // Check if the email already exists
    return this.db.list<Supervisor>(pathRef, ref => ref.orderByChild("email").equalTo(supervisor.email))
      .valueChanges()
      .pipe(
        take(1),
        tap( (users) => {
          if (users.length > 0) {
            this.notificationService.showErrorNotification("Email already exists");
          } else {
            const pushRef = this.db.list(pathRef).push(supervisor)
            pushRef.update({
              code : this.codeGen(supervisor),
              id: pushRef.key
            }).then(() => {
              this.fbAuth.createUserWithEmailAndPassword(supervisor.email, <string>supervisor.password).then(r => {
                this.notificationService.showSuccessNotification("Account created successfully")
              })
            }).catch((err) => this.notificationService.showErrorNotification(err));
          }
        }),
          catchError(err => {
            this.notificationService.showErrorNotification(err)
            return throwError(() => err);
          })
      )
  }

  createStudent(student: Intern){
    return this.db.list<Intern>("intern", ref => ref.orderByChild("code").equalTo(student.code)).valueChanges().pipe(
      tap((students: Intern[]) => {
        if (students.length > 0) {
          this.notificationService.showErrorNotification("Permanent code already exist");
        } else {
          const pushRef = this.db.list("intern").push(student)
          pushRef.update({
            code : this.codeGen(student),
            id: pushRef.key
          }).then(() => {
            //this.notificationService.showSuccessNotification("Etudiant Ajouter")
          }).catch((err) => this.notificationService.showErrorNotification(err));
        }
      })
    );
  }

  localStorageLogin(user: firebase.auth.UserCredential){
    return this.findLocalUserByEmail(utils.getValueOrThrow(user.user?.email))
      .pipe(
        tap((data) => {
          this.authenticated.set({value: data, state: data && this.fbUser() !== null});
          localStorage.setItem('auth', JSON.stringify(data));
          this.notificationService.showSuccessNotification("Logged In");
        }),
      )
  }

  firebaseLogin(loginInfo: LoginModel){
    return from(this.fbAuth.signInWithEmailAndPassword(loginInfo.email, loginInfo.password)).pipe(
      switchMap((user) => this.localStorageLogin(user)),
      catchError(err => {
        this.notificationService.showErrorNotification("Incorrect password or email");
        return throwError(() => err)
      })
    );
  }

  firebaseLogOut(){
    return from(this.fbAuth.signOut())
  }

  changePassword(changePasswordForm: any){
    return combineLatest([this.credentialsCheck("supervisor/professors", changePasswordForm.email, changePasswordForm.currentPassword),
      this.credentialsCheck("supervisor/headmaster", changePasswordForm.email, changePasswordForm.currentPassword),
    ]).pipe(
      map(([value1, value2]) => {

        let user: Supervisor | undefined = undefined
        if (value1){
           user = value1.find(val => val.email === changePasswordForm.email);
          this.db.database.ref("supervisor/professors/" + user?.id).update({
            password : changePasswordForm.newPassword
          }).then(() => {
            this.fbAuth.signInWithEmailAndPassword(changePasswordForm.email, changePasswordForm.currentPassword).then(value => {
              this.fbUser()?.updatePassword(changePasswordForm.newPassword).then(() => this.notificationService.showSuccessNotification("Password updated"));
            }).finally(() => this.fbAuth.signOut())
          })
        }

        if (value2){
           user = value2.find(val => val.email === changePasswordForm.email);
          this.db.database.ref("supervisor/headmaster/" + user?.id).update({
            password : changePasswordForm.newPassword
          }).then(() => {
            this.fbAuth.signInWithEmailAndPassword(changePasswordForm.email, changePasswordForm.currentPassword).then(value => {
              this.fbUser()?.updatePassword(changePasswordForm.newPassword).then(() => this.notificationService.showSuccessNotification("Password updated"));
            }).finally(() => this.fbAuth.signOut())
          })
        }

        return user;
      })
    )
  }

  getStudents(code: string): Observable<Intern[]> {
    return this.db.list<Intern>('intern', (ref) => {
      return ref.orderByChild("code")
        .startAt(code)
        .endAt(code + '\uf8ff')
        .limitToFirst(5)
    }).valueChanges()
  }

  getAuthenticatedUser(){
    return computed(() => {
      const data: any  = this.authenticated().value

      return {
        value: data?.user === undefined ? data as Professor | Headmaster | Partial<Supervisor> : data.user,
        state: this.authenticated().state
      }
    })
  }

  createAssessmentForm(assessment: AssessmentForm) {
    const pushRef = this.db.list("assessment").push(assessment)
    return from(pushRef.update({
      id: pushRef.key
    }))
  }

  getAssessments(){
    return this.db
      .list<AssessmentForm>('assessment', ref => ref.orderByChild('timestamp'))
      .valueChanges()
      .pipe(
        tap(() => this.notificationService.spinner.update(val => true)),
        shareReplay({ bufferSize: 1, refCount: true })
      );
  }

  updateAssessment(assessment: AssessmentForm): Observable<void>{
    return from(this.db.database.ref("assessment/" + assessment.id).update(utils.removeUndefinedProperties(assessment)))
  }

  updateAssessmentCode(id : string, code: string){
    return from(this.db.database.ref("assessment/" + id).update({
      internshipGeneratedCode: code
    })).pipe(
      tap(_ => this.notificationService.showSuccessNotification("Association code updated")),
      catchError(err => {
        this.notificationService.showErrorNotification("Something went wrong")
        return throwError(() => err);
      })
    )
  }

  getInternByPermanentCode(code: string){
    return this.db.list<Intern>("intern", ref => ref.orderByChild("code").equalTo(code)).valueChanges().pipe(
      map(values => values.find(value => value.code === code))
    );
  }

  getSupervisorByPermanentCode(code: string){
    return combineLatest([this.db.list<Supervisor>("supervisor/professors", ref => ref.orderByChild("code").equalTo(code)).valueChanges(),
      this.db.list<Supervisor>("supervisor/headmaster", ref => ref.orderByChild("code").equalTo(code)).valueChanges()]).pipe(
        map((values) => values[0].concat(values[1]).find(value => value.code === code))
    )
  }

  findLocalUserByEmail(email: string): Observable<{user: Supervisor, role: string}>{
    return combineLatest([this.db.list<Supervisor>("supervisor/professors", ref => ref.orderByChild("email").equalTo(email)).valueChanges(),
      this.db.list<Supervisor>("supervisor/headmaster", ref => ref.orderByChild("email").equalTo(email)).valueChanges()]).pipe(
        map(([professors, headmaster]) => {
          if (professors.some(prof => prof.email === email)){
            return {
              user: (professors.find(prof => prof.email === email)! as Omit<Professor, "password">),
              role: "Professor"
            }
          }

          return {
            user: (headmaster.find(head => head.email === email)! as Omit<Headmaster, "password">),
            role: "Headmaster"
          }
        }),
      catchError((err) => throwError(() => err))
    )
  }

  public getSupervisorFromLocalStorage() : {user: Partial<Supervisor>, role:string} | undefined{
    const userData = localStorage.getItem('auth');
    if (userData) {
      try {
        return JSON.parse(userData) satisfies {user: Partial<Supervisor>, role:string}
      } catch (error) {
        console.error('Error parsing user data from local storage:', error);
      }
    }
    return undefined;
  }

  //-------------------------------------------------------------------------------


  // Use with caution, kind of create an unexpected large number of data
  private populateStudents(number: number){
    const url = "https://randomuser.me/api/"
    const observables = []

    for (let i = 0; i < number; i++){
      observables.push(this.http.get<Intern>(url).pipe(
        switchMap((data : any) => this.createStudent({
          firstname : data.results[0].name.first,
          lastname  :  data.results[0].name.last,
          code : this.codeGen({
            lastname : data.results[0].name.last,
            firstname : data.results[0].name.first,
          })
        } as Intern)),
        tap((data) => {
        })
      ))
    }

    return forkJoin(observables).pipe(mergeMap(results => results));
  }

  private codeGen(user: Supervisor | Partial<Intern>): string{
    return (
      (user?.firstname?.substring(0, 2)?.toUpperCase() || '') +
      (user?.lastname?.substring(0, 2)?.toUpperCase() || '') +
      this.genRand(1, 31).toString().padStart(2, '0') +
      this.genRand(1, 12).toString().padStart(2, '0') +
      this.genRand(0, 99).toString().padStart(2, '0') +
      this.genRand(0, 99).toString().padStart(2, '0')
    );
  }

  private genRand(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  private credentialsCheck(path: string, email: string, password: string): Observable<Supervisor[]>{
    return this.db.list<Supervisor>(path, ref =>
      ref.orderByChild('email').equalTo(email)
        .ref.orderByChild('password').equalTo(password)).valueChanges();
  }
}
