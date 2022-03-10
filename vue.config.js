const { defineConfig } = require('@vue/cli-service');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

const isProd = process.env.npm_lifecycle_event === 'build';

module.exports = defineConfig({
    transpileDependencies: true,
    chainWebpack: config => {
        config.module.rule('scss').oneOf([
            {
                test: /\.scss$/,
                oneOf: [
                    // this matches `<style module>`
                    {
                        resourceQuery: /module/,
                        use: [
                            'vue-style-loader',
                            {
                                loader: 'css-loader',
                                options: {
                                    modules: {
                                        localIdentName: isProd ? '_[hash:base64:5]' : '[local]_[hash:base64:5]',
                                    },
                                },
                            },
                            'postcss-loader',
                            {
                                loader: 'sass-loader',
                                options: {
                                    additionalData: `
                                                      @use "sass:math";
                                                      @import "@/assets/_variables.scss";
                                                      `,
                                },
                            },
                        ],
                    },
                    // this matches plain `<style>` or `<style scoped>`
                    {
                        test: /\.scss$/,
                        use: [
                            {
                                loader: MiniCssExtractPlugin.loader,
                                options: {},
                            },
                            'css-loader',
                            'postcss-loader',
                            {
                                loader: 'sass-loader',
                                options: {
                                    additionalData: `
                                                      @use "sass:math";
                                                      @import "@/assets/_variables.scss";
                                                      `,
                                },
                            },
                        ],
                    },
                ],
            },
        ]);
    },
});
