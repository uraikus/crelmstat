require("browser-env")();
const crelmstat = require("./main");

describe("global instance:", () => {
  let obj = {};
  let state = crelmstat.global
  test("set and get:", () => {
    state.set("global", true);
    expect(state.get("global")).toBe(true);
  });
  test("attach to object:", () => {
    state.attach('global', obj, "value");
    state.set("global", false);
    expect(obj.value).toBe(false);
  });
  test("query selector update:", () => {
    document.body.innerHTML = '<b></b>'
    state.attach('global', 'b', "innerHTML");
    expect(state.data.get('global').subscribers.length).toBe(2)
    state.set("global", 'false');
    expect(document.body.firstElementChild.innerHTML).toBe('false');
    expect(state.data.get('global').subscribers.length).toBe(2)
  });
  test("attach function:", () => {
    let value
    state.set("global", null)
    state.attach('global', val => value = val)
    state.set('global', 'global')
    expect(value).toBe('global')
  });
  test("load:", () => {
    state.load({'global-load': true})
    expect(state.get('global-load')).toBe(true)
  });
  test("load error:", () => {
    expect(() => state.load(1)).toThrowError()
  })
  test("toJSON:", () => {
    state.set('global-load', 'toJSON')
    state.set('global', 'toJSON')
    let json = state.toJSON()
    expect(json['global-load']).toBe('toJSON')
    expect(json['global']).toBe('toJSON')
  });
});

describe("local seperation:", () => {
  let local = crelmstat();
  let {global} = crelmstat
  let obj = {};
  test("no access to global values:", () => {
    expect(local.get("global")).toBe(undefined);
  });
  test("set and get:", () => {
    local.set("local", true);
    expect(local.get("local")).toBe(true);
  });
  test("global no touchy the local:", () => {
    expect(global.get('local')).toBe(undefined)
  })
});

describe('Deletion of subscribers on return null', () => {
  test('Delete function on return null:', () => {
    let local = crelmstat()
    local.attach('happy', v => null)
    local.set('happy', true)
    expect(local.data.get('happy').subscribers.length).toBe(0)
  })
  test('Delete element on return null:', () => {
    let local = crelmstat()
    let div = document.createElement('div')
    local.attach('sad', div, 'innerHTML')
    local.set('sad', true)
    expect(local.data.get('sad').subscribers.length).toBe(0)
  })
})