import Vue from 'vue';

declare global {
    interface Window {
        MSInputMethodContext?: boolean;
    }

    interface Document {
        documentMode: number | null;
    }
}
