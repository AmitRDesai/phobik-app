/**
 * Root-cause fix for the continuous native `Invalid responseType: blob` warning.
 *
 * React Native's global `fetch` is the bundled `whatwg-fetch` polyfill, which
 * unconditionally sets `xhr.responseType = 'blob'` on every request
 * (whatwg-fetch/fetch.js). RN's XMLHttpRequest forwards that to the native layer
 * as `responseType: 'blob'`. Under the New Architecture, `RCTNetworking` has no
 * registered blob response handler, so it falls through and calls
 * `RCTLogWarn(@"Invalid responseType: blob")` — a NATIVE log that bypasses JS
 * `console.warn`/`LogBox`, which is why it can't be filtered and floods Metro.
 *
 * We stop the trigger at the XHR layer: coerce `responseType = 'blob'` to
 * `'arraybuffer'`. RN maps `arraybuffer` → native `'base64'`
 * (XMLHttpRequest.js), which `RCTNetworking` handles — so no warning fires.
 * whatwg-fetch still reconstructs `.blob()` / `.json()` / `.text()` from the
 * resulting ArrayBuffer, and `responseType` only affects the RESPONSE body type,
 * so request bodies / uploads are unaffected.
 *
 * Pure JS — applied once at app entry, before any fetch runs.
 */
const proto = XMLHttpRequest.prototype;
const descriptor = Object.getOwnPropertyDescriptor(proto, 'responseType');

if (descriptor?.get && descriptor.set && descriptor.configurable) {
  const originalGet = descriptor.get;
  const originalSet = descriptor.set;
  Object.defineProperty(proto, 'responseType', {
    configurable: true,
    get(this: XMLHttpRequest) {
      return originalGet.call(this);
    },
    set(this: XMLHttpRequest, value: string) {
      originalSet.call(this, value === 'blob' ? 'arraybuffer' : value);
    },
  });
}
