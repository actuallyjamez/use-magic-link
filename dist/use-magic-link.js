function e(e){return e&&"object"==typeof e&&"default"in e?e.default:e}var n=require("react"),r=e(require("event-emitter")),t=e(require("isomorphic-unfetch")),o=e(require("ms")),u=require("async-sema"),i=function(e){try{return f?Promise.resolve(f):e&&l?(f=new l(e),Promise.resolve(f)):(s||(console.log("Loading Magic"),(s=window.document.createElement("script")).async=!0,s.src="https://cdn.jsdelivr.net/npm/magic-sdk/dist/magic.js",s.id="magic-link-sdk",s.onload=function(){l=window.Magic,c.emit("loaded")},document.head.appendChild(s)),e?Promise.resolve(new Promise(function(n){c.once("loaded",function(){f||(f=new l(e)),n(f)})})):Promise.resolve())}catch(e){return Promise.reject(e)}},c=new r,l=null,s=null,f=null;function a(e,n){try{var r=e()}catch(e){return n(e)}return r&&r.then?r.then(void 0,n):r}function h(e,n){try{var r=e()}catch(e){return n(!0,e)}return r&&r.then?r.then(n.bind(null,!1),n.bind(null,!0)):n(!1,r)}var d=function(e){try{return Promise.resolve(m.acquire()).then(function(){return h(function(){return w&&w.expiredAt>Date.now()?w.token:Promise.resolve(i(e)).then(function(e){return Promise.resolve(e.user.getIdToken()).then(function(e){return y(e),e})})},function(e,n){if(m.release(),e)throw n;return n})})}catch(e){return Promise.reject(e)}},m=new u.Sema(1),g=new u.Sema(1),v=new r,P=null,w=null;function y(e,n){void 0===n&&(n=o("15min")),w={token:e,expiredAt:Date.now()+n-o("1min")}}"undefined"!=typeof window&&i(),module.exports=function(e){if(!e)throw new Error("Magic Link publishableKey required as the first argument");var r=n.useState(null!==P&&P),o=r[0],u=r[1],c=n.useState(null===P),l=c[0],s=c[1],f=n.useState(null),m=f[0],p=f[1],j=n.useState(!1),k=j[0],q=j[1],I=n.useState(!1),S=I[0],b=I[1];return n.useEffect(function(){function n(e){u(e)}return P||function(e){try{return Promise.resolve(g.acquire()).then(function(){var n,r=h(function(){return a(function(){return null!==P?(n=1,P):Promise.resolve(d(e)).then(function(){P=!0})},function(){P=!1})},function(e,n){if(g.release(),e)throw n;return n});return r&&r.then?r.then(function(e){return n?e:P}):n?r:P})}catch(e){return Promise.reject(e)}}(e).then(function(e){u(e)}).then(function(){return s(!1)}),v.on("loggedIn",n),function(){v.off("loggedIn",n)}},[P]),{loggedIn:o,loading:l,error:m,loggingIn:k,loggingOut:S,login:function(n){try{p(null),q(!0);var r=h(function(){return a(function(){return Promise.resolve(i(e)).then(function(e){var r=e.auth.loginWithMagicLink({email:n});P=!0,y(r),v.emit("loggedIn",!0),u(!0)})},function(e){p(e)})},function(e,n){if(q(!1),e)throw n;return n});return Promise.resolve(r&&r.then?r.then(function(){}):void 0)}catch(e){return Promise.reject(e)}},logout:function(){try{p(null),b(!0);var n=h(function(){return a(function(){return Promise.resolve(i(e)).then(function(e){return Promise.resolve(e.user.logout()).then(function(){P=null,w=null,v.emit("loggedIn",!1),u(!1)})})},function(e){p(e)})},function(e,n){if(b(!1),e)throw n;return n});return Promise.resolve(n&&n.then?n.then(function(){return null===P}):null===P)}catch(e){return Promise.reject(e)}},fetch:function(n,r){void 0===r&&(r={});try{return Promise.resolve(d(e)).then(function(e){return e&&(r.headers=r.headers||{},r.headers.Authorization="Bearer "+e),t(n,r)})}catch(e){return Promise.reject(e)}},loginEvents:v}};
//# sourceMappingURL=use-magic-link.js.map
