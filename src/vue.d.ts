//import { RootState } from './store/index';
import api from './utils/api';
import newapi from './utils/newapi';
import user from './utils/user';
import i18n from './utils/i18n';
import alert from './utils/alert';
import confirm from './utils/confirm';
import toast from './utils/toast';
import { switchPageLoader } from '@/utils/helpers';
import detail from './utils/detail';
import { Bus } from './utils/bus';

declare module 'vue/types/vue' {
    interface Vue {
        $isIE: boolean;
        $style: { [key: string]: string };
    }
}
