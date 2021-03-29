const app = require('./app');

(async () => {
    const listen=await app.listen(3000);

    listen ? console.log('App listen to port'+3000) : 'Error';
})()