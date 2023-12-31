# Angular16-DemoProject

Generated with [Angular CLI](https://github.com/angular/angular-cli) version 16.1.1.
This project uses the newly introduced state management called Signals that granularly tracks how and where your state is used throughout an application.

## How Signals work

A signal is a wrapper around a value that can notify interested consumers when that value changes. Signals can contain any value, from simple primitives to complex data structures.

### Writable signals
Writable signals provide an API for updating their values directly. You create writable signals by calling the signal function with the signal's initial value:

```typescript
import {Supervisor} from "./supervisor.model";

getUserFromLocal(): [Partial<Supervisor>, boolean]
{
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

authenticated : WritableSignal<{ value: Partial<Supervisor>, state: boolean }> = signal({
  value: this.getUserFromLocal()[0],
  state: this.getUserFromLocal()[1]
})
```
To change the value of a writable signal, you can either .set() it directly:
```typescript
this.authenticated.set({value: headmasterArray[index], state: true});
this.authenticated.set({value: professorArray[index], state: true});
```
### Computed signals
A computed signal derives its value from other signals. Define one using computed and specifying a derivation function:

```typescript
getAuthenticatedUser(): Signal<{value: any, state: boolean}>
{
  return computed(() => {
    const data: any  = this.authenticated().value
    return {
      value: data?.user === undefined ? data as Professor | Headmaster | Partial<Supervisor> : data.user,
      state: this.authenticated().state
    }
  })
}
```
### Effects
Signals are useful because they can notify interested consumers when they change. An effect is an operation that runs whenever one or more signal values change. You can create an effect with the effect function:

```typescript
userInfo: Signal<{value: any, state: boolean}> = this.backendService.getAuthenticatedUser();
supervisorForm = this.fb.group({
  id: ['To determine'],
  code : ['', [Validators.required, Validators.pattern(/^([a-zA-Z]{4})(\d{2})(\d{2})(\d{2})(\d{2})$/)]],
  email : [''],
  firstname : [''],
  lastname : [''],
  studentCode: [''],
});

constructor() 
{
  effect(() => {
    this.supervisorForm.get("code")?.setValue(this.userInfo().state ? this.userInfo().value.code : '');
    this.supervisorForm.get("email")?.setValue(this.userInfo().state ? this.userInfo().value.email : '');
    this.supervisorForm.get("firstname")?.setValue(this.userInfo().state ? this.userInfo().value.firstname : '');
    this.supervisorForm.get("lastname")?.setValue(this.userInfo().state ? this.userInfo().value.lastname : '');
  })
}
```
### Conversions
toSignal() can be used to convert an observable to a signal.
```typescript
students: Signal<Intern[] | undefined> = toSignal(this.studentInfoForm.valueChanges.pipe(
  switchMap((value) => this.backendService.getStudents(<string>value.permanentCode?.toUpperCase()))
))
```
toObservable() is used to do the reverse work.
```typescript
const authService = inject(BackendService);
const router = inject(Router);
const dialog = inject(MatDialog);

toObservable(authService.authenticated).subscribe(val => {
  if (!val.state)
    router.navigate(['/']).then(() => displayAuthModal(router, dialog))
});
```
