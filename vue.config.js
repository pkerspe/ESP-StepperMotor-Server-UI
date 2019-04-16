module.exports = {
    filenameHashing: false,
    configureWebpack: {
        optimization: {
            splitChunks: false
        },
        output: {
            filename: "js/[name].js",
            chunkFilename: "js/[name].js",
        }
    },
    css: {
        extract: false,
    },
}
