module.exports = {
    apps: [{
        name: 'app',
        script: './src/app.js',
        instance: 0,
        exec_mode: 'cluster',
    }]
}