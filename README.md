# Angular16-DemoProject

Generated with [Angular CLI](https://github.com/angular/angular-cli) version 16.1.1.
This project uses the newly introduced state management called Signals that granularly tracks how and where your state is used throughout an application.

## How Signals work

A signal is a wrapper around a value that can notify interested consumers when that value changes. Signals can contain any value, from simple primitives to complex data structures.

### Writable signals
Writable signals provide an API for updating their values directly. You create writable signals by calling the signal function with the signal's initial value:

```typescript
const count = signal(0);
console.log('The count is: ' + count());
```
To change the value of a writable signal, you can either .set() it directly:
```typescript
count.set(3);
```
### Computed signals
A computed signal derives its value from other signals. Define one using computed and specifying a derivation function:

```typescript
const count: WritableSignal<number> = signal(0);
const doubleCount: Signal<number> = computed(() => count() * 2);
```
### Effects
Signals are useful because they can notify interested consumers when they change. An effect is an operation that runs whenever one or more signal values change. You can create an effect with the effect function:

```typescript
effect(() => {
console.log(`The current count is: ${count()}`);
});
```
