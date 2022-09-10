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

    role = 'column';

    @Watch('isVisible')
    onIsVisible() {
        this.$emit('is-visible-changed');
    }
}
</script>
