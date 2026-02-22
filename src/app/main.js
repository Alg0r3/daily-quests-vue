import { createApp } from 'vue';
import { createPinia } from 'pinia';
import PrimeVue from 'primevue/config';
import Aura from '@primeuix/themes/aura';
import App from '../App.vue';
import router from '../shared/router/index.js';
import './main.css';

const pinia = createPinia();
const app = createApp(App);

app.use(pinia);
app.use(router);
app.use(PrimeVue, {
  theme: {
    preset: Aura,
    options: {
      darkModeSelector: '.app-dark-mode',
      cssLayer: {
        name: 'primevue',
        order: 'theme, base, primevue',
      }
    },
  },
  ripple: true,
});

app.mount('#app');
