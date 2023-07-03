<template>
    <div id="app">
        <Grid1 class="grid" />
        <Grid2 class="grid" />
        <Grid3 class="grid" />
    </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';

import Grid1 from '@/Grid1.vue';
import Grid2 from '@/Grid2.vue';
import Grid3 from '@/Grid3.vue';

@Component({
    components: {
        Grid1,
        Grid2,
        Grid3,
    },
})
export default class App extends Vue {}
</script>

<style lang="scss">
* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

body {
    background-color: #dedede;
}

input {
    outline: none;
}

#app {
    font-family: Avenir, Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
    margin-top: 60px;

    width: 100%;
    padding: 10px;

    display: inline-grid;
    grid-template-columns: repeat(3, 1fr);
    align-items: flex-start;
    gap: 24px;

    .grid {
        padding: 10px;
        border: 2px solid black;
    }
}
</style>
