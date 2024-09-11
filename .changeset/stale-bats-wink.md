---
"@sap/guided-answers-extension-core": patch
"sap-guided-answers-extension": patch
"@sap/guided-answers-extension-webapp": patch
---

fix(ga): fix for #606 issue
- [x] add fix for pageSize issue
- [x] add cancel previous call to API before doing a new one
- [x] add debounce on search input onChange callback
