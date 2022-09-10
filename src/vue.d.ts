import Vue from 'vue';

declare module 'vue/types/vue' {
    interface Vue {
        $isIE: boolean;
        $style: { [key: string]: string };
    }
}
