# Relazon 🚀

You need to have feedbacks on your front-end ? We are here for this

# Simple as it should be

## Step 1

Install the package using npm

```text
npm install relazon
```

or Yarn

```text
yarn add relazon
```

## Step 2

Import it in the root of your code

For example in your main.ts / index.js

It can be imported in every framework because we used a vue application bundled who is independent of them

```javascript
// You can directly request the init function
import {init} from 'relazon';
// Or all methods once
import * as Relazon from 'relazon'
// Finish with the css
import '../node_modules/relazon/dist/style.css';

// Now just init it !
init();
```

## Step 3

### Customize your initialisation

The init function accept an object like this

```typescript jsx
type InitConfig = {
    containerId?: string;
    userToken?: string;
};

init({
    containerId: "the_ID_your_want",
    userToken: "See your admin panel to obtain it" // Today you don't need it for the moment
})
```

## Documentation

### Exported functions :

[```init()```](#step-2)

```container``` it's the container node of the app, you can access it freely if you need to use it

### Exported types :

```typescript
type InitConfig = {
    containerId?: string;
    userToken?: string;
};
```
