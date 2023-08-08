module.exports = {
    apps: [{
        name: 'app',
        script: './bin/www.js',
        instance: 0,
        exec_mode: 'cluster',
    }]
}