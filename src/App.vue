<template>
    <div id="app">
        <FormLayout>
            <FormLayoutColumn :colspan="2">
                <FormLayoutCell>
                    <PlaceHolder />
                </FormLayoutCell>

                <FormLayoutCell :colspan="2" :rowspan="3">
                    <PlaceHolder :colspan="2" />
                </FormLayoutCell>

                <FormLayoutCell />

                <FormLayoutCell>
                    <PlaceHolder />
                </FormLayoutCell>

                <FormLayoutCell>
                    <PlaceHolder />
                </FormLayoutCell>
            </FormLayoutColumn>

            <FormLayoutColumn>
                <FormLayoutCell>
                    <PlaceHolder />
                </FormLayoutCell>

                <FormLayoutCell />

                <FormLayoutCell>
                    <PlaceHolder />
                </FormLayoutCell>

                <FormLayoutCell>
                    <PlaceHolder />
                </FormLayoutCell>

                <FormLayoutCell>
                    <PlaceHolder />
                </FormLayoutCell>
            </FormLayoutColumn>

            <FormLayoutColumn>
                <FormLayoutCell>
                    <PlaceHolder />
                </FormLayoutCell>

                <FormLayoutCell>
                    <PlaceHolder />
                </FormLayoutCell>

                <FormLayoutCell>
                    <PlaceHolder />
                </FormLayoutCell>

                <FormLayoutCell>
                    <PlaceHolder />
                </FormLayoutCell>
            </FormLayoutColumn>
        </FormLayout>
    </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';

@Component
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

    width: 60%;
    margin-left: auto;
    margin-right: auto;
    padding: 10px;
    border: 2px solid black;
}
</style>
