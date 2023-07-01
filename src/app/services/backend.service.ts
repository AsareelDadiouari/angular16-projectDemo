// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import {inject, Injectable, signal, Signal} from "@angular/core";
import {environment} from "../../environments/environment";
import {AngularFireDatabase} from "@angular/fire/compat/database";
import {Supervisor} from "../models/supervisor.model";
import {Professor} from "../models/professor.model";
import {Headmaster} from "../models/headmaster.model";
import {NotificationService} from "./notification.service";
import {LoginModel} from "../models/login.model";
import * as assert from "assert";
import {Router} from "@angular/router";


@Injectable({
  providedIn: 'root'
})
export class BackendService {
  public app = initializeApp(environment.firebaseConfig);
  public analytics = getAnalytics(this.app);
  db = inject(AngularFireDatabase)
  notificationService = inject(NotificationService);
  router = inject(Router);
  authenticated = signal({value : this.getUserFromLocal()[0] , state: this.getUserFromLocal()[1]});

  constructor() {
    //console.log(this.isAuthenticated());
  }

  createSupervisor(supervisor: Professor | Headmaster){
    const pathRef = supervisor instanceof Professor ? "supervisor/professors" : "supervisor/headmaster";
    const pushRef = this.db.list(pathRef).push(supervisor)

    pushRef.update({
      code : this.codeGen(supervisor),
      id: pushRef.key
    }).then(() => {
      this.notificationService.showSuccessNotification("Compte creer")
    }).catch((err) => this.notificationService.showErrorNotification(err));
  }

  login(loginInfo: LoginModel){
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
        }
      }

    }).catch((err) => this.notificationService.showErrorNotification("hum thats weird " + err));
  }

  logout(){
    this.authenticated.update((value) => {
      value.state = false;
      return value;
    })
    localStorage.removeItem('auth')
    this.router.navigate(['/']).then(() => this.notificationService.showSuccessNotification("Deconnexion Reussi"))
  }

  getAuthenticatedUser(){
    const data: any  = this.authenticated().value
      return {
        value: data.user === undefined ? data as Professor | Headmaster | Partial<Supervisor> : data.user,
        state: this.authenticated().state
      }
  }


  //-------------------------------------------------------------------------------

  private codeGen(supervisor: Supervisor): string{
    return supervisor.firstname.substring(0, 2).toUpperCase()
      + supervisor.lastname.substring(0, 2).toUpperCase()
      + this.genRand(1, 31).toString().padStart(2, '0')
      + this.genRand(1, 12).toString().padStart(2, '0')
      + this.genRand(0, 99).toString().padStart(2, '0')
      + this.genRand(0, 99).toString().padStart(2, '0');
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

  private getUserFromLocal(): [Professor | Headmaster | Partial<Supervisor>, boolean]{
    const authData = localStorage.getItem('auth');

    if (authData) {
      try {
        const user = JSON.parse(authData);
        return user.role === "Professor" ? [user as Professor, true] : [user as Headmaster, true];
      } catch (error) {
        console.error('Error parsing user data from local storage:', error);
      }
    }

    return [{}, false];
  }

}
