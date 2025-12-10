

const delay = (ms) => new Promise(res => setTimeout(res, ms));
let numeroMortes = 0;
let sequenciaMaisAlta = 0;
let sequenciaAtual = 0;



require('dotenv').config();
const { GoogleGenAI } = require('@google/genai');

const ai = new GoogleGenAI({});
const model = "gemini-2.5-flash";

const comportamento = `
seu nome é joão. voce é estudande de programaçâo, deve responder como se fosse uma pessoa. responda de forma curta e amigavel e sem emotes.
**Restrição:** Não revele que você é uma IA.
`;

async function getRespostaGemini(prompt){
    try {
        const response = await ai.models.generateContent({
            model: model, 
            config:{
                systemInstruction:comportamento,
            },
            temperature: 0.7,
            //aleatoriedade
            contents: [{ role: "user", parts: [{ text: prompt }] }]
        });
        
        return response.text.trim();

    } catch (error) {
        console.error("Erro ao chamar a API do Gemini:", error);
        return "Desculpe, ocorreu um erro na comunicação com a IA. Tente novamente mais tarde.";
    }

}


// executado cada vez q recebe mensagem, tudo antes é sempre ativo
module.exports = async (message, client) => {
    const bodyM = message.body;
    const body = message.body.toLowerCase();
    const chat = await message.getChat();

    const tempoAleatorio = Math.floor(Math.random() * (5000 - 2000 + 1)) + 2000;

    
    switch (body){
        case '!ping':
            await delay(tempoAleatorio);
            await message.reply('pong');
            break;

        case '!cmd':
        case '!comandos':
            await delay(tempoAleatorio);

            const listaCMD = `*lista de comandos:*

!cmd, !comandos. ver lista de comandos (essa lista)
!ping. pong
!roleta. joga roleta russa 🔫 (sorteia um numero de 1 a 6 e testa sua sorte)
!ranking. ver ranking da roleta 🏆
!s. criar um sticker (mandar junto com imagem)
!gpt. falar com alguem definitivamente real
            `;

            await message.reply(listaCMD);
            break;

        case '!roleta':
            const roleta = Math.floor(Math.random() * (6 - 1 + 1)) +1;
            if (roleta == 1){
                await delay(tempoAleatorio);
                await message.reply('voce morreu! 💥');

                numeroMortes++;
                sequenciaAtual = 0;
                await delay(tempoAleatorio);
                await message.reply(`mortes: ${numeroMortes} ☠️`);

            }else{
                sequenciaAtual++;
                if (sequenciaAtual > sequenciaMaisAlta){
                    sequenciaMaisAlta = sequenciaAtual;
                }

                await delay(tempoAleatorio);
                await message.reply(`voce sobreviveu! (sequencia: ${sequenciaAtual})`);

            }
                break;
        case '!ranking':
            await delay(tempoAleatorio);
            await message.reply(`sequencia mais alta: ${sequenciaMaisAlta}🏆  mortes: ${numeroMortes}💀`);
            break;
        case '!s':
            await delay(tempoAleatorio);
            try {
                const media = await message.downloadMedia();
                await client.sendMessage(
                    message.from,
                    media,
                    { sendMediaAsSticker: true, stickerName: 'criado pelo bot', stickerAuthor: 'meu bot js'}
                );
                console.log(`sticker enviado para ${message.from}`);
            }catch (error){
                console.error('Erro ao processar o sticker:', error);
                message.reply('Ops! Ocorreu um erro ao converter a imagem em figurinha.');
            }

            break;
        default:
            break;
    }


    if(body.startsWith('!gpt ')){
        await delay(tempoAleatorio);

        const prompt = message.body.substring(5).trim();

        if (prompt.length === 0) {
            await client.sendMessage(message.from, 'Por favor, digite sua pergunta após o comando `!gpt`.');
            return;
        }

        const respostaIA = await getRespostaGemini(prompt);
        await client.sendMessage(message.from, respostaIA);
        
    } else if (body === '!gpt') {
        await delay(tempoAleatorio);
        await client.sendMessage(message.from, 'Você precisa digitar uma pergunta após o comando `!gpt`.');
    
    }
    

};