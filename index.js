const { Telegraf, Markup } = require('telegraf')
require('dotenv').config()
const text = require('./const')

const bot = new Telegraf(process.env.BOT_TOKEN)

bot.start((ctx) => ctx.reply(`Привет ${ctx.message.from.first_name ? ctx.message.from.first_name : 'незнакомец'}!
Я помогу вам найти нужную аудиторию для занятий и подскажу, как к ней пройти.`))
bot.help((ctx) => ctx.reply(text.commands))

bot.command('timetable', async (ctx) => {
    try{
        await ctx.replyWithHTML('<b>Выберите группу:</b>', Markup.inlineKeyboard(
            [
                [Markup.button.callback('КИ', 'btn_KI'), 
            Markup.button.callback('АТ Сервис', 'btn_ATS'),
            Markup.button.callback('ДИ', 'btn_DI')],
            ]
        ))
        
    }catch(e) {
        console.error(e)
    }
})



const cron = require('node-cron');

cron.schedule('* * 0/1 * * *', () => {
  bot.telegram.sendMessage(1235647955, "обновление расписании");
  bot.telegram.sendMessage(1250147610, "обновление расписании");
  

});


bot.action('btn_KI', (ctx) => {
    ctx.reply('Выберите:', 
     Markup.inlineKeyboard([
       [Markup.button.callback('Понедельник', 'KI_1')],
        [Markup.button.callback('Вторник', 'KI_2')],
        [Markup.button.callback('Среда', 'KI_3')],
        [Markup.button.callback('Четверг', 'KI_4')],
        [Markup.button.callback('Пятница', 'KI_5')],
    ]))
});

function addActionBot(name, src, text){
    bot.action(name, async (ctx) =>{
        try{
            await ctx.answerCbQuery()
            if(src !== false) {
                await ctx.replyWithPhoto({
                    source: src
                })
            }
           await ctx.replyWithHTML(text, {
                disable_web_page_preview: true 
            } )
        } catch (e) {
            console.error(e)
        }
    })
}
addActionBot('KI_1', './img/KI_1.jpg', text.textKI1)
addActionBot('KI_2', './img/KI_2.jpg',text.textKI2)
addActionBot('KI_3', './img/KI_3.jpg', text.textKI3)
addActionBot('KI_4', './img/KI_4.jpg', text.textKI4)
addActionBot('KI_5', './img/KI_5.jpg', text.textKI5)


bot.launch()
console.log('бот запущен!')

// Enable graceful stop
process.once('SIGINT', () => bot.stop('SIGINT'))
process.once('SIGTERM', () => bot.stop('SIGTERM'))