import './assets/main.css';

import { createApp } from 'vue';
import App from './App.vue';
import router from './router';

import FormLayout from '@/components/layout/public/v-form-layout.vue';
import FormLayoutColumn from '@/components/layout/public/v-form-layout-column.vue';
import FormLayoutRow from '@/components/layout/public/v-form-layout-row.vue';
import FormLayoutCell from '@/components/layout/public/v-form-layout-cell.vue';
import PlaceHolder from '@/components/v-placeholder.vue';

const app = createApp(App);

app.component('v-form-layout', FormLayout);
app.component('v-form-layout-column', FormLayoutColumn);
app.component('v-form-layout-row', FormLayoutRow);
app.component('v-form-layout-cell', FormLayoutCell);
app.component('v-placeholder', PlaceHolder);

app.use(router);

app.mount('#app');

