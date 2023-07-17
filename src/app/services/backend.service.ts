// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import {computed, inject, Injectable, signal, Signal, WritableSignal} from "@angular/core";
import {environment} from "../../environments/environment";
import {AngularFireDatabase} from "@angular/fire/compat/database";
import {Supervisor} from "../models/supervisor.model";
import {Professor} from "../models/professor.model";
import {Headmaster} from "../models/headmaster.model";
import {NotificationService} from "./notification.service";
import {LoginModel} from "../models/login.model";
import * as assert from "assert";
import {Router} from "@angular/router";
import {
  BehaviorSubject, catchError, combineLatest,
  flatMap,
  forkJoin,
  from,
  map,
  mergeMap,
  Observable,
  of,
  switchMap,
  take,
  tap,
  throwError
} from "rxjs";
import {toSignal} from "@angular/core/rxjs-interop";
import {HttpClient} from "@angular/common/http";
import {Intern} from "../models/intern";
import {AngularFireAuth} from "@angular/fire/compat/auth";
import {AssessmentForm} from "../models/assessmentForm.model";
import {reauthenticateWithCredential} from "@angular/fire/auth";


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

  authenticated= signal({
    value : this.getUserFromLocal()[0],
    state : this.getUserFromLocal()[1]
  })

  constructor() {
    //console.log(this.isAuthenticated());
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
                this.notificationService.showSuccessNotification("Compte creer")
              })
            }).catch((err) => this.notificationService.showErrorNotification(err));
          }
        })
      )
  }

  createStudent(student: Intern){
    return this.db.list<Intern>("intern", ref => ref.orderByChild("code").equalTo(student.code)).valueChanges().pipe(
      tap((students: Intern[]) => {
        if (students.length > 0) {
          this.notificationService.showErrorNotification("Code permanent existe deja");
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

  localStorageLogin(loginInfo: LoginModel){
    this.db.database.ref().once('value').then(snapshot => {
      const users = snapshot.val();

      if (users.supervisor.headmaster) {
        const headmasterKeys = Object.keys(users.supervisor.headmaster);
        const headmasterArray = Object.values(users.supervisor.headmaster) as Headmaster[];
        const index = headmasterArray.findIndex((user) => user.email === loginInfo.email && user.password === loginInfo.password);

        if (index !== -1){
          headmasterArray.forEach(head => delete head.password)

          this.authenticated.set({value: headmasterArray[index], state: true});
          localStorage.setItem('auth', JSON.stringify({user: headmasterArray[index], role: "Headmaster"}));
          this.notificationService.showSuccessNotification("Connexion Reussi");
          return;
        }
      }

      if (users.supervisor.professors) {
        const professorKeys = Object.keys(users.supervisor.professors);
        const professorArray = Object.values(users.supervisor.professors) as Professor[];
        const index = professorArray.findIndex((user) => user.email === loginInfo.email && user.password === loginInfo.password);

        if (index !== -1){
          professorArray.forEach(prof => delete prof.password)

          this.authenticated.set({value: professorArray[index], state: true});
          localStorage.setItem('auth', JSON.stringify({user: professorArray[index], role: "Professor"}));
          this.notificationService.showSuccessNotification("Connexion Reussi");
          return;
        }
      }
      this.notificationService.showErrorNotification("Email ou mot de passe incorrect");
    }).catch((err) => this.notificationService.showErrorNotification(err));
  }

  firebaseLogin(loginInfo: LoginModel){
    return from(this.fbAuth.signInWithEmailAndPassword(loginInfo.email, loginInfo.password)).pipe(
      tap((user) => {
        this.localStorageLogin(loginInfo);
      }),
      catchError(err => {
        this.localStorageLogin(loginInfo);
        return throwError(err)
      })
    );
  }

  localStorageLogout(){
    this.authenticated.update((value) => {
      value.state = false;
      return value;
    });
    this.notificationService.showSuccessNotification("Deconnexion Reussi");
    localStorage.removeItem('auth');
    localStorage.removeItem('refreshToken');

    //this.router.navigate(['/']).then(() => this.notificationService.showSuccessNotification("Deconnexion Reussi"))
  }

  firebaseLogOut(){
    return from(this.fbAuth.signOut())
  }

  changePassword(changePasswordForm: any){
    return combineLatest([this.db.list<Supervisor>("supervisor/professors", (ref) => {
      return ref.orderByChild("email").equalTo(changePasswordForm.email)
        .ref.orderByChild("password").equalTo(changePasswordForm.currentPassword);
    }).valueChanges(),
      this.db.list<Supervisor>("supervisor/headmaster", (ref) => {
        return ref.orderByChild("email").equalTo(changePasswordForm.email)
          .ref.orderByChild("password").equalTo(changePasswordForm.currentPassword);
      }).valueChanges()
    ]).pipe(
      mergeMap(([value1, value2]) => {
        return  [
          ...value1.map((value) => ({ ...value, source: "value1" })),
          ...value2.map((value) => ({ ...value, source: "value2" })),
        ]
          .filter(value => value.email === changePasswordForm.email)
          .map(value => {
          if (value.source === "value1"){
            this.db.database.ref("supervisor/professors/" + value.id).update({
              password : changePasswordForm.newPassword
            }).then(res => {
              this.fbAuth.signInWithEmailAndPassword(changePasswordForm.email, changePasswordForm.password).then(val=> {
                return val.user?.updatePassword(changePasswordForm.newPassword);
              }).then(_ => {
                console.log("PROFESSORS");
              })
              this.notificationService.showSuccessNotification("Mot de passe a jour");
            })
          } else if (value.source === "value2"){
            this.db.database.ref("supervisor/headmaster/" + value.id).update({
              password : changePasswordForm.newPassword
            }).then(res => {
              this.fbAuth.signInWithEmailAndPassword(changePasswordForm.email, changePasswordForm.password).then(val=> {
                return val.user?.updatePassword(changePasswordForm.newPassword);
              }).then(_ => {
                console.log("HEADMASTER");
              })
              this.notificationService.showSuccessNotification("Mot de passe a jour");
            })
          }
          return value;
        });
      }),
      map(value => {
        return value as Omit<Supervisor, "password">
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
    return this.db.list<AssessmentForm>('assessment', ref => ref.orderByChild('timestamp')).valueChanges();
  }

  updateAssessmentCode(id : string, code: string){
    return from(this.db.database.ref("assessment/" + id).update({
      internshipGeneratedCode: code
    })).pipe(
      tap(_ => this.notificationService.showSuccessNotification("Code modifié")),
      catchError(err => {
        this.notificationService.showErrorNotification("something is wrong")
        return throwError(err);
      })
    )
  }

  // Use with caution, kind of create an unexpected large number of data
  populateStudents(number: number){
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

  //-------------------------------------------------------------------------------

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

  private getUserType(user: any): string {
    if (user.headmaster) {
      return 'headmaster';
    } else if (user.professors) {
      return 'professors';
    } else {
      return 'unknown';
    }
  }

  public getUserFromLocal(){
    const authData = localStorage.getItem('auth');

    if (authData) {
      try {
        const user = JSON.parse(authData);
        return user.role === "Professor" ? [user as Professor, true] : [user as Headmaster, true]
      } catch (error) {
        console.error('Error parsing user data from local storage:', error);
      }
    }
    return [{}, false];
  }
}
