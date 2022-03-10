import Vue from 'vue';

Vue.prototype.$isIE = !!window.MSInputMethodContext && !!document.documentMode;
