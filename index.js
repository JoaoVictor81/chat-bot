
const qrcode = require('qrcode-terminal');
const {Client, LocalAuth} = require('whatsapp-web.js')


const chatbot = require('./chatbot');


const client = new Client ({
    authStrategy: new LocalAuth(),
});


client.on('qr', (qr) => {
    qrcode.generate(qr, { small: true});
});
client.on('ready', () =>{
    console.log('Pronto para Enviar');
});

client.on('message_create', async (message) => {
    await chatbot(message, client);
});

client.initialize();