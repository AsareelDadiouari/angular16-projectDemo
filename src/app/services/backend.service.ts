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


@Injectable({
  providedIn: 'root'
})
export class BackendService {
  public app = initializeApp(environment.firebaseConfig);
  public analytics = getAnalytics(this.app);
  db = inject(AngularFireDatabase)
  notificationService = inject(NotificationService);
  isAuthenticated = signal({user : {} as Supervisor, state: false});

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
      console.log(snapshot.val());
      const supervisors = snapshot.val();

      if (supervisors.headmaster) {
        const headmasterKeys = Object.keys(supervisors.headmaster);
        const headmasterArray = Object.values(supervisors.headmaster) as Headmaster[];
        const index = headmasterArray.findIndex((user) => user.email === loginInfo.email && user.password === loginInfo.password);

        if (index !== -1){
          this.isAuthenticated.set({user: headmasterArray[index], state: true});
          this.notificationService.showSuccessNotification("Connexion Reussi");
        }
      }

      if (supervisors.professors) {
        const professorKeys = Object.keys(supervisors.professors);
        const professorArray = Object.values(supervisors.professors) as Professor[];
        const index = professorArray.findIndex((user) => user.email === loginInfo.email && user.password === loginInfo.password);

        if (index !== -1){
          this.isAuthenticated.set({user: professorArray[index], state: true});
          this.notificationService.showSuccessNotification("Connexion Reussi");
        }
      }

      console.log("Not found")
    }).catch((err) => this.notificationService.showErrorNotification(err));
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
}
