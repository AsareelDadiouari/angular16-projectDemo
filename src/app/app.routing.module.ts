import {RouterModule, Routes} from "@angular/router";
import {NgModule} from "@angular/core";
import {HomeComponent} from "./pages/home.component";
import {AssessmentFormComponent} from "./pages/assessment-form.component";
import {AuthenticationComponent} from "./pages/authentication.component";


let routes: Routes = [
  {
    path: '',
    component: HomeComponent,
    pathMatch: 'full',
  },
  {
    path: 'evaluation',
    component: AssessmentFormComponent,
    pathMatch: 'full',
  },
  {
    path: 'auth',
    component: AuthenticationComponent,
    pathMatch: 'full',
  },
  {
    path: '**',
    redirectTo: '',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {})],
  exports: [RouterModule]
})
export class AppRoutingModule { }
