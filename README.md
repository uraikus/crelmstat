# crelmstat

An expedient, super simple, fully tested, zero dependency, generic state management tool. Made specifically for (but not exclusively) [crelm](https://www.npmjs.com/package/crelm).

### installation
```cli
npm i crelmstat
```
### import
```js
import crelmstat from 'crelmstat'
const state = crelmstat()
// or
const state = require('crelmstat')()
```
### usage
```js
// Set a state value
state.set(key, value)
state.set('sample', true)

// Get a state value
state.get(key)
let sample = state.get('sample')

// Attach to element/object for auto updates
let obj = {}
state.attach(key, elem:Object or querySelector string, attr)
// If the 2nd argument is a html element reference, the listener will be removed when the element is removed from the DOM
state.attach('sample', obj, 'innerHTML')
state.attach('money', '.player-money', 'innerText')

// Attach function
state.attach(sampleFunction)
state.attach(key, newValue => {
  window.sample = newValue
})
state.attach(key, newValue => {
  if (window.isHappy) doTheThings()
  else return null // returning null will delete the listener
})
```
### import/export
```js
  let json = state.toJSON()
  state.load(json)
```
### global state
```js
const {global} = require('crelmstat')

global.attach('test', document.body, 'innerHTML')
global.set('test', 'Hello World!')
global.get('test')
// or
window.state = require('crelmstat')()
```