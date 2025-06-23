/* Base by: Siputzx Production 
   Creator: Jovian 
   Note: owner bisa lebih dari 1, tambahkan sesuai kebutuhan
   Note: jika sistem update dan meninggalkan erlic [NEW UPDATE].js maka itu adalah case baru dengan fitur yang baru, tinggal ubah saja namanya menjadi erlic.js dan hapus file erlic.js yang lama.
*/


/* setting informasi bot */
// ganti nomor bot lu
global.botnumber = '6282245682288'
// ganti nomor lu
global.owner = ['639384364507','6283840818197']
// ganti nama lu
global.ownername = ['nathan','dimas']
// website owner
global.website = ['https://instagram.com/arxhillie','https://instagram.com/arxhillie']
// fake lokasi owner
global.lokasi = ['Manila, Philippines','Indonesia']
// email owner 
global.email = ['jovianemanuel264@gmail.com','dimzy@gmail.com']
// ini owner tambahan
global.prems = ['6283878301449']
// nama bot lu
global.botname = 'erlic'
// watermark di beberapa fitur
global.header = `© erlic-bot v${require('./package.json').version}` 
// watermark
global.footer = 'ꜱɪᴍᴘʟᴇ ʙᴏᴛ ᴡʜᴀᴛꜱᴀᴘᴘ ᴍᴀᴅᴇ ʙʏ ɴᴀᴛʜᴀɴ' 
// packname stiker lu
global.packname = `Created by Erlic Bot\n\n+week, +date\n+time`
// author stiker lu
global.author = '' 
// link di beberapa fitur
global.link = '' 
// watermark di beberapa fitur
global.wm = 'Powered by ' + global.botname
// id saluran lu
global.idSaluran = '120363327728368573@newsletter' 
// sound di menu, pastikan chatbox
global.sound = 'https://files.catbox.moe/g1pp69.mpeg' 
// thumbnail di beberapa fitur, pastikan catbox
global.thumb = 'https://files.catbox.moe/gu0oe4.jpeg' 


/* setting system bot */
// pilih antara 1-39, untuk tampilan font di menu
global.font = 5;
// cooldown perdetik untuk jpm
global.delayJpm = 5;
// setting autoread
global.autoread = true
// setting autobio
global.autobio = false
// setting online
global.online = true
// setting auto typing
global.autotyping = true
// setting auto record 
global.autorecord = false
// setting anti spam
global.antispam = true
// setting cooldown anti spam
global.cooldown = 2
// setting only grup
global.gconly = true

/* setting payment */
// url qris lu
global.qris = 'https://files.catbox.moe/kuqiup.jpg' 
// sesuai nama qris di global.qris
global.payment = 'gopay'
// sesuai nomor e-money lu
global.ovo = '' 
global.dana = ''
global.shopeepay = ''
global.gopay = ''
global.seabank = ''
global.pulsa = ''
global.pulsa2 = ''

/* setting cpanel */
// domain panel lu
global.domain = 'https://alwaysdimzzy.harzhosting.web.id' 
// token ptla lu
global.apikey = 'ptla_8AY1lbEYJbQeagONwNSxl1hIUo4xU6KtyOcoHkgVAfQ'
// token ptlc lu
global.capikey = 'ptlc_g1WMP2dLDN7KrqYQBAqKX4PnJmHTQsUYtTWWx4Lnqyf'
global.egg = '15' /* Recommended */
global.loc = '1' /* Recommended */

/* setting message */
global.mess = {
wait: 'Processed . . .',
ok: 'Successfully.',
limit: 'Anda mencapai limit dan akan disetel ulang pada pukul 00.00\n\nUntuk mendapatkan limit unlimited, tingkatkan ke paket premium.',
premium: 'This feature only for premium user.',
jadibot: 'This feature only for jadibot user.',
owner: 'This feature is only for owners.',
gconly: 'Menggunakan bot di obrolan pribadi hanya untuk pengguna premium, tingkatkan ke paket premium hanya Rp10.000 selama 1 bulan.\n\nhttps://chat.whatsapp.com/FomSh8g1Te1IGfiuDDcW5u\nBergabung kedalam grup kami agar dapat menggunakan bot di obrolan pribadi.',
blockcmd: 'This feature is being blocked by system because an error occurred.',
group: 'This feature will only work in groups.',
private: 'Use this feature in private chat.',
admin: 'This feature only for group admin.',
botAdmin: 'This feature will work when I become an admin',
devs: 'This feature is only for developer.',
errorstc: 'Failed to create sticker.',
error: 'Sorry an error occurred!',
errorUrl: 'URL is invalid!'
}


require('./system/functions.js').reloadFile(__filename);