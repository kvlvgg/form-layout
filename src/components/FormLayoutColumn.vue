<template>
    <fragment>
        <slot />
    </fragment>
</template>

<script lang="ts">
import { Vue, Component, Prop, Watch } from 'vue-property-decorator';
import FormLayoutCell from '@/components/FormLayoutCell.vue';

@Component
export default class FormLayoutColumn extends Vue {
    @Prop({ type: Boolean, default: true }) isVisible!: boolean;
    @Prop({ type: Number, default: 1 }) colspan!: number;

    $children!: FormLayoutCell[];

    mounted() {
        this.checkProperUsage();
    }

    private checkProperUsage() {
        let isUsageError = false;

        this.$children.forEach(x => {
            if (x.$vnode.componentOptions?.tag !== 'FormLayoutCell') isUsageError = true;
        });

        if (isUsageError)
            console.error('Дочерними элементами v-form-layout-column могут быть только v-form-layout-cell');
    }

    @Watch('isVisible')
    onIsVisible() {
        this.$emit('is-visible-changed');
    }
}
</script>
