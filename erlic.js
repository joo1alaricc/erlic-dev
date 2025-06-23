require("./config")
require('./system/functions.js')
const fs = require('fs')
const util = require('util')
const axios = require('axios')
const { exec, execSync } = require("child_process")
const os = require('os')
const crypto = require('crypto')
const fetch = require('node-fetch')
const ms = require('parse-ms')
const { performance } = require('perf_hooks')
const { default: makeWASocket, proto, generateWAMessageFromContent, prepareWAMessageMedia } = require('@whiskeysockets/baileys');
const { Sticker, createSticker, StickerTypes } = require('wa-sticker-formatter')
const cheerio = require('cheerio')
const path = require('path')
const FormData = require('form-data');

module.exports = async (erlic, m) => {
try {
const { read } = require('jimp');
const { MIME_JPEG } = require('jimp');
const { styles, yStr } = require('./system/font.js');
const handleError = require('./system/vmHandler');
const isDev = global.developer.includes(m.sender.split('@')[0])
const prefixDB = JSON.parse(fs.readFileSync('./database/prefix.json'))
global.customPrefix = prefixDB.prefix
const premiumFile = './database/premium.json'
if (!fs.existsSync(premiumFile)) fs.writeFileSync(premiumFile, '[]')
let premium = JSON.parse(fs.readFileSync(premiumFile))
const bannedFile = './database/banned.json'
if (!fs.existsSync(bannedFile)) fs.writeFileSync(bannedFile, '[]')
let banned = JSON.parse(fs.readFileSync(bannedFile))
const blockCmdPath = './database/blockcmd.json';
if (!fs.existsSync(blockCmdPath)) fs.writeFileSync(blockCmdPath, '[]');
const body =
  (m.mtype === 'conversation' && m.message.conversation) ||
  (m.mtype === 'imageMessage' && m.message.imageMessage.caption) ||
  (m.mtype === 'documentMessage' && m.message.documentMessage.caption) ||
  (m.mtype === 'videoMessage' && m.message.videoMessage.caption) ||
  (m.mtype === 'extendedTextMessage' && m.message.extendedTextMessage.text) ||
  (m.mtype === 'buttonsResponseMessage' && m.message.buttonsResponseMessage.selectedButtonId) ||
  (m.mtype === 'templateButtonReplyMessage' && m.message.templateButtonReplyMessage.selectedId) ||
  (m.mtype === 'listResponseMessage' && m.message.listResponseMessage.singleSelectReply?.selectedRowId) ||
  (m.mtype === 'reactionMessage' && m.message.reactionMessage.text) ||
  (m.type === 'conversation' && m.message.conversation) ||
  (m.type === 'imageMessage' && m.message.imageMessage.caption) ||
  (m.type === 'videoMessage' && m.message.videoMessage.caption) ||
  (m.type === 'extendedTextMessage' && m.message.extendedTextMessage.text) ||
  (m.type === 'buttonsResponseMessage' && m.message.buttonsResponseMessage.selectedButtonId) ||
  (m.type === 'listResponseMessage' && m.message.listResponseMessage.singleSelectReply?.selectedRowId) ||
  (m.type === 'templateButtonReplyMessage' && m.message.templateButtonReplyMessage.selectedId) ||
  (m.type === 'messageContextInfo' &&
    (m.message.buttonsResponseMessage?.selectedButtonId ||
     m.message.listResponseMessage?.singleSelectReply?.selectedRowId ||
     m.text)) ||
  '';
const budy = (typeof m.text === 'string') ? m.text : '';
const sender = m.key.fromMe ? (erlic.user.id.split(':')[0]+'@s.whatsapp.net' || erlic.user.id) : (m.key.participant || m.key.remoteJid)
const botNumber = await erlic.decodeJid(erlic.user.id)
const senderNumber = sender.split('@')[0]
const isCreator = (m && m.sender && ([botNumber, ...global.owner, ...global.prems, ...global.developer].map(v => v.replace(/[^0-9]/g, '') + '@s.whatsapp.net').includes(m.sender) || botNumber.includes(m.sender.replace(/[^0-9]/g, '')))) || false;
const dimasathan = global.owner.includes(m.sender.split('@')[0]);
const prefixRegex = new RegExp(`^(${global.customPrefix.map(p => p.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|')})`);
const prefa = require('./database/prefix.json')
const pripek = prefa.prefix
const matchedPrefix = budy.match(prefixRegex);
const prefix = isCreator ? (matchedPrefix ? matchedPrefix[0] : '' ) : (matchedPrefix ? matchedPrefix[0] : pripek ) || pripek || '.';
const isCmd = isCreator ? (matchedPrefix || !prefixRegex.test(body)) : budy.startsWith(prefix);
const command = isCmd ? budy.slice(prefix.length).trim().split(' ').shift().toLowerCase() : '';
const cmd = isCmd ? budy.slice(prefix.length).trim().split(' ').shift().toLowerCase() : '';
const args = budy.trim().split(/ +/).slice(1)
const text = q = args.join(" ")
const pushname = m.pushName || `${senderNumber}`
const isBot = botNumber.includes(senderNumber)
const from = m.chat
let isAutobio = global.autobio ? true : false
let isAutoread = global.autoread ? true : false
let isAutotyping = global.autotyping ? true : false
let isAutorecord = global.autorecord ? true : false
let isAntispam = global.antispam ? true : false
let isGconly = global.gconly ? true : false
const groupMetadata = m.isGroup ? await erlic.groupMetadata(m.chat) : {};
const isBotAdmin = m.isGroup ? groupMetadata.participants.some(p => p.id === botNumber && p.admin !== null) : false;
const isAdmin = m.isGroup ? groupMetadata.participants.some(p => p.id === m.sender && p.admin !== null) : false;
const isAdmins = m.isGroup ? groupMetadata.participants.some(p => p.id === m.sender && p.admin !== null) : false;
const isPrem = (id) => {
const now = Date.now();
  premium = premium.filter(p => p.expired > now);
  fs.writeFileSync(premiumFile, JSON.stringify(premium, null, 2));
  return premium.some(p => p.id === id && p.expired > now);
}
function capital(text) {
    return text.charAt(0).toUpperCase() + text.slice(1);
}
function generateRandomString(length, baseChars) {
    const chars = baseChars + '0123456789'
    let result = ''
    for (let i = 0; i < length; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length))
    }
    return result
}
    
    
function randomNomor(min, max) {
return Math.floor(Math.random() * (max - min + 1)) + min;
}
function monospace(str) {
return '```' + str + '```';
}
function pickRandom(list) {
return list[Math.floor(Math.random() * list.length)];
}
function jsonFormat(obj) {
  return JSON.stringify(obj, null, 2);
}
async function generateWAMessage(from, content, options = {}) {
    const message = await generateWAMessageFromContent(from, content, options);
    return message;
}
function generateSuffix(length) {
    const chars = 'abcdefghijklmnopqrstuvwxyz0123456789'
    let result = ''
    for (let i = 0; i < length; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length))
    }
    return result
}
const { fromBuffer } = require('file-type');
const FormData = require('form-data');
const fetch = require('node-fetch');

async function upload(buffer) {
    try {
        let { ext, mime } = await fromBuffer(buffer);
        if (!/^image\/(jpe?g|png|gif)$/.test(mime)) {
            return { status: false, message: 'Format gambar tidak didukung.' };
        }
        const bodyForm = new FormData();
        bodyForm.append("fileToUpload", buffer, `file.${ext}`);
        bodyForm.append("reqtype", "fileupload");
        const res = await fetch("https://catbox.moe/user/api.php", {
            method: "POST",
            body: bodyForm
        });
        const url = await res.text();
        if (!url.startsWith('https://')) {
            return { status: false, message: url };
        }
        return { status: true, url };
    } catch (error) {
        return { status: false, message: String(error) };
    }
}
  function formatMoney(amount) { 
    return amount.toLocaleString('id-ID');
}
async function resize(media) {
  const image = await read(media);
  const min = Math.min(image.getWidth(), image.getHeight());
  const cropped = image.crop(0, 0, min, min);
  return {
    img: await cropped.scaleToFit(720, 720).getBufferAsync(MIME_JPEG),
    preview: await cropped.normalize().getBufferAsync(MIME_JPEG)
  };
}
    
async function uploadPh(mediaBuffer) {
    const axios = require('axios')
  try {
    const form = new FormData();
    form.append('file', mediaBuffer, {
      filename: 'image.jpg',
      contentType: 'image/jpeg',
    });
    const res = await axios.post('https://telegra.ph/upload', form, {
      headers: {
        ...form.getHeaders()
      },
      maxContentLength: Infinity,
      maxBodyLength: Infinity,
    });
    const json = res.data;
    if (!res.status === 200 || json.error) {
      console.error('Upload error:', json.error || res.statusText);
      return null;
    }
    return 'https://telegra.ph' + json[0].src;
  } catch (err) {
    console.error(err);
    return null;
  }
}
    
async function getSha(owner, repo, path) {
    const url = `https://api.github.com/repos/${owner}/${repo}/contents/${path}`
    const headers = {
        Authorization: `token ${global.githubtoken}`,
        Accept: 'application/vnd.github.v3+json',
    }
    const res = await axios.get(url, { headers })
    return res.data.sha
}
function clockString(ms) {
  let h = isNaN(ms) ? '--' : Math.floor(ms / 3600000)
  let m = isNaN(ms) ? '--' : Math.floor(ms / 60000) % 60
  let s = isNaN(ms) ? '--' : Math.floor(ms / 1000) % 60
  return [h, m, s].map(v => v.toString().padStart(2, 0)).join(':')
}
function parseMs(ms) {
 const seconds = Math.floor(ms / 1000) % 60;
 const minutes = Math.floor(ms / (1000 * 60)) % 60;
 const hours = Math.floor(ms / (1000 * 60 * 60)) % 24;
 const days = Math.floor(ms / (1000 * 60 * 60 * 24))
 return `${days ? `${days} Hari, ` : ''}${hours ? `${hours} Jam, ` : ''}${minutes ? `${minutes} Menit, ` : ''}${seconds} Detik`;
}
function ms(str) {
  if (typeof str !== 'string') return 0;
  const time = str.match(/^(\d+)(s|m|h|d|mo|y)$/);
  if (!time) return 0;
  const num = parseInt(time[1]);
  const unit = time[2];
  const multipliers = {
    s: 1000,
    m: 60 * 1000,
    h: 60 * 60 * 1000,
    d: 24 * 60 * 60 * 1000,
    mo: 30 * 24 * 60 * 60 * 1000,
    y: 365 * 24 * 60 * 60 * 1000
  };
  return num * (multipliers[unit] || 0);
}
const path = './database/premium.json';
function cleanExpiredPremium() {
  let prem = JSON.parse(fs.readFileSync(path));
  const now = Date.now();
  prem = prem.filter(user => user.expired > now);
  fs.writeFileSync(path, JSON.stringify(prem, null, 2));
}
    
const pathBanned = './database/banned.json';
function cleanExpiredBanned() {
  let banned = JSON.parse(fs.readFileSync(pathBanned));
  const now = Date.now();
  banned = banned.filter(user => user.until === -1 || user.until > now);
  fs.writeFileSync(pathBanned, JSON.stringify(banned, null, 2));
}
    
async function jarak(dari, ke) {
    let html = (await axios.get(`https://www.google.com/search?q=${encodeURIComponent('jarak ' + dari + ' ke ' + ke)}&hl=id`)).data
    let $ = cheerio.load(html)
    let result = {}
    let img = html.split("var s='")?.[1]?.split("'")?.[0]
    result.img = /^data:.*?\/.*?;base64,/i.test(img) ? Buffer.from(img.split(',')[1], 'base64') : ''
    result.desc = $('div.BNeawe.deIvCb.AP7Wnd').first().text()?.trim()
    return result
}
    
const qkontak = {
key: {
participant: `0@s.whatsapp.net`,
...(botNumber ? {
remoteJid: `status@broadcast`
} : {})
},
message: {
'contactMessage': {
'displayName': global.wm,
'vcard': `BEGIN:VCARD\nVERSION:3.0\nN:XL;ttname,;;;\nFN:ttname\nitem1.TEL;waid=6287722616127\nitem1.X-ABLabel:Ponsel\nEND:VCARD`,
sendEphemeral: true
}}
}

const func = {};
func.fstatus = (text = '') => ({
key: {
fromMe: false,
participant: '0@s.whatsapp.net',
...(m.chat ? { remoteJid: 'status@broadcast' } : {})
},
message: {
extendedTextMessage: {
text: text
}
}
});
    
func.formatNumber = (integer) => {
    let numb = parseInt(integer)
    return Number(numb).toLocaleString().replace(/,/g, '.')
}
    
func.texted = (type, text) => {
    if (type === 'bold') {
        return '*' + text + '*'
    } else if (type === 'italic') {
        return '_' + text + '_'
    } else if (type === 'monospace') {
        return '```' + text + '```'
    } else {
        return text
    }
}

func.delay = (ms) => {
    return new Promise(res => setTimeout(res, ms))
}

func.example = (cmd, usage) => `_Example :_  ${pripek}${cmd} ${usage}`;
    
func.clockString = (ms) => {
  if (typeof ms !== 'number') return '--:--:--';
  const h = Math.floor(ms / 3600000);
  const m = Math.floor((ms % 3600000) / 60000);
  const s = Math.floor((ms % 60000) / 1000);
  return [h, m, s].map(v => v.toString().padStart(2, '0')).join(':');
};

func.fileSize = (bytes) => {
  const units = ['B', 'KB', 'MB', 'GB', 'TB'];
  let i = 0;
  while (bytes >= 1024 && i < units.length - 1) {
    bytes /= 1024;
    i++;
  }
  return `${bytes.toFixed(1)} ${units[i]}`;
};
    
func.filename = (ext) => {
    return `${Math.floor(Math.random() * 10000)}.${ext}`
}

func.jsonformat = (string) => {
    return JSON.stringify(string, null, 2)
}

func.runtime = function(seconds) {
    seconds = Number(seconds);
    var d = Math.floor(seconds / (3600 * 24));
    var h = Math.floor(seconds % (3600 * 24) / 3600);
    var m = Math.floor(seconds % 3600 / 60);
    var s = Math.floor(seconds % 60);
    var dDisplay = d > 0 ? d + (d == 1 ? ' hari, ' : ' hari, ') : '';
    var hDisplay = h > 0 ? h + (h == 1 ? ' jam, ' : ' jam, ') : '';
    var mDisplay = m > 0 ? m + (m == 1 ? ' menit, ' : ' menit, ') : '';
    var sDisplay = s > 0 ? s + (s == 1 ? ' detik' : ' detik') : '';
    return dDisplay + hDisplay + mDisplay + sDisplay;
}

func.arrayJoin = (arr) => {
    var construct = []
    for (var i = 0; i < arr.length; i++) construct = construct.concat(arr[i])
    return construct
}
    
func.color = (text, color) => {
    const chalk = require('chalk')
    return chalk.keyword(color || 'green').bold(text)}

func.fetchJson = async (url, options = {}) => {
    try {
        const res = await axios({
            method: 'GET',
            url: url,
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/95.0.4638.69 Safari/537.36'
            },
            ...options
        })
        return res.data
    } catch (err) {
        return err
    }
}

func.isUrl = (url) => {
    return url.match(new RegExp(/https?:\/\/(www\.)?[-a-zA-Z0-9@:%.+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%+.~#?&/=]*)/, 'gi'))
}

func.bgcolor = (text, bgcolor) => {
    const chalk = require('chalk')
    return !bgcolor ? chalk.green(text) : chalk.bgKeyword(bgcolor)(text)}

const ownerDispley = Array.isArray(global.ownername) ? global.ownername.join(' x ') : global.ownername;
    
const qtext = { key: { participant: '0@s.whatsapp.net', remoteJid: m.chat ? m.chat : 'status@broadcast'}, message: { locationMessage: { name: `ɴᴀᴍᴇ: ${pushname}
⌥ ᴄᴍᴅ: ${cmd.toUpperCase()}`, jpegThumbnail: "",}}};

const fkon = {key:{participant:m.sender,...(m.chat?{remoteJid:m.chat}:{})},message:{contactMessage:{displayName:pushname,vcard:`BEGIN:VCARD\nVERSION:3.0\nN:XL;ttname,;;;\nFN:ttname\nitem1.TEL;waid=0\nitem1.X-ABLabel:Ponsel\nEND:VCARD`,jpegThumbnail:global.thumb,thumbnail:global.thumb,sendEphemeral:true}}};

const loc = { key: { participant: '0@s.whatsapp.net', remoteJid: m.chat ? m.chat : 'status@broadcast'}, message: { locationMessage: { name: global.wm, jpegThumbnail: "",}}};
    
const loc2 = {key: {participant: '0@s.whatsapp.net', ...(m.chat ? {remoteJid: `status@broadcast`} : {})}, message: {locationMessage: {name: global.wm,jpegThumbnail: ""}}}

const qgif = {key: {participant: `0@s.whatsapp.net`, ...(m.chat ? { remoteJid: "status@broadcast" } : {})},message: {"videoMessage": { "title":global.botname, "h": global.wm,'seconds': '359996400', 'gifPlayback': 'true', 'caption': ownerDispley, 'jpegThumbnail': global.thumb}}}

const qdoc = {key : {participant : '0@s.whatsapp.net', ...(m.chat ? { remoteJid: `status@broadcast` } : {}) },message: {documentMessage: {title: global.wm, jpegThumbnail: ""}}}

const qgclink = {key: {participant: "0@s.whatsapp.net","remoteJid": "0@s.whatsapp.net"},"message": {"groupInviteMessage": {"groupJid": "6282245682288-1616169743@g.us","inviteCode": "m","groupName": global.wm, "caption": `${pushname}`, 'jpegThumbnail': global.thumb}}}

const qvideo = {key: { fromMe: false,participant: `0@s.whatsapp.net`, ...(m.chat ? { remoteJid: "status@broadcast" } : {}) },message: { "videoMessage": { "title":global.botname, "h": global.wm,'seconds': '359996400', 'caption': `${pushname}`, 'jpegThumbnail': global.thumb}}}

const qpay = {key: {remoteJid: '0@s.whatsapp.net', fromMe: false, id: `${global.botname}`, participant: '0@s.whatsapp.net'}, message: {requestPaymentMessage: {currencyCodeIso4217: "USD", amount1000: 999999999, requestFrom: '0@s.whatsapp.net', noteMessage: { extendedTextMessage: { text: `${global.wm}`}}, expiryTimestamp: 999999999, amount: {value: 91929291929, offset: 1000, currencyCode: "USD"}}}}

const qtoko = {key: {fromMe: false, participant: `0@s.whatsapp.net`, ...(m.chat ? {remoteJid: "status@broadcast"} : {})}, message: {"productMessage": {"product": {"productImage": {"mimetype": "image/jpeg", "jpegThumbnail": ""}, "title": `${global.botname} - Marketplace`, "description": null, "currencyCode": "IDR", "priceAmount1000": "999999999999999", "retailerId": `${global.wm}`, "productImageCount": 1}, "businessOwnerJid": `0@s.whatsapp.net`}}}

const qlive = {key: {participant: '0@s.whatsapp.net', ...(m.chat ? {remoteJid: `status@broadcast`} : {})}, message: {liveLocationMessage: {caption: `${global.wm}`,jpegThumbnail: ""}}}

const apikey = global.apikey;
const capikey = global.capikey;
const domain = global.domain;
    
function applyWatermarkVars(str, name = 'User') {
  const moment = require('moment-timezone');
  const hari = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
  const bulan = [
    'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
    'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
  ];
  const now = new Date();
  const week = hari[now.getDay()];
  const date = `${now.getDate()} ${bulan[now.getMonth()]} ${now.getFullYear()}`;
  const time = moment.tz('Asia/Jakarta').format('HH:mm:ss') + ' WIB';
  
  return str
    ?.replace(/\+week/gi, week)
    ?.replace(/\+date/gi, date)
    ?.replace(/\+time/gi, time)
    ?.replace(/\+name/gi, name);
}
    
async function cekerror(erlic, m, error, name = 'Unknown') {
  try {
    if (error?.name) {
      const owners = Array.isArray(global.owner) ? global.owner : [global.owner];
      for (let owner of owners) {
        let id = owner.replace(/[^0-9]/g, '') + '@s.whatsapp.net';
        let [jid] = await erlic.onWhatsApp(id);
        if (!jid?.exists) continue;

        let caption = `*– 乂 ERROR DETECTED 📉*\n`;
        caption += `> *Command:* ${m.command || 'Unknown'}\n`;
        caption += `> *File:* ${name}\n\n`;
        caption += `${func.jsonFormat(error)}`;

        await erlic.sendMessage(id, { text: caption });
      }

      m.reply(`*– 乂 ERROR DETECTED 📉*\n\n> Command gagal dijalankan karena terjadi error.\n> Laporan telah dikirim ke owner dan akan segera diperbaiki.`);
    } else {
      m.reply(func.jsonFormat(error));
    }
  } catch (err) {
    console.error('❌ Error in cekerror:', err);
    m.reply('Terjadi kesalahan saat mengirim laporan error.');
  }
}
    
const menuPath = './database/menu.json';
if (!fs.existsSync(menuPath)) fs.writeFileSync(menuPath, '[]');

function addFiturToMenu(kategori, fiturList) {
  let data = JSON.parse(fs.readFileSync(menuPath));
  let index = data.findIndex(obj => obj[kategori]);
  if (index !== -1) {
    data[index][kategori] = [...new Set([...data[index][kategori], ...fiturList])];
  } else {
    data.push({ [kategori]: fiturList });
  }
  fs.writeFileSync(menuPath, JSON.stringify(data, null, 2));
}
function deleteFiturFromMenu(kategori, fiturList) {
  let data = JSON.parse(fs.readFileSync(menuPath));
  let index = data.findIndex(obj => obj[kategori]);
  if (index !== -1) {
    data[index][kategori] = data[index][kategori].filter(fitur => !fiturList.includes(fitur));
    if (data[index][kategori].length === 0) {
      data.splice(index, 1);
    }
    fs.writeFileSync(menuPath, JSON.stringify(data, null, 2));
    return true;
  }
  return false;
}
    
function applyWatermarkVars(str, name = 'User') {
  const moment = require('moment-timezone');
  const hari = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
  const bulan = [
    'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
    'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
  ];
  const now = new Date();
  const week = hari[now.getDay()];
  const date = `${now.getDate()} ${bulan[now.getMonth()]} ${now.getFullYear()}`;
  const time = moment.tz('Asia/Jakarta').format('HH:mm:ss') + ' WIB';
  return str
    ?.replace(/\+week/gi, week)
    ?.replace(/\+date/gi, date)
    ?.replace(/\+time/gi, time)
    ?.replace(/\+name/gi, name);
}
    
function isCmdBlocked(command, sender) {
  const blocked = JSON.parse(fs.readFileSync('./database/blockcmd.json'));
  const formatJid = jid => jid.includes('@') ? jid : jid + '@s.whatsapp.net';
  const isOwner = global.owner.some(own => formatJid(own) === sender);
  const isDev = global.developer.some(dev => formatJid(dev) === sender);

  if (isOwner || isDev) return false;

  return blocked.includes(command);
}
if (isCmdBlocked(command, m.sender)) return m.reply(mess.blockcmd);
    
function getFolderSize(folderPath) {
  const fs = require('fs');
  let totalSize = 0;
  if (fs.existsSync(folderPath)) {
    const files = fs.readdirSync(folderPath);
    for (const file of files) {
      const stats = fs.statSync(`${folderPath}/${file}`);
      totalSize += stats.size;
    }
  }
  return totalSize;
}
    
async function checkBlacklist(m, sender, isGroup) {
  if (!m.isGroup) return false;

  const fs = require('fs');
  const path = require('path');
  const blacklistPath = path.join(__dirname, './database/blacklist.json');
  const number = sender.replace(/[^0-9]/g, '') + '@s.whatsapp.net';
  if (!fs.existsSync(blacklistPath)) return false;
  const data = JSON.parse(fs.readFileSync(blacklistPath));
  const groupData = data.find(g => g.jid === m.chat);
  if (!groupData || !groupData.blacklist.includes(number)) return false;
  const metadata = await erlic.groupMetadata(m.chat);
  const botNumber = await erlic.decodeJid(erlic.user.id);
  const isBotAdmin = metadata.participants.some(p => p.id === botNumber && p.admin !== null);
  if (!isBotAdmin) return true;
  await erlic.sendMessage(m.chat, {
    text: `Sorry @${number}, you have been blacklisted from this group.`,
    mentions: [sender]
  });
  try {
    await erlic.groupParticipantsUpdate(m.chat, [sender], 'remove');
  } catch (err) {
  }
  return true;
}

function isBanned(id) {
  const banned = JSON.parse(fs.readFileSync('./database/banned.json'));
  const user = banned.find(u => u.id === id);
  if (!user) return false;
  if (user.until === -1) return true;
  return Date.now() < user.until;
}

if (!isCreator && isBanned(m.sender) && !['owner'].includes(command)) {
  const banned = JSON.parse(fs.readFileSync('./database/banned.json'));
  const user = banned.find(u => u.id === m.sender);
  let untilText = 'UNKNOWN';
  if (user) {
    if (user.until === -1) {
      untilText = 'PERMANENT';
    } else {
      let diff = user.until - Date.now();
      if (diff < 0) diff = 0;
      const totalSeconds = Math.floor(diff / 1000);
      const hours = String(Math.floor(totalSeconds / 3600)).padStart(2, '0');
      const minutes = String(Math.floor((totalSeconds % 3600) / 60)).padStart(2, '0');
      const seconds = String(totalSeconds % 60).padStart(2, '0');
      untilText = `${hours}:${minutes}:${seconds}`;
    }
  }
  return erlic.sendMessage(m.chat, {
    text: `Maaf kamu sedang dibanned.\nBerakhir: *${untilText}*`
  }, { quoted: m });
}
const listidch = JSON.parse(fs.readFileSync('./database/erlicch.json'));
    
function isPublicModeAllowed(command, sender) {
  const formatJid = jid => jid.includes('@') ? jid : jid + '@s.whatsapp.net';
  
  const isCreator = global.owner.some(own => formatJid(own) === sender);
  const isDev = global.developer.some(dev => formatJid(dev) === sender);
  const isOwnat = global.prems.some(prem => formatJid(prem) === sender);
  if (isCreator || isDev || isBot || isOwnat) return true;
  if (erlic.public) return true;
    
  return false;
}
if (!isPublicModeAllowed(command, m.sender)) {
  return
    }
const argsbiyuoffc = body.trim().split(/ +/).slice(1)

if (await checkBlacklist(m, sender, m.isGroup)) return;
    
const checkServerExpiry=async(erlic)=>{const fs=require('fs');const path=require('path');const moment=require('moment');const axios=require('axios');const panelFile=path.join(__dirname,'./database/panel.json');if(!fs.existsSync(panelFile))return;const rawData=fs.readFileSync(panelFile);const serverData=JSON.parse(rawData);for(let i=0;i<serverData.length;i++){const s=serverData[i].server;const expire=moment(s.expire,'YYYY-MM-DD');const now=moment();const diffDays=expire.diff(now,'days');if(diffDays===3){await erlic.sendMessage(serverData[i].jid,{text:`Your server (${s.username}) will expire in 3 days.`});}else if(diffDays<=0){await erlic.sendMessage(serverData[i].jid,{text:`Your server (${s.username}) has expired and the server has been suspended.`});try{await axios.post(`${global.domain}/api/application/servers/${s.id}/suspend`,{},{headers:{Accept:"application/json","Content-Type":"application/json",Authorization:`Bearer ${global.apikey}`}});}catch(e){console.log('Failed to suspend server:',e.message);}}}};setInterval(async()=>{try{await checkServerExpiry(erlic);}catch(e){console.error('Error during panel expiry check:',e.message);}},60*60*1000);
    
if (isAutobio) {
    const ownerDisplaay = Array.isArray(global.ownername) ? global.ownername.join(' x ') : global.ownername;
    let _uptime = process.uptime() * 1000;
    let uptime = clockString(_uptime);
    await erlic.updateProfileStatus(`I am ${global.botname} by ${ownerDisplaay} | Active for ${uptime} | Mode: ${erlic.public ? 'Public-Mode' : 'Self-Mode'}`).catch(_ => _);
}

if (isAutoread && !m.isGroup && (m.mtype === 'conversation' || m.mtype === 'extendedTextMessage' || m.type === 'status@broadcast')) {
  erlic.readMessages([m.key]);
}
    
const delay = ms => new Promise(res => setTimeout(res, ms))
if ((body.startsWith(prefix) || body.startsWith(pripek))) {
  erlic.sendPresenceUpdate(global.online ? 'available' : 'unavailable', m.chat)
  if (!m.isGroup) {
    if (global.autotyping && !m.fromMe && !isBot && cmd && command) {
      erlic.sendPresenceUpdate('composing', m.chat)
      await delay(825)
      erlic.sendPresenceUpdate('paused', m.chat)
    }
    if (global.autorecord && !m.fromMe && !isBot && cmd && command) {
      erlic.sendPresenceUpdate('recording', m.chat)
      await delay(2000)
      erlic.sendPresenceUpdate('paused', m.chat)
    }
  }
}
    
if (global.antispam && !m.isGroup && !m.fromMe && !isCreator && cmd && command) {
  const fs = require('fs');
  const cooldown = global.cooldown || 5;
  const spamFile = './database/spam.json';
  if (!fs.existsSync(spamFile)) fs.writeFileSync(spamFile, '{}');
  let userSpam = JSON.parse(fs.readFileSync(spamFile));

  if (!userSpam[m.sender]) {
    userSpam[m.sender] = {
      lastCommand: Date.now(),
      spamCount: 0,
    };
  }

  const now = Date.now();
  const timeDiff = (now - userSpam[m.sender].lastCommand) / 1000;

  if (timeDiff < cooldown) {
    userSpam[m.sender].spamCount++;
    await erlic.sendMessage(m.chat, { text: `System detects you are spamming, cooldown for ${cooldown} seconds.`},{ quoted: m});
    
    userSpam[m.sender].lastCommand = now;
    fs.writeFileSync(spamFile, JSON.stringify(userSpam, null, 2));
    
    if (userSpam[m.sender].spamCount >= 3) {
      await erlic.sendMessage(m.chat, { text: `You spam and make the bot delay, you will be banned.`},{ quoted: func.fstatus('System Notification')});
      
      const bannedFile = './database/banned.json';
      if (!fs.existsSync(bannedFile)) fs.writeFileSync(bannedFile, '[]');
      let banned = JSON.parse(fs.readFileSync(bannedFile));
      
      const index = banned.findIndex(entry => entry.id === m.sender);
      if (index !== -1) {
        banned[index].until = -1;
      } else {
        banned.push({ id: m.sender, until: -1 });
      }
      
      fs.writeFileSync(bannedFile, JSON.stringify(banned, null, 2));
    }
    
    return;
  } else {
    userSpam[m.sender].spamCount = 0;
  }

  userSpam[m.sender].lastCommand = now;
  fs.writeFileSync(spamFile, JSON.stringify(userSpam, null, 2));
}
    
if(global.gconly){let metadata=await erlic.groupMetadata('120363402179434849@g.us');if(!isCreator&&!isPrem&&!m.isPrem&&command&&!m.isGroup&&!m.fromMe&&!isBot&&!['owner','sticker','s','stiker','menu'].includes(command)&&!metadata.participants.some(v=>v.id===m.sender))return erlic.sendMessage(m.chat,{text:mess.gconly,linkPreview:false,contextInfo:{externalAdReply:{title:'A C C E S S - D E N I E D',body:global.header,thumbnailUrl:'https://telegra.ph/file/0b32e0a0bb3b81fef9838.jpg',sourceUrl:global.link,mediaType:1,renderLargerThumbnail:true,showAdAttribution:false}}},{quoted:func.fstatus('System Notification')})}
   
function checkCommandTypo(command, budy, m, prefix) { try { const fs = require('fs'), path = require('path'), similarity = require('similarity'); let menuCommands = []; try { const menuData = JSON.parse(fs.readFileSync(path.join(__dirname, './database/menu.json'))); menuCommands = Object.values(menuData).flatMap(obj => Object.values(obj).flat()).map(cmd => cmd.toLowerCase()); } catch (e) { console.warn(e); } let erlicCases = []; try { const erlicPath = path.join(__dirname, 'erlic.js'), content = fs.readFileSync(erlicPath, 'utf-8'), caseRegex = /case\s+['"`](.+?)['"`]\s*:/g; let match; while ((match = caseRegex.exec(content)) !== null) erlicCases.push(match[1].toLowerCase()); } catch (e) { console.warn(e); } const help = [...new Set([...menuCommands, ...erlicCases])]; if (help.includes(command) || /^\$|>|\bx\b/i.test(budy)) return; const ranked = help.map(cmd => ({ cmd, sim: similarity(command, cmd) })).filter(v => v.sim >= 0.5 && v.sim <= 0.9).sort((a, b) => b.sim - a.sim); const typedPrefix = budy.slice(0, 1); if (ranked.length && /^[^a-zA-Z0-9]/.test(budy) && !m.fromMe && !isBot && !ranked.some(item => item.cmd === command.toLowerCase())) m.reply(`Command tidak ditemukan, mungkin maksud kamu:\n\n${ranked.map(v => `➠ *${typedPrefix}${v.cmd}* (${(v.sim * 100).toFixed(1)}%)`).join('\n')}`); } catch (e) { console.error(e); } }
checkCommandTypo(command, budy, m, prefix);

switch(command) {
case `${global.botname}`: case "help": case "menu": {
  await erlic.sendMessage(m.chat, { react: { text: '🕒', key: m.key } });
  const { performance } = require('perf_hooks');
  let timestamp = performance.now();
  let latensi = performance.now() - timestamp;
  let respon = latensi.toFixed(4);
  let ppuser = global.thumb
  const fs = require('fs');
  const { styles } = require('./system/font.js');
  const path = './database/menu.json';
  const menu = JSON.parse(fs.readFileSync(path));
  const formatCategory = (text) => text.toUpperCase().split('').join(' ');
  const formatCommands = (cmds) => cmds.sort().map(cmd => `◦ ${pripek}${cmd}`).join('\n');
  const categoriesMap = {};
  menu.forEach(obj => {
    const [category, commands] = Object.entries(obj)[0];
    categoriesMap[category.toLowerCase()] = commands;
  });
  const selectedCategory = args.join(' ')?.toLowerCase();
  const pkg = require('./package.json');
const totalFitur = menu.reduce((total, obj) => total + Object.values(obj)[0].length, 0);
const usedMem = func.fileSize(process.memoryUsage().rss);
const maxMem = (process.env.SERVER_MEMORY && process.env.SERVER_MEMORY != 0) ? `${process.env.SERVER_MEMORY} MB` : '∞';
const ownerDisplay = Array.isArray(global.ownername) ? global.ownername.join(' x ') : global.ownername;
const header = `Hallo ${pushname} 👋🏻\nSaya adalah sistem otomatis berbasis WhatsApp yang dirancang oleh *${capital(ownerDisplay)}* untuk membantu berbagai kebutuhan hanya melalui chat.\n\n- *Library* : @whiskeysockets/baileys\n- *Version* : ${pkg.name}-md v${pkg.version}\n- *Total Fitur* : ${totalFitur}\n- *Memory Used* : ${usedMem} / ${maxMem}\n- *Platform* : ${process.platform} ${process.arch}\n- *Hostname* : ${process.env.HOSTNAME ?? '-'}\n\nJika kamu menemukan error atau ingin upgrade ke *Premium*, silakan hubungi owner.\n\n━━━━━━━━━━━━━━━`;
  let replyText = '';
  if (!selectedCategory) {
    const sortedCategories = Object.keys(categoriesMap).sort();
    const lines = sortedCategories.map((cat, i, arr) => {
      const menus = i === 0 ? '┌' : (i === arr.length - 1 ? '│' : '│');
      return `${menus}  ◦ ${pripek}${command} ${cat}`;
    });
    lines.push(`└  ◦ ${pripek}${command} all`);
    replyText = `${header}\n\n${lines.join('\n')}\n\n━━━━━━━━━━━━━━━━━━━━━━\n${global.footer}`;
  } else if (selectedCategory === 'all') {
    const sortedMenu = Object.entries(categoriesMap)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([cat, cmds]) => `\n乂  *${formatCategory(cat)}*\n\n${formatCommands(cmds)}`)
      .join('\n');
    replyText = `${header}\n${sortedMenu}\n\n━━━━━━━━━━━━━━━━━━━━━━\n${global.footer}`;
  } else if (selectedCategory === 'all') {
    const sortedMenu = Object.entries(categoriesMap)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([cat, cmds]) => `\n乂  *${formatCategory(cat)}*\n\n${formatCommands(cmds)}`)
      .join('\n');
    replyText = `${header}\n${sortedMenu}\n\n━━━━━━━━━━━━━━━━━━━━━━\n${global.footer}`;
  } else if (categoriesMap[selectedCategory]) {
    const cmds = categoriesMap[selectedCategory];
    const formatted = formatCommands(cmds);
    replyText = `乂  *${formatCategory(selectedCategory)}*\n\n${formatted}`;
  } else {
    m.reply(`Kategori *${selectedCategory}* tidak ditemukan.`);
  }
  const styledText = styles(replyText, global.font);
  let masthan = await erlic.sendMessage(m.chat, {
  text: styledText,
  contextInfo: {
    isForwarded: true,
    forwardingScore: 999,
    mentionedJid: [m.sender],
    forwardedNewsletterMessageInfo: {
      newsletterJid: global.idSaluran,
      newsletterName: `Ping: ${respon} • ` + global.wm
    },
    externalAdReply: {
      title: global.header,
      body: global.footer,
      thumbnailUrl: ppuser,
      sourceUrl: global.link,
      mediaType: 1,
      renderLargerThumbnail: true,
      showAdAttribution: true
    }
  }
}, { quoted: qtext });
if (selectedCategory === 'all') {
  await erlic.sendMessage(m.chat, {
    audio: { url: global.sound },
    mimetype: 'audio/mpeg',
    ptt: true
  }, { quoted: masthan });
}
}
break
        
case 'sampah': {
  if (!isCreator) return m.reply(mess.owner);
  const folder = './sampah';
  const path = require('path');
  const fs = require('fs');
  fs.readdir(folder, async (err, files) => {
    if (err) return m.reply(func.jsonFormat(err));
    if (files.length === 0) return m.reply('Trash empty.');
    let list = files.map((file, i) => `${i + 1}. ${file}`).join('\n');
    let txt = `乂 *SAMPAH SYSTEM*\n\nTotal sampah: ${files.length} file\n\n${list}`;
    await erlic.sendMessage(m.chat, {
      text: txt,
      mentions: erlic.ments ? erlic.ments(txt) : []
    }, { quoted: m, ephemeralExpiration: m.expiration });
  });
}
break;
        
case 'getmodule': {if (!isCreator) return m.reply(mess.owner); const archiver = require('archiver'), fs = require('fs'); if (!text) return m.reply(func.example(cmd, 'axios')); const [name] = args || []; if (!name) return m.reply('Nama modul kosong.'); if (fs.existsSync('./node_modules/' + name)) { erlic.sendMessage(m.chat, { react: { text: '🕒', key: m.key } }); await (async function archiveFolders(moduleName) { const backupName = moduleName + '.zip', output = fs.createWriteStream(backupName), archive = archiver('zip'); output.on('close', async () => { const caption = `Archive selesai!\nTotal ukuran: ${(archive.pointer() / 1024 / 1024).toFixed(2)} MB.`; await erlic.sendMessage(m.chat, { document: { url: `./${backupName}` }, caption, mimetype: 'application/zip', fileName: backupName }, { quoted: m, ephemeralExpiration: m.expiration }).then(() => fs.unlinkSync(backupName)); }); archive.on('error', e => { console.error(e); m.reply(e.message); }); archive.pipe(output); archive.directory('./node_modules/' + moduleName + '/', moduleName); await archive.finalize(); })(name).catch(e => m.reply(e.message)); } else m.reply('Modul tersebut tidak ditemukan!'); } break;
        
case 'cekip': { if (!text) return m.reply(`Example: ${prefix + command} panelku-jasteb.my.id`); let domain = text.replace(/https?:\/\//gi, '').trim(); require('dns').lookup(domain, (err, address) => { if (err || !address) return m.reply(`Failed to resolve IP for ${domain}`); m.reply(`Domain: ${domain}\nIP Address: ${address}`); }); } break;
        
case 'tomediafire': case 'tomf': case 'to-mf': {
  try {
    // React 🕒
    await erlic.sendMessage(m.chat, {
      react: {
        text: '🕒',
        key: m.key,
      }
    });

    let q = m.quoted ? m.quoted : m
    let mime = (q.msg || q).mimetype || ''
    if (!mime) return m.reply('Silakan kirim atau reply *media* (foto, video, audio, dokumen) untuk diupload.')

    let media = await q.download()
    let ext = mime.split('/')[1].split(';')[0] || 'bin'
    let file = `./sampah/uploadedfile.${ext}`
    fs.writeFileSync(file, media)

    let form = new FormData()
    form.append('file', fs.createReadStream(file))

    let { data } = await axios.post('https://fgsi1-restapi.hf.space/api/upload/uploadMediaFire', form, {
      headers: form.getHeaders()
    })

    let d = data.data
    let text = `乂 *UPLOADER - MEDIAFIRE*\n\n- Nama File : ${d.filename}\n- Ukuran : ${d.size} byte\n- Tipe : ${d.mimetype}\n- Uploader : ${d.owner_name}\n- Download : ${d.links.normal_download}`
    await m.reply(text)
  } catch (e) {
    m.reply(`Gagal mengupload: ${e.message}`)
  }
}
break;
        
case 'autotyping': {
    if (!isCreator) return m.reply(mess.owner);
    if (args[0] === 'on') {
        global.autotyping = true;
        m.reply('Successfully changed autotyping to enable.');
    } else if (args[0] === 'off') {
        global.autotyping = false;
        m.reply('Successfully changed autotyping to disable.');
    } else {
        m.reply(`Current status: ${isAutotyping ? 'enable' : 'disable'}\n\nExample: ${pripek + cmd} on/off`);
    }
}
break;
        
case 'autorecord': {
    if (!isCreator) return m.reply(mess.owner);
    if (args[0] === 'on') {
        global.autorecord = true;
        m.reply('Successfully changed autorecord to enable.');
    } else if (args[0] === 'off') {
        global.autorecord = false;
        m.reply('Successfully changed autorecord to disable.');
    } else {
        m.reply(`Current status: ${isAutorecord ? 'enable' : 'disable'}\n\nExample: ${pripek + cmd} on/off`);
    }
}
break;
        
case 'antispam': {
    if (!isCreator) return m.reply(mess.owner);
    if (args[0] === 'on') {
        global.antispam = true;
        m.reply('Successfully changed antispam to enable.');
    } else if (args[0] === 'off') {
        global.antispam = false;
        m.reply('Successfully changed antispam to disable.');
    } else {
        m.reply(`Current status: ${isAntispam ? 'enable' : 'disable'}\n\nExample: ${pripek + cmd} on/off`);
    }
}
break;
        
 case 'gconly': {
    if (!isCreator) return m.reply(mess.owner);
    if (args[0] === 'on') {
        global.gconly = true;
        m.reply('Successfully changed gconly to enable.');
    } else if (args[0] === 'off') {
        global.gconly = false;
        m.reply('Successfully changed gconly to disable.');
    } else {
        m.reply(`Current status: ${isGconly ? 'enable' : 'disable'}\n\nExample: ${pripek + cmd} on/off`);
    }
}
break;
        
case 'online':
case 'offline': {
    if (!isCreator) return m.reply(mess.owner);
    global.online = command === 'online';
    m.reply(`Successfully changed status to ${global.online ? 'online (available)' : 'offline (unavailable)'}.`);
}
break;
        
case 'delsampah': {
  if (!isCreator) return m.reply(mess.owner);
  const folder = './sampah';
  const path = require('path');
  const fs = require('fs');
  fs.readdir(folder, async (err, files) => {
    if (err) return m.reply(func.jsonFormat(err));
    if (files.length === 0) return m.reply('Trash empty.');
    let list = files.map((file, i) => `${i + 1}. ${file}`).join('\n');
    let txt = `乂 *SAMPAH*\n\n${list}`;
    let wait = await erlic.sendMessage(m.chat, {
      text: txt,
      mentions: erlic.ments ? erlic.ments(txt) : []
    }, { quoted: m, ephemeralExpiration: m.expiration });
    setTimeout(() => {
      erlic.sendMessage(m.chat, {
        text: 'Cleaning up trash...',
        edit: wait.key,
        mentions: erlic.ments ? erlic.ments('Cleaning up trash...') : []
      }, { quoted: m, ephemeralExpiration: m.expiration });
    }, 10000);
    setTimeout(() => {
      for (const file of files) {
        fs.unlinkSync(path.join(folder, file));
      }
      erlic.sendMessage(m.chat, {
        text: 'Successfully removed trash.',
        edit: wait.key,
        mentions: erlic.ments ? erlic.ments('Successfully removed trash.') : []
      }, { quoted: m, ephemeralExpiration: m.expiration });
    }, 15000);
  });
}
break;

    case'proses':{if(!isCreator)return m.reply(mess.owner);let raw=text||'';if(!raw&&!m.quoted)return m.reply(func.example(cmd, 'Pulsa,5000,628xxxx'));let[product,nominal,target]=raw.split(',').map(v=>v?.trim()),parsed=parseInt((nominal||'').replace(/[^0-9]/g,''),10);if(!product||isNaN(parsed))return m.reply(func.example(cmd, 'Pulsa,5000,628xxxx'));if(!target&&m.quoted)target=m.quoted.sender?.split('@')[0];if(!target)return m.reply('Target tidak ditemukan.');if(target.startsWith('0'))target='62'+target.slice(1);else if(target.startsWith('+'))target=target.replace('+','');let now=new Date(),tanggal=now.toLocaleDateString('id-ID',{year:'numeric',month:'long',day:'numeric'}),waktu=now.toLocaleTimeString('id-ID',{hour:'2-digit',minute:'2-digit',second:'2-digit'}),teks=`乂 *TRANSACTION ON PROCESS*\n\n- *Product* : _${product}_\n- *Nominal* : _Rp${formatMoney(parsed)}_\n- *Date* : _${tanggal}_\n- *Time* : _${waktu}_ WIB\n- *Status* : On Process 🔄\n\n*PLEASE WAIT PATIENTLY*`;erlic.sendMessage(`${target}@s.whatsapp.net`,{text:teks},{quoted:func.fstatus('System Notification')});erlic.sendMessage(m.chat,{text:'⏳ Status proses telah dikirim!'},{quoted:m})}
break;

    case'done':{if(!isCreator)return m.reply(mess.owner);let raw=text||'';if(!raw&&!m.quoted)return m.reply(func.example(cmd, 'Pulsa,5000,628xxxx'));let[product,nominal,target]=raw.split(',').map(v=>v?.trim()),parsed=parseInt((nominal||'').replace(/[^0-9]/g,''),10);if(!product||isNaN(parsed))return m.reply(func.example(cmd, 'Pulsa,5000,628xxxx'));if(!target&&m.quoted)target=m.quoted.sender?.split('@')[0];if(!target)return m.reply('Target tidak ditemukan.');if(target.startsWith('0'))target='62'+target.slice(1);else if(target.startsWith('+'))target=target.replace('+','');let now=new Date(),tanggal=now.toLocaleDateString('id-ID',{year:'numeric',month:'long',day:'numeric'}),waktu=now.toLocaleTimeString('id-ID',{hour:'2-digit',minute:'2-digit',second:'2-digit'}),teks=`乂 *TRANSACTION SUCCESSFULLY*\n\n- *Product* : _${product}_\n- *Nominal* : _Rp${formatMoney(parsed)}_\n- *Date* : _${tanggal}_\n- *Time* : _${waktu}_ WIB\n- *Status* : Success ✅\n\n*THANK YOU FOR ORDERING*`;erlic.sendMessage(`${target}@s.whatsapp.net`,{text:teks},{quoted:func.fstatus('System Notification')});erlic.sendMessage(m.chat,{text:'✅ Transaksi berhasil dikirim!'},{quoted:m})}
break;
        
case 'public':
case 'self': {
  if (!isCreator) return m.reply(mess.owner)

  const isPublic = command === 'public'
  const mode = isPublic ? 'Public' : 'Self'

  if (erlic.public === isPublic) {
    return m.reply(`Already in mode *${mode}*.`)
  }

  erlic.public = isPublic
  m.reply(`Berhasil mengubah bot ke mode *${mode}*!`)
}
break
        
case 'demote':
case 'dm': {
  if (!m.isGroup) return m.reply(mess.group);
  if (!isBotAdmin) return m.reply(mess.botAdmin);
  if (!isAdmin && !isCreator) return m.reply(mess.admin);

  const target = (
    m.mentionedJid && m.mentionedJid[0] ||
    m.quoted && m.quoted.sender
  );
  if (!target) return m.reply(func.example(cmd, '@tag admin'));

  erlic.groupParticipantsUpdate(m.chat, [target], 'demote')
    .then(() => {
      erlic.sendMessage(m.chat, {
        text: `@${target.split('@')[0]} telah dicopot dari admin.`,
        mentions: [target]
      }, {
        quoted: m,
        ephemeralExpiration: m.expiration
      });
    })
    .catch(e => m.reply(func.jsonFormat(e)));
}
break;
        
case 'status': {
  const axios = require('axios');
  try {
    const res = await axios.get('http://ip-api.com/line');
    m.reply(res.data);
  } catch (err) {
    console.error(err);
    m.reply(mess.error);
  }
}
break;
        
case 'dashboard':case 'dash':{const fs=require('fs'),path=require('path'),axios=require('axios'),moment=require('moment'),dirPath='./database',logPath=`${dirPath}/command-logs.json`,sessionPath='./session',sessionFiles=fs.existsSync(sessionPath)?fs.readdirSync(sessionPath):[],getFolderSize=path=>fs.existsSync(path)?fs.readdirSync(path).reduce((total,file)=>total+fs.statSync(`${path}/${file}`).size,0):0;if(!fs.existsSync(dirPath))fs.mkdirSync(dirPath);if(!fs.existsSync(logPath))fs.writeFileSync(logPath,JSON.stringify([]));const logs=JSON.parse(fs.readFileSync(logPath));let count={};logs.forEach(item=>{count[item.cmd]=count[item.cmd]||{hit:0,lastused:0};count[item.cmd].hit++;if(item.time>(count[item.cmd].lastused||0))count[item.cmd].lastused=item.time;});let topFitur=Object.entries(count).sort((a,b)=>b[1].hit-a[1].hit);const caption=`乂  *DASHBOARD ${global.botname.toUpperCase()} BOT*\n\n⭝ Runtime : ${func.clockString(process.uptime()*1000)}\n⭝ System OS : ${process.platform} ${process.arch}\n⭝ Nodejs Version : ${process.version}\n⭝ Total Session : ${sessionFiles.length} Files\n⭝ Size Session : ${(getFolderSize(sessionPath)/1024).toFixed(2)} KB\n⭝ Size Database : ${(getFolderSize('./database')/1024).toFixed(2)} KB\n⭝ Ram Used Bot : ${(process.memoryUsage().rss/1024/1024).toFixed(2)} MB\n⭝ Max Ram Server : ${process.env.SERVER_MEMORY&&parseInt(process.env.SERVER_MEMORY)>0?process.env.SERVER_MEMORY+' MB':'∞'}\n⭝ Time Server : ${process.env.TZ??'-'}\n⭝ Location Server : ${process.env.P_SERVER_LOCATION??'-'}\n⭝ Total Sampah : ${fs.readdirSync('./sampah').filter(v=>['gif','png','mp3','m4a','opus','mp4','jpg','jpeg','webp','webm'].some(x=>v.endsWith(x))).length} Sampah`;let thumb=null;try{const res=await axios.get(global.thumb,{responseType:'arraybuffer'});thumb=res.data}catch(e){console.error('[ERROR] Thumbnail gagal diambil:',e);}await erlic.sendMessage(m.chat,{text:caption,contextInfo:{externalAdReply:{title:global.header,body:global.footer,sourceUrl:global.link,mediaType:1,renderLargerThumbnail:true,thumbnailUrl:global.thumb,jpegThumbnail:thumb}}},{quoted:m});}break;    
        
case 'promote':
case 'pm': {
  if (!m.isGroup) return m.reply(mess.group);
  if (!isBotAdmin) return m.reply(mess.botAdmin);
  if (!isAdmin && !isCreator) return m.reply(mess.admin);

  const target = (
    m.mentionedJid && m.mentionedJid[0] ||
    m.quoted && m.quoted.sender
  );
  if (!target) return m.reply(func.example(cmd, '@tag member'));

  erlic.groupParticipantsUpdate(m.chat, [target], 'promote')
    .then(() => {
      erlic.sendMessage(m.chat, {
        text: `Sukses menjadikan @${target.split('@')[0]} sebagai admin`,
        mentions: [target]
      }, {
        quoted: m,
        ephemeralExpiration: m.expiration
      });
    })
    .catch(e => m.reply(func.jsonFormat(e)));
}
break;
        
case 'opentime': case 'closetime': { if (!m.isGroup) return m.reply(mess.group); if (!isBotAdmin) return m.reply(mess.botAdmin); if (!isAdmin) return m.reply(mess.admin); if (!text) return m.reply(func.example(cmd, '1m / 2h / 3d')); let time = text.match(/^(\d+)([smhd])$/i); if (!time) return m.reply('Format waktu tidak valid!\nContoh: 10s, 5m, 1h, 2d'); let value = parseInt(time[1]), unit = time[2].toLowerCase(), ms = 0; switch (unit) { case 's': ms = value * 1000; break; case 'm': ms = value * 60 * 1000; break; case 'h': ms = value * 60 * 60 * 1000; break; case 'd': ms = value * 24 * 60 * 60 * 1000; break; } let formatTime = ms => { let t = Math.floor(ms / 1000), h = String(Math.floor(t / 3600)).padStart(2, '0'), m = String(Math.floor((t % 3600) / 60)).padStart(2, '0'), s = String(t % 60).padStart(2, '0'); return `${h}:${m}:${s}`; }; let isOpen = command === 'opentime', action = isOpen ? 'not_announcement' : 'announcement', futureText = isOpen ? 'membuka' : 'menutup', notifyText = isOpen ? 'Bot telah membuka grup ini secara otomatis.' : 'Bot telah menutup grup ini secara otomatis.'; m.reply(`Bot akan ${futureText} grup ini dalam ${formatTime(ms)}.`); setTimeout(async () => { try { await erlic.groupSettingUpdate(m.chat, action); let participants = (await erlic.groupMetadata(m.chat)).participants.map(p => p.id); await erlic.sendMessage(m.chat, { text: notifyText, mentions: participants }, { quoted: func.fstatus('System Notification') }); } catch { await erlic.sendMessage(m.chat, { react: { text: '❌', key: m.key } }); } }, ms); } break;
        
case 'join': {
  if (!isCreator) return m.reply(mess.owner);
  if (!text) return m.reply(func.example(cmd, 'https://chat.whatsapp.com/XXXX'));
  if (!text.includes('chat.whatsapp.com')) return m.reply('Link tidak valid! Pastikan formatnya: https://chat.whatsapp.com/XXXX');
  try {
    const inviteCode = text.split('https://chat.whatsapp.com/')[1].trim();
    if (!inviteCode) return m.reply('Kode undangan tidak ditemukan di link tersebut.');
    const res = await erlic.groupAcceptInvite(inviteCode);
    m.reply(`${String(res)}`);
  } catch (err) {
    console.error(err);
    m.reply(mess.error);
  }
}
break;
        
case 'resetlinkgc': case 'resetlinkgroup': case 'resetlinkgrup': case 'revoke': case 'resetlink': case 'resetgrouplink': case 'resetgclink': case 'resetgruplink': { if (!m.isGroup) return m.reply(mess.group); if (!isBotAdmin) return m.reply(mess.botAdmin); if (!isAdmins && !isCreator) return m.reply(mess.admin); await erlic.groupRevokeInvite(m.chat); let newLink = await erlic.groupInviteCode(m.chat); await erlic.sendMessage(m.chat, { text: `Link grup berhasil diperbarui.\n\n- Link baru:\nhttps://chat.whatsapp.com/${newLink}`, linkPreview: false }, { quoted: m }); } break;
        
case 'leave': {
  if (!isCreator) return m.reply(mess.owner);
  if (!text) return m.reply('Masukkan link atau ID grup!');
  try {
    let groupId;
    if (text.includes('chat.whatsapp.com')) {
      const code = text.split('https://chat.whatsapp.com/')[1]?.trim();
      if (!code) return m.reply('Link grup tidak valid.');
      groupId = await erlic.groupGetInviteInfo(code).then(res => res.id);
    } else {
      groupId = text.trim();
    }
    await erlic.groupLeave(groupId);
    erlic.sendMessage(m.chat, { react: { text: '✅', key: m.key } });
  } catch (err) {
    console.error(err);
    m.reply(mess.error + '\nPastikan bot berada dalam grup.');
  }
}
break;
        
case 'groupset': case 'grup': case 'gc': {
  if (!m.isGroup) return m.reply(mess.group);
  if (!isBotAdmin) return m.reply(mess.botAdmin);
  if (!isAdmin) return m.reply(mess.admin);
  if (!text) return m.reply(func.example(cmd,`open / close`)); 
  let setting = text.toLowerCase();
  if (setting === 'close') {
    await erlic.groupSettingUpdate(m.chat, 'announcement')
      .then(() => erlic.sendMessage(m.chat, { react: { text: '✅', key: m.key } }))
      .catch(() => erlic.sendMessage(m.chat, { react: { text: '❌', key: m.key } }));
  } else if (setting === 'open') {
    await erlic.groupSettingUpdate(m.chat, 'not_announcement')
      .then(() => erlic.sendMessage(m.chat, { react: { text: '✅', key: m.key } }))
      .catch(() => erlic.sendMessage(m.chat, { react: { text: '❌', key: m.key } }));
  } else {
    m.reply(`Pilihan tidak valid!\nGunakan *${prefix + command} open* atau *${prefix + command} close*`);
  }
}
break;
        
case'buypremium':case'buyprem': {try{let payments=[];if(global.dana)payments.push(`• Dana : ${global.dana}`);if(global.ovo)payments.push(`• Ovo : ${global.ovo}`);if(global.gopay)payments.push(`• Gopay : ${global.gopay}`);if(global.seabank)payments.push(`• Seabank : ${global.seabank}`);if(global.shopeepay)payments.push(`• Shopeepay : ${global.shopeepay}`);payments.push('• QRIS (All Payment)');let owners=(global.owner||[]).map((v,i)=>`wa.me/${v.replace(/[^0-9]/g,'')}`).join('\n');let caption=`「 *LIST HARGA PREMIUM* 」\n\n*PAKET P1*\n- Rp5.000 / 7 Day\n- Unlock Feature Premium\n- Unlimited Limit\n\n*PAKET P2*\n- Rp10.000 / 15 Day\n- Unlock Feature Premium\n- Unlimited Limit\n\n*PAKET P3*\n- Rp20.000 / 30 Day\n- Perpanjang Rp15.000 (hemat 25%)\n- Unlock Feature Premium\n- Unlimited Limit\n\n*PAKET P4*\n- Rp30.000 / 60 Day\n- Perpanjang Rp25.000 (hemat 17%)\n- Unlock Feature Premium\n- Unlimited Limit\n\n*PAYMENT*\n${payments.join('\n')}\n\n*INFORMATION*\n1. Melakukan pembelian artinya anda setuju dengan segala kebijakan kami.\n2. Semua pembelian bergaransi.\n3. Tidak puas dengan layanan kami? Kami kembalikan uang Anda 100% dalam jangka waktu 1 jam setelah pembelian.\n4. Jika bot mengalami kendala atau perbaikan hingga 24 jam atau lebih, kami berikan kompensasi berupa penambahan waktu sewa.\n5. Perpanjangan hanya berlaku jika masa aktif tersisa kurang dari 3 hari.\n\nBerminat? Hubungi :\n${owners}`;m.reply(caption);}catch(e){console.error(e);m.reply('An error occurred while generating the premium price list.');}break;}
        
case 'buypanel': {try{let payments=[];if(global.dana)payments.push(`• Dana : ${global.dana}`);if(global.ovo)payments.push(`• Ovo : ${global.ovo}`);if(global.gopay)payments.push(`• Gopay : ${global.gopay}`);if(global.seabank)payments.push(`• Seabank : ${global.seabank}`);if(global.shopeepay)payments.push(`• Shopeepay : ${global.shopeepay}`);payments.push('• QRIS (All Payment)');let owners=(global.owner||[]).map((v,i)=>`wa.me/${v.replace(/[^0-9]/g,'')}`).join('\n');let caption=`「 *LIST PANEL* 」\n\n1. PAKET PN1\nPrice: Rp2.000\nMemory: 1GB\nCPU: 30%\n\n2. PAKET PN2\nPrice: Rp3.000\nMemory: 2GB\nCPU: 50%\n\n3. PAKET PN3\nPrice: Rp4.000\nMemory: 3GB\nCPU: 75%\n\n4. PAKET PN4\nPrice: Rp5.000\nMemory: 4GB\nCPU: 100%\n\n5. PAKET PN5\nPrice: Rp6.000\nMemory: 5GB\nCPU: 125%\n\n6. PAKET PN6\nPrice: Rp7.000\nMemory: 6GB\nCPU: 150%\n\n7. PAKET PN7\nPrice: Rp8.000\nMemory: 7GB\nCPU: 175%\n\n8. PAKET PN8\nPrice: Rp9.000\nMemory: 8GB\nCPU: 200%\n\n9. PAKET PN9\nPrice: Rp10.000\nMemory: 9GB\nCPU: 225%\n\n10. PAKET PN10\nPrice: Rp11.000\nMemory: 10GB\nCPU: 250%\n\n11. PAKET PN11\nPrice: Rp12.000\nMemory: Unlimited\nCPU: Unlimited\n\n12. RESELLER PANEL\nPrice: ~Rp20.000~ Rp15.000\nDuration: PERMANENT\n\n13. ADMIN PANEL\nPrice: ~Rp30.000~ Rp20.000\nDuration: PERMANENT\n\n*Benefits:*\n- Bot run 24 hours\n- Save storage and internet\n- Panel private\n- Under warranty\n- Quality servers\n- Fast respon\n\n*PAYMENT*\n${payments.join('\n')}\n\nBerminat? Hubungi :\n${owners}`;m.reply(caption);}catch(e){console.error(e);m.reply('An error occurred while generating the panel price list.');}break;}
        
case'sewa':case'sewabot': {try{let payments=[];if(global.dana)payments.push(`• Dana : ${global.dana}`);if(global.ovo)payments.push(`• Ovo : ${global.ovo}`);if(global.gopay)payments.push(`• Gopay : ${global.gopay}`);if(global.seabank)payments.push(`• Seabank : ${global.seabank}`);if(global.shopeepay)payments.push(`• Shopeepay : ${global.shopeepay}`);payments.push('• QRIS (All Payment)');let owners=(global.owner||[]).map((v,i)=>`wa.me/${v.replace(/[^0-9]/g,'')}`).join('\n');let caption=`「 *LIST HARGA SEWA BOT* 」\n\n*PAKET S1*\n- Rp15.000 / Group\n- Perpanjang Rp10.000\n- Masa aktif 15 Hari\n\n*PAKET S2*\n- Rp25.000 / Group\n- Perpanjang Rp20.000 (hemat 25%)\n- Masa aktif 1 Bulan\n\n*PAKET S3*\n- Rp40.000 / Group\n- Perpanjang Rp35.000 (hemat 15%)\n- Masa aktif 2 Bulan\n- Anda hemat Rp5.000\n\n*PAKET S4*\n- Rp50.000 / Group\n- Perpanjang Rp45.000 (hemat 10%)\n- Masa aktif 3 Bulan\n- Anda hemat Rp10.000\n\n*KEUNTUNGAN*\n- Fast respon\n- Bot on 24 jam\n- Downloader\n- Ai (artificial intelligence)\n- Dan masih banyak lagi\n\n*PAYMENT*\n${payments.join('\n')}\n\n*INFORMATION*\n1. Melakukan pembelian artinya anda setuju dengan segala kebijakan kami.\n2. Semua pembelian bergaransi.\n3. Tidak puas dengan layanan kami? Kami kembalikan uang Anda 100% dalam jangka waktu 1 jam setelah pembelian.\n4. Jika bot mengalami kendala atau perbaikan hingga 24 jam atau lebih, kami berikan kompensasi berupa penambahan waktu sewa.\n5. Perpanjangan hanya berlaku jika masa aktif tersisa kurang dari 3 hari.\n\nBerminat? Hubungi :\n${owners}`;m.reply(caption);}catch(e){console.error(e);m.reply('An error occurred while generating the rental bot price list.');}break;}
        
case 'asmaulhusna': {
    const axios = require('axios');
    const rawURL = 'https://raw.githubusercontent.com/joo1alaricc/Database/main/asmaulhusna.json';

    try {
        const res = await axios.get(rawURL);
        const data = res.data;

        let number = parseInt(args[0]);

        if (isNaN(number)) {
            let list = `乂  A S M A U L - H U S N A\n\n`;
            list += data.map(e =>
                `${e.index}. ${e.latin} (${e.arabic})\n◦ ID: ${e.translation_id}\n◦ EN: ${e.translation_en}`
            ).join('\n\n');
            m.reply(list);
        } else {
            let found = data.find(e => e.index === number);
            if (!found) return m.reply(`Asmaul Husna nomor ${number} tidak ditemukan.`);

            let msg = `乂  A S M A U L - H U S N A\n\n◦ Index: ${found.index}\n◦ Latin: ${found.latin}\n◦ Arab: ${found.arabic}\n◦ Arti (ID): ${found.translation_id}\n◦ Arti (EN): ${found.translation_en}`;
            m.reply(msg);
        }
    } catch (err) {
        console.error(err);
        m.reply(mess.error);
    }

    break;
}
        
case 'tahlil': { const axios=require('axios'); const rawURL='https://raw.githubusercontent.com/joo1alaricc/Database/main/tahlil.json'; function splitText(txt,max=200){let arr=[];for(let i=0;i<txt.length;i+=max){arr.push(txt.slice(i,i+max));}return arr;} try{const res=await axios.get(rawURL);const data=res.data;let number=parseInt(args[0]);if(isNaN(number)){let list=`乂  T A H L I L - D A F T A R\n\n`;list+=data.map(e=>`${e.id}. ${e.title}`).join('\n');list+=`\n\nKetik ${pripek+command} nomor\nContoh ${pripek+command} 1`;m.reply(list);}else{let found=data.find(e=>e.id===number);if(!found)return m.reply(`Tahlil nomor ${number} tidak ditemukan.`);let caption=`乂  T A H L I L\n\nTitle: ${found.title}\n\n${found.arabic}\n\nTerjemahan:\n${found.translation}`;let msgInfo=await erlic.sendMessage(m.chat,{text:caption},{quoted:m,ephemeralExpiration:m.expiration});let potongan=splitText(found.arabic,200);for(let i=0;i<potongan.length;i++){let url=`https://translate.google.com/translate_tts?ie=UTF-8&q=${encodeURIComponent(potongan[i])}&tl=ar&client=tw-ob`;await erlic.sendMessage(m.chat,{audio:{url},mimetype:'audio/mpeg',ptt:true},{quoted:msgInfo,ephemeralExpiration:m.expiration});}}}catch(err){console.error(err);m.reply(mess.error);} break; }
        
case 'os': {
const os = require("os"); const speed = require("performance-now"); const { exec } = require("child_process"); let timestamp = speed(); exec(`neofetch --stdout`, (error, stdout, stderr) => { let latensi = speed() - timestamp; let child = stdout.toString("utf-8"); let ssd = child.replace(/Memory:/, "Ram:"); let txt = `*CPU* : ${ssd}\n*Speed* : ${latensi.toFixed(4)} MS\n*Memory* : ${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)}MB / ${Math.round(os.totalmem() / 1024 / 1024)}MB\n*OS* : ${os.version()}\n*Platform* : ${os.platform()}\n*Hostname* : ${os.hostname()}`; m.reply(txt); }); } break;
        
case 'ayatkursi': { const axios=require('axios'); const rawURL='https://raw.githubusercontent.com/joo1alaricc/Database/main/ayatkursi.json'; function splitText(txt,max=200){let arr=[];for(let i=0;i<txt.length;i+=max){arr.push(txt.slice(i,i+max));}return arr;} try{const res=await axios.get(rawURL);const data=res.data;let caption=`乂  A Y A T - K U R S I\n\n${data.arab}\n\nLatin:\n${data.latin}\n\nArti:\n${data.arti}`;let msgInfo=await erlic.sendMessage(m.chat,{text:caption},{quoted:m,ephemeralExpiration:m.expiration});let potongan=splitText(data.arab,200);for(let i=0;i<potongan.length;i++){let url=`https://translate.google.com/translate_tts?ie=UTF-8&q=${encodeURIComponent(potongan[i])}&tl=ar&client=tw-ob`;await erlic.sendMessage(m.chat,{audio:{url},mimetype:'audio/mpeg',ptt:true},{quoted:msgInfo,ephemeralExpiration:m.expiration});}}catch(err){console.error(err);m.reply(mess.error);} break; }
        
case 'bacaansholat': { const axios=require('axios'); const rawURL='https://raw.githubusercontent.com/joo1alaricc/Database/main/bacaansholat.json'; function splitText(txt,max=200){let arr=[];for(let i=0;i<txt.length;i+=max){arr.push(txt.slice(i,i+max));}return arr;} try{const res=await axios.get(rawURL);const data=res.data;let number=parseInt(args[0]);if(isNaN(number)){let list=`乂  B A C A A N - S H O L A T\n\n`;list+=data.map(e=>`${e.id}. ${e.name}`).join('\n');list+=`\n\nKetik ${pripek+command} nomor\nContoh ${pripek+command} 1`;m.reply(list);}else{let found=data.find(e=>e.id===number);if(!found)return m.reply(`Bacaan Sholat nomor ${number} tidak ditemukan.`);let caption=`乂  B A C A A N - S H O L A T\n\nNama: ${found.name}\n\n${found.arabic}\n\nLatin:\n${found.latin}\n\nTerjemahan:\n${found.terjemahan}`;let msgInfo=await erlic.sendMessage(m.chat,{text:caption},{quoted:m,ephemeralExpiration:m.expiration});let potongan=splitText(found.arabic,200);for(let i=0;i<potongan.length;i++){let url=`https://translate.google.com/translate_tts?ie=UTF-8&q=${encodeURIComponent(potongan[i])}&tl=ar&client=tw-ob`;await erlic.sendMessage(m.chat,{audio:{url},mimetype:'audio/mpeg',ptt:true},{quoted:msgInfo,ephemeralExpiration:m.expiration});}}}catch(err){console.error(err);m.reply(mess.error);} break; }
        
case 'niatsholat': { const axios = require('axios'); const rawURL = 'https://raw.githubusercontent.com/joo1alaricc/Database/main/niatsholat.json'; function splitText(txt, max = 200) { let arr = []; for (let i = 0; i < txt.length; i += max) arr.push(txt.slice(i, i + max)); return arr; } try { const res = await axios.get(rawURL); let data = res.data; if (!Array.isArray(data)) return m.reply('Data tidak valid.'); let number = parseInt(args[0]); if (isNaN(number)) { let list = `乂  N I A T - S H O L A T\n\n`; list += data.sort((a, b) => a.index - b.index).map(e => `${e.index}. Sholat ${e.solat}`).join('\n'); list += `\n\nKetik ${pripek + command} nomor\nContoh: ${pripek + command} 1`; return m.reply(list); } let found = data.find(e => e.index === number); if (!found) return m.reply(`Niat Sholat nomor ${number} tidak ditemukan.`); let caption = `乂  N I A T - S H O L A T\n\nSholat: ${found.solat}\n\n${found.arabic}\n\nLatin:\n${found.latin}\n\nTerjemahan:\n${found.translation_id}`; let msgInfo = await erlic.sendMessage(m.chat, { text: caption }, { quoted: m, ephemeralExpiration: m.expiration }); let potongan = splitText(found.arabic, 200); for (let i = 0; i < potongan.length; i++) { let url = `https://translate.google.com/translate_tts?ie=UTF-8&q=${encodeURIComponent(potongan[i])}&tl=ar&client=tw-ob`; await erlic.sendMessage(m.chat, { audio: { url }, mimetype: 'audio/mpeg', ptt: true }, { quoted: msgInfo, ephemeralExpiration: m.expiration }); } } catch (err) { console.error(err); m.reply(mess.error); } break; }
        
case 'doaharian': { const axios = require('axios'); const rawURL = 'https://raw.githubusercontent.com/joo1alaricc/Database/main/doaharian.json'; function splitText(txt, max = 200) { let arr = []; for (let i = 0; i < txt.length; i += max) { arr.push(txt.slice(i, i + max)); } return arr; } try { const res = await axios.get(rawURL); let data = res.data; if (!Array.isArray(data)) return m.reply('Data doa harian tidak valid.'); let number = parseInt(args[0]); if (isNaN(number)) { let list = '乂  D O A  -  H A R I A N\n\n'; list += data.map((e, i) => `${i + 1}. ${e.title}`).join('\n'); list += `\n\nKetik ${pripek + command} nomor\nContoh: ${pripek + command} 1`; return m.reply(list); } let found = data[number - 1]; if (!found) return m.reply(`Doa Harian nomor ${number} tidak ditemukan.`); let caption = `乂  D O A  -  H A R I A N\n\n${found.title}\n\n${found.arabic}\n\nLatin:\n${found.latin}\n\nTerjemahan:\n${found.translation}`; let msgInfo = await erlic.sendMessage(m.chat, { text: caption }, { quoted: m, ephemeralExpiration: m.expiration }); let potongan = splitText(found.arabic, 200); for (let i = 0; i < potongan.length; i++) { let url = `https://translate.google.com/translate_tts?ie=UTF-8&q=${encodeURIComponent(potongan[i])}&tl=ar&client=tw-ob`; await erlic.sendMessage(m.chat, { audio: { url }, mimetype: 'audio/mpeg', ptt: true }, { quoted: msgInfo, ephemeralExpiration: m.expiration }); } } catch (err) { console.error(err); m.reply(mess.error); } break; }
        
case 'memory': { 
const memoryUsed = process.env.SERVER_MEMORY !== undefined ? (process.env.SERVER_MEMORY != 0 ? process.env.SERVER_MEMORY + ' MB' : '∞') : '∞'; const txt = `${func.texted('monospace', 'Memory Information')}\n\n${func.texted('monospace', '- Ram Used Bot:')} ${func.texted('bold', func.fileSize(process.memoryUsage().rss))}\n${func.texted('monospace', '- Max Ram Server:')} ${func.texted('bold', memoryUsed)}`; m.reply(txt); } break;
        
case 'getkbbi': case 'kbbi': {
  if (!text) return m.reply(func.example(cmd, 'ng'));
  const kata = text.trim();
  try {
    const axios = require('axios');
    const res = await axios.get('https://raw.githubusercontent.com/Jabalsurya2105/database/master/games/kbbi.json');
    const json = res.data;
    const result = json
      .filter(item => typeof item === 'string' && item.toLowerCase().startsWith(kata.toLowerCase()));
    if (result.length < 1) return m.reply('Tidak ditemukan kata yang cocok.');
    const words = result
      .sort((a, b) => a.localeCompare(b))
      .map((item, i) => `${i + 1}. ${item}`)
      .join('\n');
    m.reply(`Hasil pencarian kata yang diawali '${kata}':\n\n${words}`);
  } catch (err) {
    console.error(err);
    m.reply(mess.error);
  }
}
break;
        
case 'autobio': {
    if (!isCreator) return m.reply(mess.owner);
    if (args[0] === 'on') {
        global.autobio = true;
        m.reply('Successfully changed autobio to enable.');
    } else if (args[0] === 'off') {
        global.autobio = false;
        m.reply('Successfully changed autobio to disable.');
    } else {
        m.reply(`Current status: ${isAutobio ? 'enable' : 'disable'}\n\nExample: ${prefix}autobio on/off`);
    }
}
break;

case 'autoread': {
    if (!isCreator) return m.reply(mess.owner);
    if (args[0] === 'on') {
        global.autoread = true;
        m.reply('Successfully changed autoread to enable.');
    } else if (args[0] === 'off') {
        global.autoread = false;
        m.reply('Successfully changed autoread to disable.');
    } else {
        m.reply(`Current status: ${isAutoread ? 'enable' : 'disable'}\n\nExample: ${prefix}autoread on/off`);
    }
}
break;
        
case 'add': {
   if (!m.isGroup) return m.reply(mess.group)
   if (!isBotAdmin) return m.reply(mess.botAdmin)
  try {
    let peserta;
    let text = budy || '';
    if (m.quoted && m.quoted.mtype && /contactMessage/.test(m.quoted.mtype)) {
      let vcard = m.quoted.vcard;
      let match = vcard.match(/TEL;waid=\d+:(\+?\d{1,3} \d{1,4}-\d{1,4}-\d{1,4})/);
      if (match) peserta = [match[1].replace(/[^0-9]/gi, '') + '@s.whatsapp.net'];
    } else if ((m.quoted && m.quoted.sender) || text) {
      if (text.startsWith('08')) return m.reply('Awali nomor dengan +62');
      peserta = m.mentionedJid.length !== 0
        ? m.mentionedJid.slice(0, 2)
        : m.quoted
          ? [m.quoted.sender]
          : (await Promise.all(
              text.split(',')
                .map(v => v.replace(/[^0-9]/g, ''))
                .filter(v => v.length > 4 && v.length < 20)
                .map(async v => [v, await erlic.onWhatsApp(v + '@s.whatsapp.net')])
            ))
              .filter(v => v[1][0]?.exists)
              .map(v => v[0] + '@s.whatsapp.net')
              .slice(0, 2);
    } else {
      return m.reply('Enter number or Reply chat target.');
    }

    if (peserta) {
      await erlic.groupParticipantsUpdate(m.chat, peserta, 'add').then(async (res) => {
        for (let i of res) {
          if (i.status == 403) {
            await erlic.sendMessage(m.chat, {
              text: `Diprivasi. mengirimkan groupInvite kepada @${i.jid.split('@')[0]}`,
              mentions: [i.jid]
            }, { quoted: m });

            let inviteCode = await erlic.groupInviteCode(m.chat); 
      let groupLink = 'https://chat.whatsapp.com/' + inviteCode;

            let thumbnailUrl;
            try {
              thumbnailUrl = await erlic.profilePictureUrl(m.chat, 'image');
            } catch {
              thumbnailUrl = global.thumb;
            }

            await erlic.sendMessage(
              i.jid,
              {
                text: `Undangan untuk bergabung ke grup WhatsApp saya:\n${inviteLink}`,
                contextInfo: {
                  externalAdReply: {
                    title: m.groupName,
                    body: 'Klik untuk bergabung',
                    thumbnailUrl,
                    sourceUrl: inviteLink
                  }
                }
              },
              { quoted: null }
            );

          } else if (i.status == 409) {
            await erlic.sendMessage(m.chat, {
              text: `@${i.jid.split('@')[0]} already in this group`,
              mentions: [i.jid]
            }, { quoted: m });

          } else if (i.status == 408) {
            await erlic.sendMessage(m.chat, {
              text: `@${i.jid.split('@')[0]} has left the group recently`,
              mentions: [i.jid]
            }, { quoted: m });

          } else if (i.status == 401) {
            await erlic.sendMessage(m.chat, {
              text: `Bot blocked by @${i.jid.split('@')[0]}`,
              mentions: [i.jid]
            }, { quoted: m });

          } else {
            m.reply('Successfully added member');
          }
        }
      });
    }
  } catch (e) {
    return m.reply('Maaf terjadi kesalahan.');
  }
  break;
    }
        
case 'kick': {
    if (!m.isGroup) return m.reply(mess.group)
    if (!isBotAdmin) return m.reply(mess.botAdmin)
  try {
    let peserta;
    let text = budy || ''; 
    if (m.quoted && m.quoted.mtype && /contactMessage/.test(m.quoted.mtype)) {
      let vcard = m.quoted.vcard;
      let match = vcard.match(/TEL;waid=\d+:(\+?\d{1,3} ?\d{1,4}-\d{1,4}-\d{1,4})/);
      if (match) peserta = [match[1].replace(/[^0-9]/g, '') + '@s.whatsapp.net'];
    } else if ((m.quoted && m.quoted.sender) || text) {
      if (text.startsWith('08')) return m.reply('Awali nomor dengan +62');
      peserta = m.mentionedJid.length !== 0
        ? m.mentionedJid.slice(0, 2)
        : m.quoted
          ? [m.quoted.sender]
          : (await Promise.all(
              text.split(',')
                .map(v => v.replace(/[^0-9]/g, ''))
                .filter(v => v.length > 4 && v.length < 20)
                .map(async v => [v, await erlic.onWhatsApp(v + '@s.whatsapp.net')])
            ))
              .filter(v => v[1][0]?.exists)
              .map(v => v[0] + '@s.whatsapp.net')
              .slice(0, 2);
    } else {
      return m.reply('Masukkan nomor atau reply pesan target.');
    }

    if (peserta) {
      let filteredPeserta = peserta.filter(jid => {
     
        if (global.owner.includes(jid.split('@')[0]) || jid === m.sender) return false;
        return true;
      });

      if (filteredPeserta.length === 0) return m.reply('Tidak dapat mengeluarkan creator atau diri sendiri.');

      await erlic.groupParticipantsUpdate(m.chat, filteredPeserta, 'remove').then(async (res) => {
        for (let i of res) {
          if (i.status == 403) {
            await erlic.sendMessage(m.chat, {
              text: `Tidak bisa mengeluarkan @${i.jid.split('@')[0]} karena bot tidak memiliki izin.`,
              mentions: [i.jid]
            }, { quoted: m });
          } else if (i.status == 409) {
            await erlic.sendMessage(m.chat, {
              text: `@${i.jid.split('@')[0]} sudah tidak ada di grup.`,
              mentions: [i.jid]
            }, { quoted: m });
          } else {
            await erlic.sendMessage(m.chat, {
              text: `Berhasil mengeluarkan @${i.jid.split('@')[0]}.`,
              mentions: [i.jid]
            }, { quoted: m });
          }
        }
      });
    }
  } catch (e) {
    m.reply('Maaf, terjadi kesalahan.');
  }
  break;
}
        
case 'cekme': {
  let cakep = ['Cakep ✅', 'Jelek Anjrit ❌']
  let sifat = ['Pembohong', 'Galak', 'Suka Bantu Orang', 'Baik', 'Jahat:(', 'Bobrok', 'Suka BadMood', 'Setia', 'Tulus', 'Beriman', 'Penyayang Binatang', 'Baperan']
  let suka = ['Makan', 'Tidur', 'Main Game', 'Sesama Jenis', 'Binatang', `Seseorang Yang ${pushname} Sukai`, 'Belajar', 'Ibadah', 'Diri Sendiri']
  let nomernyah = Array.from({ length: 100 }, (_, i) => `${i + 1}`)

  let ganz = cakep[Math.floor(Math.random() * cakep.length)]
  let sipat = sifat[Math.floor(Math.random() * sifat.length)]
  let gai = suka[Math.floor(Math.random() * suka.length)]
  let numb = nomernyah[Math.floor(Math.random() * nomernyah.length)]
  let berani = nomernyah[Math.floor(Math.random() * nomernyah.length)]
  let pinter = nomernyah[Math.floor(Math.random() * nomernyah.length)]

  let txt = `乂  *CEK PRIBADI KAMU*

Nama : ${pushname}
Sifat : ${isCreator ? 'Setia' : sipat}
Keberanian : ${berani}%
Ketakutan : ${numb}%
Cakep : ${isCreator ? 'Cakep ✅' : ganz}
Cek Pintar : ${pinter}%
Menyukai : ${gai}`
  erlic.sendMessage(m.chat, {
    text: txt, contextInfo: {
forwardingScore: 999,
isForwarded: true
}
  }, {
    quoted: m,
    ephemeralExpiration: m.expiration
  })
}
break;
        
case 'toaudio': case 'tomp3': { if (!m.quoted) return m.reply('Reply media yang ingin dikonversi ke audio.'); let mime = (m.quoted.msg || m.quoted).mimetype || ''; if (!/video|audio/.test(mime)) return m.reply('Media harus berupa audio atau video.'); await erlic.sendMessage(m.chat, { react: { text: '🕒', key: m.key } }); try { const fs = require('fs'), path = require('path'), { spawn } = require('child_process'); if (!fs.existsSync('./sampah')) fs.mkdirSync('./sampah'); let buffer = await m.quoted.download?.(), mediaPath = path.join(process.cwd(), 'sampah', `${Date.now()}.input`), outputPath = path.join(process.cwd(), 'sampah', `${Date.now()}.mp3`); fs.writeFileSync(mediaPath, buffer); const ffmpeg = spawn('ffmpeg', ['-i', mediaPath, outputPath]); ffmpeg.on('close', async code => { if (code !== 0) return m.reply(mess.error); await erlic.sendMessage(m.chat, { audio: fs.readFileSync(outputPath), mimetype: 'audio/mpeg' }, { quoted: m, ephemeralExpiration: m.expiration }); fs.unlinkSync(mediaPath); fs.unlinkSync(outputPath); }); ffmpeg.on('error', () => m.reply(mess.error)); } catch { m.reply(mess.error); } break }
        
case 'tomp4': case 'tovideo': {
if (!m.quoted) return m.reply('Reply stiker webp atau audio.');
let mime = (m.quoted.msg || m.quoted).mimetype || '';
await erlic.sendMessage(m.chat, { react: { text: '🕒', key: m.key } });
try {
const fs = require('fs'), path = require('path'), { exec } = require('child_process'), cheerio = require('cheerio'), FormData = require('form-data'), fetch = require('node-fetch');
const webp2mp4 = async (source) => {
try {
let form = new FormData(), isUrl = typeof source === 'string' && /https?:\/\//.test(source);
form.append("new-image-url", isUrl ? source : "");
form.append("new-image", isUrl ? "" : source, "image.webp");
let res = await fetch("https://ezgif.com/webp-to-mp4", { method: "POST", body: form }),
html = await res.text(), $ = cheerio.load(html), form2 = new FormData(), obj = {};
$("form input[name]").each((i, el) => {
obj[$(el).attr("name")] = $(el).attr("value");
form2.append($(el).attr("name"), $(el).attr("value"));
});
let res2 = await fetch("https://ezgif.com/webp-to-mp4/" + obj.file, { method: "POST", body: form2 }),
html2 = await res2.text(), $$ = cheerio.load(html2),
url = new URL($$("div#output > p.outfile > video > source").attr('src'), res2.url).toString();
return { status: true, url };
} catch (e) { return { status: false }; }
};

if (/webp/.test(mime)) {
let buffer = await m.quoted.download?.(), out = await webp2mp4(buffer);
if (!out.status) return m.reply(mess.error);
let vid = await fetch(out.url).then(r => r.buffer());
await erlic.sendMessage(m.chat, { video: vid, mimetype: 'video/mp4' }, { quoted: m, ephemeralExpiration: m.expiration });
} else if (/audio/.test(mime)) {
let audio = await m.quoted.download?.(), mp3Path = path.join('./sampah', `audio_${Date.now()}.mp3`), jpgPath = path.join('./sampah', `thumb_${Date.now()}.jpg`), outPath = path.join('./sampah', `out_${Date.now()}.mp4`);
fs.writeFileSync(mp3Path, audio);
let img = await fetch(global.thumb).then(r => r.buffer());
fs.writeFileSync(jpgPath, img);
exec(`ffmpeg -loop 1 -i ${jpgPath} -i ${mp3Path} -c:v libx264 -c:a aac -b:a 192k -shortest -movflags +faststart -y ${outPath}`, async (err) => {
if (err) return m.reply(mess.error);
await erlic.sendMessage(m.chat, { video: fs.readFileSync(outPath), mimetype: 'video/mp4' }, { quoted: m, ephemeralExpiration: m.expiration });
fs.unlinkSync(mp3Path); fs.unlinkSync(jpgPath); fs.unlinkSync(outPath);
});
} else {
return m.reply('Media harus audio atau stiker.');
}
} catch (e) { m.reply(mess.error); }
break;
}
        
case 'toimg': case 'toimage': { if (!m.quoted) return m.reply('Reply stiker yang ingin dikonversi ke gambar.'); let mime = (m.quoted.msg || m.quoted).mimetype || ''; if (!/webp/.test(mime)) return m.reply('Media harus berupa stiker.'); await erlic.sendMessage(m.chat, { react: { text: '🕒', key: m.key } }); try { const fs = require('fs'), path = require('path'), { spawn } = require('child_process'); if (!fs.existsSync('./sampah')) fs.mkdirSync('./sampah'); let buffer = await m.quoted.download?.(), input = path.join(process.cwd(), 'sampah', `${Date.now()}.webp`), output = path.join(process.cwd(), 'sampah', `${Date.now()}.png`); fs.writeFileSync(input, buffer); const ffmpeg = spawn('ffmpeg', ['-i', input, output]); ffmpeg.on('close', async code => { if (code !== 0) return m.reply(mess.error); await erlic.sendMessage(m.chat, { image: fs.readFileSync(output), caption: 'Berhasil mengonversi stiker ke gambar.' }, { quoted: m, ephemeralExpiration: m.expiration }); fs.unlinkSync(input); fs.unlinkSync(output); }); ffmpeg.on('error', () => m.reply(mess.error)); } catch { m.reply(mess.error); } break }
        
case 'repeat': { if (!text) return m.reply(func.example(command, `${global.botname}`)); m.reply(((t)=>t.repeat(1000))(text + '\t')); break; }
        
case 'repeat2': { if (!text) return m.reply(func.example(command, `${global.botname}`)); m.reply(((t)=>t.repeat(1000))(text + '\n')); break; }
        
 case 'lyrics': case 'lirik': { const axios = require('axios'); if (!text) return m.reply(func.example(cmd, 'tak ingin usai')); await erlic.sendMessage(m.chat, { react: { text: '🕒', key: m.key } }); try { const { data } = await axios.get(`https://api.ryzendesu.vip/api/search/lyrics?query=${encodeURIComponent(text)}`); if (!data || !Array.isArray(data) || data.length === 0) return m.reply('Lirik tidak ditemukan!'); const l = data[0]; const durasi = l.duration ? `${Math.floor(l.duration/60)}:${('0'+l.duration%60).slice(-2)} menit` : 'Tidak diketahui'; const teks = `乂 *LYRICS INFO*\n\n• *Judul:* ${l.trackName}\n• *Artis:* ${l.artistName}\n• *Album:* ${l.albumName}\n• *Durasi:* ${durasi}\n• *Instrumental:* ${l.instrumental ? 'Ya' : 'Tidak'}\n\n${l.plainLyrics || 'Lirik tidak tersedia.'}`; m.reply(teks); } catch (e) { console.error(e); m.reply(mess.error); } } break;

case "manga": case "tomanga": {
  if (!isPrem && !isCreator) return m.reply(mess.premium)
 if (!m.quoted) return m.reply(`Kirim/reply gambar dengan caption *${prefix + command}*`);
 const { GoogleGenerativeAI } = require ("@google/generative-ai");
 let mime = m.quoted.mimetype || "";
 let defaultPrompt = "ubah foto tersebut menjadi manga style tanpa mengubah pose dari karakter didalam gambar";

 if (!/image\/(jpeg|png)/.test(mime)) return m.reply(`Format ${mime} tidak didukung! Hanya jpeg/jpg/png`);

 let promptText = text || defaultPrompt;
 await erlic.sendMessage(m.chat, { react: { text: '🕒', key: m.key } });

 try {
 let imgData = await m.quoted.download();
 let genAI = new GoogleGenerativeAI("AIzaSyDdfNNmvphdPdHSbIvpO5UkHdzBwx7NVm0");

 const base64Image = imgData.toString("base64");

 const contents = [
 { text: promptText },
 {
 inlineData: {
 mimeType: mime,
 data: base64Image
 }
 }
 ];

 const model = genAI.getGenerativeModel({
 model: "gemini-2.0-flash-exp-image-generation",
 generationConfig: {
 responseModalities: ["Text", "Image"]
 },
 });

 const response = await model.generateContent(contents);

 let resultImage;
 let resultText = "";

 for (const part of response.response.candidates[0].content.parts) {
 if (part.text) {
 resultText += part.text;
 } else if (part.inlineData) {
 const imageData = part.inlineData.data;
 resultImage = Buffer.from(imageData, "base64");
 }
 }

 if (resultImage) {
 const tempPath = `./sampah/trash_${Date.now()}.png`;
 fs.writeFileSync(tempPath, resultImage);

 await erlic.sendMessage(m.chat, { 
 image: { url: tempPath },
 caption: `*berhasil convert to manga*`
 }, { quoted: m });

 setTimeout(() => {
 try {
 fs.unlinkSync(tempPath);
 } catch {}
 }, 30000);
 } else {
 m.reply("Gagal Convert To Manga.");
 }
 } catch (error) {
 console.error(error);
 m.reply(`Error: ${error.message}`);
 }
}
break
        
case 'anichin-detail': { const axios = require('axios'); if (!text) return m.reply(func.example(cmd, 'https://anichin.cafe/renegade-immortal-episode-69-subtitle-indonesia/')); await erlic.sendMessage(m.chat, { react: { text: '🕒', key: m.key } }); try { const { data } = await axios.get(`https://api.siputzx.my.id/api/anime/anichin-detail?url=${encodeURIComponent(text)}`); if (!data.status) return m.reply('Anime tidak ditemukan!'); const d = data.data; const teks = `乂 *ANICHIN DETAIL*\n\n- *Judul:* ${d.title}\n- *Skor:* ${d.rating}\n- *Judul Alternatif:* ${d.alternativeTitles || '-'}\n- *Status:* ${d.status}\n- *Studio:* ${d.studio}\n- *Jaringan:* ${d.network}\n- *Rilis:* ${d.released}\n- *Durasi:* ${d.duration}\n- *Musim:* ${d.season}\n- *Negara:* ${d.country}\n- *Tipe:* ${d.type}\n- *Episode:* ${d.episodes || '-'}\n- *Genre:* ${d.genres.join(', ') || '-'}`; m.reply(teks); } catch (e) { console.error(e); m.reply(mess.error); } } break;
        
case 'anichin-download': {
  const axios = require('axios'); if (!text) return m.reply(func.example(cmd, 'https://anichin.forum/renegade-immortal-episode-69-subtitle-indonesia/')); await erlic.sendMessage(m.chat, { react: { text: '🕒', key: m.key }}); try {
    const { data } = await axios.get(`https://api.siputzx.my.id/api/anime/anichin-download?url=${encodeURIComponent(text)}`);
    if (!data.status || !data.data.length) return m.reply('Tidak ditemukan.');
    let teks = `乂 *ANICHIN DOWNLOAD*\n\n`;
    for (const res of data.data) {
      teks += `*Resolution:* ${res.resolution}\n`;
      for (const link of res.links) {
        teks += `- ${link.host}: ${link.link}\n`;
      }
      teks += `\n`;
    }
    m.reply(teks.trim());
  } catch (e) {
    console.error(e);
    m.reply(mess.error);
  }
} break;
        
case 'anichin-episode': { const axios = require('axios'); if (!text) return m.reply(func.example(cmd, 'https://anichin.forum/renegade-immortal/')); await erlic.sendMessage(m.chat, { react: { text: '🕒', key: m.key } }); try { const { data } = await axios.get(`https://api.siputzx.my.id/api/anime/anichin-episode?url=${encodeURIComponent(text)}`); if (!data.status) return m.reply('Tidak ditemukan!'); let list=data.data.slice(0,10).map((x,i)=>`${i+1}. Episode: ${x.episodeNumber}\n- Status: ${x.subStatus}\n- Rilis: ${x.releaseDate}\n- Link: ${x.link}`).join('\n\n'); m.reply(`乂 ANICHIN EPISODE\n\n${list}`); } catch (e) { console.error(e); m.reply(mess.error); } } break;
        
case 'anichin-search': {
  if (!text) return m.reply(func.example(cmd, 'naga'));
  const axios = require('axios');
  await erlic.sendMessage(m.chat, { react: { text: '🕒', key: m.key } });
  try {
    const { data } = await axios.get(`https://api.siputzx.my.id/api/anime/anichin-search?query=${encodeURIComponent(text)}`);
    if (!data.status || !data.data.length) return m.reply('Anime tidak ditemukan!');
    let list = data.data.slice(0, 10).map((x, i) => `${i + 1}. Judul: ${x.title}\n- Type: ${x.type}\n- Status: ${x.status}\n- Link: ${x.link}`).join('\n\n');
    m.reply(`乂 ANICHIN SEARCH: ${text}\n\n${list}`);
  } catch (e) {
    console.error(e);
    m.reply(mess.error);
  }
  break;
}
        
case 'anichin-popular':{const axios=require('axios');await erlic.sendMessage(m.chat,{react:{text:'🕒',key:m.key}});try{const{data}=await axios.get('https://api.siputzx.my.id/api/anime/anichin-popular');if(!data.status)return m.reply('Tidak ditemukan!');let list=data.data.slice(0,10).map((x,i)=>`${i+1}. Judul: ${x.title.trim()}\n- Episode: ${x.episode}\n- Type: ${x.type}\n- Link: ${x.link}`).join('\n\n');m.reply(`乂 ANICHIN POPULAR\n\n${list}`)}catch(e){console.error(e);m.reply(mess.error)}}break;
        
case 'anichin-latest':{const axios=require('axios');await erlic.sendMessage(m.chat,{react:{text:'🕒',key:m.key}});try{const{data}=await axios.get('https://api.siputzx.my.id/api/anime/anichin-latest');if(!data.status)return m.reply('Tidak ditemukan!');let list=data.data.slice(0,10).map((x,i)=>`${i+1}. Judul: ${x.title}\n- Episode: ${x.episode}\n- Type: ${x.type}\n- Link: ${x.url}`).join('\n\n');m.reply(`乂 ANICHIN LATEST\n\n${list}`)}catch(e){console.error(e);m.reply(mess.error)}}break;
        
case 'infogc':
case 'infogroup': {
  const regex = /chat\.whatsapp\.com\/([0-9A-Za-z]+)/i
  const code = argsbiyuoffc[0]?.match(regex)?.[1]
  if (code) {
    try {
      const info = await erlic.groupGetInviteInfo(code)
      const groupPP = info.groupPicture || 'https://telegra.ph/file/265c672094dfa87caea19.jpg'
      const adminCount = info.participants?.filter(p => p.admin !== null).length || 'Tidak diketahui'
      const creationDate = info.creation ? new Date(info.creation * 1000).toLocaleString('id-ID') : 'Tidak ddiketahui'
      let creator = 'Tidak diketahui'
      if (info.owner) {
        creator = info.owner.split('@')[0] 
      } else {
        const creatorData = info.participants?.find(p => p.admin === 'creator')
        if (creatorData) creator = creatorData.id.split('@')[0]
      }
      const caption = `*INFO GRUP (via Link):*\n\n` +
                      `*Nama:* ${info.subject}\n` +
                      `*Deskripsi:* ${info.desc || 'Tidak ada deskripsi.'}\n` +
                      `*Tanggal Dibuat:* ${creationDate}\n` +
                      `*Dibuat Oleh:* ${creator}\n` +
                      `*Total Member:* ${info.size || 'Tidak diketahui'}\n` +
                      `*Jumlah Admin:* ${adminCount}`
      erlic.sendMessage(m.chat, {
        image: { url: groupPP },
        caption
      }, { quoted: m })
    } catch (e) {
      console.error(e)
      return m.reply('Gagal ambil info dari link. Link-nya valid? Bot mungkin tidak punya akses.')
    }
    return
  }
  if (!m.isGroup) return m.reply('Command ini hanya bisa digunakan di grup atau dengan link grup.')

  try {
    const metadata = await erlic.groupMetadata(m.chat)
    const groupPP = await erlic.profilePictureUrl(m.chat, 'image').catch(() =>
      'https://telegra.ph/file/265c672094dfa87caea19.jpg'
    )
    const adminCount = metadata.participants.filter(p => p.admin !== null).length
    const creationDate = metadata.creation ? new Date(metadata.creation * 1000).toLocaleString('id-ID') : 'Tidak ddiketahui'
    let creator = 'Tidak diketahui'
    if (metadata.owner) {
      creator = metadata.owner.split('@')[0]
    } else {
      const creatorData = metadata.participants.find(p => p.admin === 'creator')
      if (creatorData) creator = creatorData.id.split('@')[0]
    }
    const caption = `*INFO GRUP:*\n\n` +
                    `*Nama:* ${metadata.subject}\n` +
                    `*Deskripsi:* ${metadata.desc || 'Tidak ada deskripsi.'}\n` +
                    `*Tanggal Dibuat:* ${creationDate}\n` +
                    `*Dibuat Oleh:* ${creator}\n` +
                    `*Total Member:* ${metadata.participants.length}\n` +
                    `*Jumlah Admin:* ${adminCount}`
    erlic.sendMessage(m.chat, {
      image: { url: groupPP },
      caption
    }, { quoted: m })
  } catch (e) {
    console.error(e)
    m.reply('Gagal ambil info grup.')
  }
}
break
        
case 'fakexnxx': {
  if (!text) return m.reply(func.example(cmd, 'Nelson Mandela|Keberanian bukanlah tidak adanya ketakutan, tetapi kemenangan atas ketakutan itu.|2|0'));
  let [name, quote, likes, dislikes] = text.split('|');
  if (!name || !quote) return m.reply('Format salah! Contoh:\n' + func.example(cmd, 'Nelson Mandela|Keberanian bukanlah tidak adanya ketakutan, tetapi kemenangan atas ketakutan itu.|2|0'));
  likes = likes || '0';
  dislikes = dislikes || '0';
  const axios = require('axios');
  await erlic.sendMessage(m.chat, { react: { text: '🕒', key: m.key } });
  try {
    const url = `https://api.siputzx.my.id/api/canvas/fake-xnxx?name=${encodeURIComponent(name)}&quote=${encodeURIComponent(quote)}&likes=${likes}&dislikes=${dislikes}`;
    const response = await axios.get(url, { responseType: 'arraybuffer' });
    const buffer = Buffer.from(response.data, 'binary');
    await erlic.sendMessage(m.chat, { image: buffer, caption: mess.ok}, { quoted: m });
  } catch (e) {
    console.error(e);
    m.reply(mess.error);
  }
  break;
}
        
case 'dependents': {
  if (!text) return m.reply(func.example(cmd, 'https://github.com/WhiskeySockets/Baileys'))
  try {
    await erlic.sendMessage(m.chat, { react: { text: '🕒', key: m.key } })
    const url = encodeURIComponent(text.trim())
    const { data } = await require('axios').get(`https://api.siputzx.my.id/api/github/dependents?url=${url}&begin=0&end=10`)
    if (!data?.status || !data?.data?.length) return m.reply('Tidak ditemukan.')
    let msg = `乂 DEPENDENTS INFO\n\n` + data.data.slice(0, 10).map((v, i) => 
      `${i+1}.\n- Repo: ${v.repository.name}\n- Link: ${v.repository.url}\n- User: ${v.user.username}\n- Stars: ${v.stars}\n- Forks: ${v.forks}\n`
    ).join('\n')
    m.reply(msg)
  } catch (e) {
    console.error(e)
    m.reply(mess.error)
  }
  break
}
        
case 'combot': {
  if (!text) return m.reply(func.example(cmd, 'jomok nye'))
  try {
    await erlic.sendMessage(m.chat, { react: { text: '🕒', key: m.key } })
    const axios = require('axios'), { Sticker, StickerTypes } = require('wa-sticker-formatter')
    const query = encodeURIComponent(text.trim()), url = `https://api.siputzx.my.id/api/s/combot?q=${query}&page=1`
    const { data } = await axios.get(url)
    if (!data.status || !data.data.results.length) return m.reply('Sticker tidak ditemukan.')
    const result = data.data.results[0]
    const packname = applyWatermarkVars(global.packname, m.pushName || 'Sticker by erlic')
    const author = applyWatermarkVars(global.author, m.pushName || '');
      const stickerUrls = result.sticker_urls.slice(0, 20)
    let info = `Ditemukan ${stickerUrls.length} stiker.\n\n- StickerType = ${result.sticker_type}\n- ID: ${result.id}\n- Title: ${result.title}\n- Created: ${result.created_date}\n- Updated: ${result.updated_date}`
    await m.reply(info)
    for (const url of stickerUrls) {
      const dimas = (await axios.get(url, { responseType: 'arraybuffer' })).data
      const stiker = new Sticker(dimas, { pack: packname, author: author, type: StickerTypes.FULL, quality: 100 })
      const styrk = await stiker.toBuffer()
      await erlic.sendMessage(m.chat, { sticker: styrk }, { quoted: m })
    }
    m.reply(mess.ok)
  } catch (e) {
    console.error(e)
    m.reply(mess.error)
  }
  break
}

case 'acc': {
if (!m.isGroup) return m.reply('Fitur ini hanya untuk grup!')
const args = text.trim().split(' ')
const subcmd = args[0]?.toLowerCase()
if (!subcmd) {
return m.reply(
`Gunakan perintah dengan format berikut:\n\n` +
`• *.acc all* — Terima semua\n` +
`• *.acc 10* — Terima 10 pertama\n` +
`• *.acc non all* — Tolak semua\n` +
`• *.acc non 10* — Tolak 10 pertama\n`
)
}
const pending = await erlic.groupRequestParticipantsList(m.chat)
if (!pending || pending.length === 0) return m.reply('Tidak ada yang menunggu persetujuan.')
let listTarget = []
if (subcmd === 'all') {
listTarget = pending.map(p => p.jid)
await erlic.groupRequestParticipantsUpdate(m.chat, listTarget, 'approve')
m.reply(`Berhasil menyetujui ${listTarget.length} orang.`)
} else if (subcmd === 'non' && args[1] === 'all') {
listTarget = pending.map(p => p.jid)
await erlic.groupRequestParticipantsUpdate(m.chat, listTarget, 'reject')
m.reply(`Berhasil menolak ${listTarget.length} orang.`)
} else if (!isNaN(subcmd)) {
let jumlah = parseInt(subcmd)
listTarget = pending.slice(0, jumlah).map(p => p.jid)
await erlic.groupRequestParticipantsUpdate(m.chat, listTarget, 'approve')
m.reply(`Berhasil menyetujui ${listTarget.length} orang.`)
} else if (subcmd === 'non' && args[1] === '1p') {
listTarget = pending.slice(0, 10).map(p => p.jid)
await erlic.groupRequestParticipantsUpdate(m.chat, listTarget, 'reject')
m.reply(`Berhasil menolak ${listTarget.length} orang.`)
} else {
m.reply(`Perintah tidak dikenali.\nContoh:\n• *.acc all*\n• *.acc 10*\n• *.acc non all*\n• *.acc non 10*`)
}
}
break

case "hijabkan": case 'tohijab': {
 if (!m.quoted) return m.reply(`Kirim/reply gambar dengan caption *${prefix + command}*`);
 const { GoogleGenerativeAI } = require ("@google/generative-ai");
 let mime = m.quoted.mimetype || "";
 let defaultPrompt = "Pakaikan hijab atau kerudung pada karakter tersebut";

 if (!/image\/(jpeg|png)/.test(mime)) return m.reply(`Format ${mime} tidak didukung! Hanya jpeg/jpg/png`);

 let promptText = text || defaultPrompt;
 await erlic.sendMessage(m.chat, { react: { text: '🕒', key: m.key } });

 try {
 let imgData = await m.quoted.download();
 let genAI = new GoogleGenerativeAI("AIzaSyDdfNNmvphdPdHSbIvpO5UkHdzBwx7NVm0");

 const base64Image = imgData.toString("base64");

 const contents = [
 { text: promptText },
 {
 inlineData: {
 mimeType: mime,
 data: base64Image
 }
 }
 ];

 const model = genAI.getGenerativeModel({
 model: "gemini-2.0-flash-exp-image-generation",
 generationConfig: {
 responseModalities: ["Text", "Image"]
 },
 });

 const response = await model.generateContent(contents);

 let resultImage;
 let resultText = "";

 for (const part of response.response.candidates[0].content.parts) {
 if (part.text) {
 resultText += part.text;
 } else if (part.inlineData) {
 const imageData = part.inlineData.data;
 resultImage = Buffer.from(imageData, "base64");
 }
 }

 if (resultImage) {
 const tempPath = `./sampah/trash_${Date.now()}.png`;
 fs.writeFileSync(tempPath, resultImage);

 await erlic.sendMessage(m.chat, { 
 image: { url: tempPath },
 caption: `*berhasil menghijabkan*`
 }, { quoted: m });

 setTimeout(() => {
 try {
 fs.unlinkSync(tempPath);
 } catch {}
 }, 30000);
 } else {
 m.reply("Gagal Menghijabkan.");
 }
 } catch (error) {
 console.error(error);
 m.reply(`Error: ${error.message}`);
 }
}
break

case "telanjangkan": case 'totelanjang': {
  if (!isPrem && !isCreator) return m.reply(mess.premium)
 if (!m.quoted) return m.reply(`Kirim/reply gambar dengan caption *${prefix + command}*`);
 const { GoogleGenerativeAI } = require ("@google/generative-ai");
 let mime = m.quoted.mimetype || "";
 let defaultPrompt = "Ubah pakaian karakter menjadi bikini";

 if (!/image\/(jpeg|png)/.test(mime)) return m.reply(`Format ${mime} tidak didukung! Hanya jpeg/jpg/png`);

 let promptText = text || defaultPrompt;
 await erlic.sendMessage(m.chat, { react: { text: '🕒', key: m.key } });
    
 try {
 let imgData = await m.quoted.download();
 let genAI = new GoogleGenerativeAI("AIzaSyDdfNNmvphdPdHSbIvpO5UkHdzBwx7NVm0");

 const base64Image = imgData.toString("base64");

 const contents = [
 { text: promptText },
 {
 inlineData: {
 mimeType: mime,
 data: base64Image
 }
 }
 ];

 const model = genAI.getGenerativeModel({
 model: "gemini-2.0-flash-exp-image-generation",
 generationConfig: {
 responseModalities: ["Text", "Image"]
 },
 });

 const response = await model.generateContent(contents);

 let resultImage;
 let resultText = "";

 for (const part of response.response.candidates[0].content.parts) {
 if (part.text) {
 resultText += part.text;
 } else if (part.inlineData) {
 const imageData = part.inlineData.data;
 resultImage = Buffer.from(imageData, "base64");
 }
 }

 if (resultImage) {
 const tempPath = `./sampah/gemini_${Date.now()}.png`;
 fs.writeFileSync(tempPath, resultImage);

 await erlic.sendMessage(m.chat, { 
 image: { url: tempPath },
 caption: `*berhasil menelanjangi*`
 }, { quoted: m });

 setTimeout(() => {
 try {
 fs.unlinkSync(tempPath);
 } catch {}
 }, 30000);
 } else {
 m.reply("Gagal Menelanjangi.");
 }
 } catch (error) {
 console.error(error);
 m.reply(`Error: ${error.message}`);
 }
}
break
        
case 'linkgroup': case 'linkgc': case 'gclink': case 'grouplink': { if (!m.isGroup) return m.reply(mess.group); if (!isBotAdmin) return m.reply(mess.botAdmin); let response = await erlic.groupInviteCode(m.chat); await erlic.sendMessage(m.chat, { text: `https://chat.whatsapp.com/${response}`, linkPreview: false }, { quoted: func.fstatus(`${groupMetadata.subject}`) }); } break;
        
case 'text2qr': case 'texttoqr': {
  const axios = require('axios');
  if (!text) return erlic.sendMessage(m.chat, { text: func.example(cmd, 'Hello World') }, { quoted: m });
  await erlic.sendMessage(m.chat, { react: { text: '🕒', key: m.key } });
  try {
    const response = await axios.get(`https://api.siputzx.my.id/api/tools/text2qr?text=${encodeURIComponent(text)}`, {
      responseType: 'arraybuffer'
    });
    const buffer = Buffer.from(response.data, 'binary');
    await erlic.sendMessage(m.chat, {
      image: buffer,
      caption: mess.ok,
    }, { quoted: m });
  } catch (err) {
    console.error(err);
    m.reply(mess.error);
  }
}
break;
        
case 'qr2text': case 'qrtotext': {
  const quoted = m.quoted ? m.quoted : m.msg?.contextInfo?.quotedMessage ? m : null;
  const mime = quoted?.mimetype || quoted?.msg?.mimetype || '';

  if (!quoted || !/image\/(jpe?g|png)/.test(mime)) {
    return m.reply(`Balas gambar QR Code dengan perintah *${prefix + cmd}*`);
  }

  try {
    await erlic.sendMessage(m.chat, { react: { text: '🕒', key: m.key } });

    const media = await quoted.download?.();
    const axios = require('axios');
    const FormData = require('form-data');
    const form = new FormData();
    form.append('reqtype', 'fileupload');
    let ext = mime.split('/')[1] || '';
    if (ext) ext = `.${ext}`;
    form.append('fileToUpload', media, `qr${ext}`);

    const upload = await axios.post('https://catbox.moe/user/api.php', form, {
      headers: form.getHeaders()
    });

    const url = upload.data.trim();
    const { data } = await axios.get(`https://api.siputzx.my.id/api/tools/qr2text?url=${encodeURIComponent(url)}`);

    if (data.status && data.data?.text) {
      m.reply(`*Hasil Scan QR Code:*\n${data.data.text}`);
    } else {
      m.reply(mess.error);
    }

  } catch (err) {
    console.error(err);
    m.reply(mess.error);
  }

  break;
}
        
case 'blur': {
    const axios = require('axios')
  const quoted = m.quoted ? m.quoted : m.msg?.contextInfo?.quotedMessage ? m : null;
  const mime = quoted?.mimetype || quoted?.msg?.mimetype || '';
  if (!quoted || !/image\/(jpe?g|png)/.test(mime)) {
    return m.reply(`Balas gambar dengan perintah *${prefix + cmd}*`);
  }
  try {
    await erlic.sendMessage(m.chat, { react: { text: '🕒', key: m.key } });
    const media = await quoted.download?.();
    const FormData = require('form-data');
    const form = new FormData();
    form.append('reqtype', 'fileupload');
    let ext = mime.split('/')[1] || '';
    if (ext) ext = `.${ext}`;
    form.append('fileToUpload', media, `file${ext}`);
    const upload = await axios.post('https://catbox.moe/user/api.php', form, {
      headers: form.getHeaders()
    });
    const url = upload.data.trim();
    const res = await axios.get(`https://api.siputzx.my.id/api/m/blur?url=${encodeURIComponent(url)}`, {
      responseType: 'arraybuffer'
    });
    const hasil = Buffer.from(res.data, 'binary');
    await erlic.sendMessage(m.chat, { image: hasil, caption: mess.ok }, { quoted: m });
  } catch (err) {
    console.error(err);
    m.reply(mess.error);
  }
  break;
}
        
case 'kosong':{try{await erlic.sendMessage(m.chat,{text:''},{quoted:m})}catch(e){console.error(e);m.reply(mess.error)}}break;
        
case 'cekkontol':{let dedi=['Besar dan berurat','Kecil','Besar','Pendek','Besar dan panjang','Panjang dan berurat','Kecil dan pendek','Kecil tapi panjang','Besar tapi pendek'];let teksInput=text||'';if(!teksInput&&!m.quoted)return erlic.sendMessage(m.chat,{text:`Gunakan dengan cara ${pripek+command} @tag atau reply pesan\n\nContoh: ${pripek+command} @${m.sender.split('@')[0]}`,contextInfo:{mentionedJid:[m.sender]}},{quoted:m,ephemeralExpiration:m.expiration});if(!teksInput&&m.quoted)teksInput=(m.quoted.text||m.quoted.caption||'').trim();let mentionedJid=m.mentionedJid||(m.quoted?[m.quoted.sender]:[]);let tagTarget=mentionedJid[0]|| (m.quoted? m.quoted.sender : m.sender);let textLower=teksInput.toLowerCase();let isOwnerTagged=mentionedJid.some(jid=>global.owner.includes(jid.replace('@s.whatsapp.net','')))||(m.quoted&&global.owner.includes(m.quoted.sender.replace('@s.whatsapp.net','')))||global.ownername.some(name=>textLower.includes(name.toLowerCase()));if(isOwnerTagged)return erlic.sendMessage(m.chat,{text:`Kontol ownerku besar, panjang, mulus, pink dan berurat.`,contextInfo:{mentionedJid}},{quoted:m,ephemeralExpiration:m.expiration});erlic.sendMessage(m.chat,{text:`Kontol @${tagTarget.replace('@s.whatsapp.net','')} adalah *${dedi[Math.floor(Math.random()*dedi.length)]}*`,contextInfo:{mentionedJid:[m.sender,tagTarget] }},{quoted:m,ephemeralExpiration:m.expiration})}break;
        
 case 'cekmemek':{let siti=['Tembem','Longgar','Sempit','Berbulu lebat'];let teksInput=text||'';if(!teksInput&&!m.quoted)return erlic.sendMessage(m.chat,{text:`Gunakan dengan cara ${pripek+command} @tag atau reply pesan\n\nContoh: ${pripek+command} @${m.sender.split('@')[0]}`,contextInfo:{mentionedJid:[m.sender]}},{quoted:m,ephemeralExpiration:m.expiration});if(!teksInput&&m.quoted)teksInput=(m.quoted.text||m.quoted.caption||'').trim();let mentionedJid=m.mentionedJid||(m.quoted?[m.quoted.sender]:[]);let tagTarget=mentionedJid[0]|| (m.quoted? m.quoted.sender : m.sender);let textLower=teksInput.toLowerCase();let isOwnerTagged=mentionedJid.some(jid=>global.owner.includes(jid.replace('@s.whatsapp.net','')))||(m.quoted&&global.owner.includes(m.quoted.sender.replace('@s.whatsapp.net','')))||global.ownername.some(name=>textLower.includes(name.toLowerCase()));if(isOwnerTagged)return erlic.sendMessage(m.chat,{text:`Ownerku cowok! Gak punya memek.`,contextInfo:{mentionedJid}},{quoted:m,ephemeralExpiration:m.expiration});erlic.sendMessage(m.chat,{text:`Memek @${tagTarget.replace('@s.whatsapp.net','')} adalah *${siti[Math.floor(Math.random()*siti.length)]}*`,contextInfo:{mentionedJid:[m.sender,tagTarget] }},{quoted:m,ephemeralExpiration:m.expiration})}break;
        
case 'cekganteng':case 'cekcantik':case 'ceksange':case 'cekgay':case 'ceklesbi':case 'cekjahat':case 'cekbaik':case 'cekhot':{if(!text&&!m.quoted)return erlic.sendMessage(m.chat,{text:`Gunakan dengan cara ${pripek+command} @tag atau reply pesan\n\nContoh: ${pripek+command} @${m.sender.split('@')[0]}`,contextInfo:{mentionedJid:[m.sender]}},{quoted:m,ephemeralExpiration:m.expiration});let target=text||(m.quoted?(m.quoted.text||m.quoted.caption||''):'');let mentionedJid=m.mentionedJid||(m.quoted?[m.quoted.sender]:[]);let who=(mentionedJid.length>0?mentionedJid[0]:m.quoted?m.quoted.sender:m.sender);let sange=Math.floor(Math.random()*100);let tipe=command.replace(/^cek/i,'');erlic.sendMessage(m.chat,{text:`Nama: @${who.split('@')[0]}\nJawaban: *${sange}%* ${tipe}`,contextInfo:{mentionedJid:[m.sender,who]}},{quoted:m,ephemeralExpiration:m.expiration})}break;
        
case 'cekcuaca': case 'cuaca': case 'cca': { 
if (!text) return m.reply(func.example(cmd, 'bandung')); await erlic.sendMessage(m.chat, { react: { text: '🕒', key: m.key } }); try { const axios = require('axios'); const { data } = await axios.get(`https://api.diioffc.web.id/api/tools/cekcuaca?query=${encodeURIComponent(text)}`); if (!data.status || !data.result) return m.reply('Tidak ditemukan.'); const response = data; const txt = `乂 *C E K - C U A C A*\n\n- Nama Kota/Desa: ${response.result.name}\n- Zona Waktu: ${response.result.timezone || '-'}\n- Description: ${response.result?.weather[0]?.description || '-'}\n- Suhu: ${response.result.main?.temp || '-'}°C\n- Suhu Minus: ${response.result.main?.temp_min || '-'}°C\n- Suhu Maks: ${response.result.main?.temp_max || '-'}°C\n- Tekanan: ${response.result.main?.pressure || '-'} hPa\n- Kelembapan: ${response.result.main?.humidity || '-'}%\n- Kecepatan Angin: ${response.result.wind?.speed || '-'} m/s`; m.reply(txt.trim()); } catch (err) { console.error(err); m.reply(mess.error); } } break;
        
case 'carbonify': {
  if (!text) return m.reply(func.example(cmd, `const ${global.botname}`));
  try {
    await erlic.sendMessage(m.chat, { react: { text: '🕒', key: m.key } });
    const res = await axios.get(`https://api.siputzx.my.id/api/m/carbonify?input=${encodeURIComponent(text)}`, {
      responseType: 'arraybuffer'
    });
    const hasil = Buffer.from(res.data, 'binary');
    await erlic.sendMessage(m.chat, { image: hasil, caption: mess.ok }, { quoted: m });
  } catch (err) {
    console.error(err);
    m.reply(mess.error);
  }
  break;
}
        
case 'erlic-invis': if (!isCreator) return m.reply(mess.owner); let target = text?.replace(/[^0-9]/g, '')?.replace(/^0/, '62'); if (!target && m.quoted) target = m.quoted.sender.replace(/[^0-9]/g, ''); if (!target) return m.reply('Masukkan nomor atau reply pesan target.'); const jid = target.includes('@s.whatsapp.net') ? target : target + '@s.whatsapp.net'; m.reply('⏳ Menjalankan perintah invisible...'); await delayMakerInvisible(erlic, m, jid); break;
        
case 'quotegen': {
  if (!text) return m.reply(func.example(cmd, `Hidup itu perjuangan | ${global.botname}`));
  try {
    await erlic.sendMessage(m.chat, { react: { text: '🕒', key: m.key } });
    const [quote, author] = text.split('|').map(s => s.trim());
    if (!quote || !author) return m.reply(func.example(cmd, `Hidup itu perjuangan | $global.botname}`));
    let pfp;
    try {
      pfp = await erlic.profilePictureUrl(m.sender, 'image');
    } catch {
      pfp = global.thumb; 
    }
    const apiUrl = `https://api.siputzx.my.id/api/m/quote-gen?text=${encodeURIComponent(quote)}&author=${encodeURIComponent(author)}&image=${encodeURIComponent(pfp)}`;
    const res = await axios.get(apiUrl, { responseType: 'arraybuffer' });
    const hasil = Buffer.from(res.data, 'binary');
    await erlic.sendMessage(m.chat, { image: hasil, caption: mess.ok }, { quoted: m });
  } catch (err) {
    console.error(err);
    m.reply(mess.error);
  }
  break;
}
        
case 'arti_nama': {
  if (!text) return m.reply(func.example(cmd, `${global.botname}`));
  try {
    await erlic.sendMessage(m.chat, { react: { text: '🕒', key: m.key } });
    const url = `https://api.siputzx.my.id/api/primbon/artinama?nama=${encodeURIComponent(text)}`;
    const res = await axios.get(url);
    if (!res.data?.status || !res.data.data) return m.reply('Gagal mengambil data.');
    const { nama, arti, catatan } = res.data.data;
    let hasil = `乂 *PRIMBON ARTI NAMA*\n\n- *Nama: ${nama}*\n`;
    hasil += `${arti.trim()}\n\n`;
    if (catatan) hasil += `- *Catatan:*\n${catatan}`;
    m.reply(hasil);
  } catch (err) {
    console.error(err);
    m.reply(mess.error);
  }
  break;
}
        
case 'kecocokan_pasangan': {
  const [nama1, nama2] = text.split(/[|,]/).map(a => a.trim());
  if (!nama1 || !nama2) return m.reply(func.example(cmd, `nathan, dimas`));
  try {
    await erlic.sendMessage(m.chat, { react: { text: '🕒', key: m.key } });
    const url = `https://api.siputzx.my.id/api/primbon/kecocokan_nama_pasangan?nama1=${encodeURIComponent(nama1)}&nama2=${encodeURIComponent(nama2)}`;
    const res = await axios.get(url);
    if (!res.data?.status || !res.data.data) return m.reply('Gagal mengambil data.');
    const {
      nama_anda,
      nama_pasangan,
      sisi_positif,
      sisi_negatif,
      gambar,
      catatan
    } = res.data.data;
    let hasil = `乂 KECOCOKAN PASANGAN\n\n`;
    hasil += `- Nama Anda: *${nama_anda}*\n`;
    hasil += `- Pasangan: *${nama_pasangan}*\n\n`;
    hasil += `- *Sisi Positif:* ${sisi_positif}\n`;
    hasil += `- *Sisi Negatif:* ${sisi_negatif}\n\n`;
    if (catatan) hasil += `- *Catatan:*\n${catatan}`;
    await erlic.sendMessage(m.chat, {
      text: hasil }, { quoted: m });
  } catch (err) {
    console.error(err);
    m.reply(mess.error);
  }
  break;
}
        
case 'nomor_hoki': {
  if (!text) return m.reply(func.example(cmd, '628xxxxx'));
  try {
    await erlic.sendMessage(m.chat, { react: { text: '🕒', key: m.key } });
    const url = `https://api.siputzx.my.id/api/primbon/nomorhoki?phoneNumber=${encodeURIComponent(text)}`;
    const res = await axios.get(url);
    if (!res.data?.status || !res.data.data) return m.reply('Gagal mengambil data.');
    const data = res.data.data;
    const { value, description } = data.angka_bagua_shuzi;
    const ep = data.energi_positif;
    const en = data.energi_negatif;
    let hasil = `乂 NOMOR HOKI\n\n`;
    hasil += `Nomor: *${data.nomor}*\n\n`;
    hasil += `*Angka Bagua Shuzi:* ${value}%\n`;
    hasil += `${description}\n\n`;
    hasil += `*Energi Positif:* ${ep.total}%\n`;
    hasil += `• Kekayaan: ${ep.details.kekayaan}\n`;
    hasil += `• Kesehatan: ${ep.details.kesehatan}\n`;
    hasil += `• Cinta: ${ep.details.cinta}\n`;
    hasil += `• Kestabilan: ${ep.details.kestabilan}\n\n`;
    hasil += `*Energi Negatif:* ${en.total}%\n`;
    hasil += `• Perselisihan: ${en.details.perselisihan}\n`;
    hasil += `• Kehilangan: ${en.details.kehilangan}\n`;
    hasil += `• Malapetaka: ${en.details.malapetaka}\n`;
    hasil += `• Kehancuran: ${en.details.kehancuran}\n\n`;
    hasil += `- *Catatan:*\n${data.analisis.description}`;
    await erlic.sendMessage(m.chat, { text: hasil }, { quoted: m });
  } catch (err) {
    console.error(err);
    m.reply(mess.error);
  }
  break;
}
        
case 'tafsir_mimpi': {
  if (!text) return m.reply(func.example(cmd, 'bertemu'));
  try {
    await erlic.sendMessage(m.chat, { react: { text: '🕒', key: m.key } });
    const url = `https://api.siputzx.my.id/api/primbon/tafsirmimpi?mimpi=${encodeURIComponent(text)}`;
    const res = await axios.get(url);
    if (!res.data?.status || !res.data.data) return m.reply('Gagal mengambil data.');
    const d = res.data.data;
    const hasilList = d.hasil
      .map((h, i) => `*${i + 1}.* ${h.mimpi}\n*Tafsir:* ${h.tafsir}`)
      .join('\n\n');
    const teks = `乂 *TAFSIR MIMPI*\n\n` +
                 `*Kata Kunci:* ${d.keyword}\n` +
                 `*Total Tafsir:* ${d.total}\n\n` +
                 `${hasilList}\n\n` +
                 `*Solusi Jika Mimpi Buruk:*\n${d.solusi.trim()}`;
    await erlic.sendMessage(m.chat, { text: teks }, { quoted: m });
  } catch (err) {
    console.error(err);
    m.reply(mess.error);
  }
  break;
}
        
case 'potensi_penyakit': {
  if (!text) return m.reply(func.example(cmd, '12 05 1998'));
  let [tgl, bln, thn] = text.split(/[\/\-\s\.]+/);
  if (!tgl || !bln || !thn) return m.reply('Format salah! Gunakan: 12 05 1998');
  try {
    await erlic.sendMessage(m.chat, { react: { text: '🕒', key: m.key } });
    const res = await axios.get(`https://api.siputzx.my.id/api/primbon/cek_potensi_penyakit?tgl=${tgl}&bln=${bln}&thn=${thn}`);
    if (!res.data?.status || !res.data.data) return m.reply('Gagal mengambi data.');
    const d = res.data.data;
    const hasil = `乂 *POTENSI PENYAKIT*\n\n` +
                  `*Input:* ${text}\n\n` +
                  `*Analisa:* ${d.analisa}\n\n` +
                  `*Sektor:* ${d.sektor}\n\n` +
                  `*Elemen:* ${d.elemen}\n\n` +
                  `*Catatan:*\n${d.catatan}`;
    await erlic.sendMessage(m.chat, { text: hasil }, { quoted: m });
  } catch (err) {
    console.error(err);
    m.reply(mess.error);
  }
  break;
}
        
case 'ramalan_jodoh_bali': {
  if (!text) return m.reply(func.example(cmd, 'nathan|12|12|2009|dimas|1|1|2008'));
  let [nama1, tgl1, bln1, thn1, nama2, tgl2, bln2, thn2] = text.split('|');
  if (!nama1 || !tgl1 || !bln1 || !thn1 || !nama2 || !tgl2 || !bln2 || !thn2) {
    return m.reply('Format salah!\nContoh: nathan|12|12|2009|dimas|1|1|2008');
  }
  try {
    await erlic.sendMessage(m.chat, { react: { text: '🕒', key: m.key } });
    const url = `https://api.siputzx.my.id/api/primbon/ramalanjodohbali?nama1=${encodeURIComponent(nama1)}&tgl1=${tgl1}&bln1=${bln1}&thn1=${thn1}&nama2=${encodeURIComponent(nama2)}&tgl2=${tgl2}&bln2=${bln2}&thn2=${thn2}`;
    const res = await axios.get(url);
    if (!res.data?.status || !res.data.data) return m.reply('Gagal mengambil data.');
    const d = res.data.data;
    const hasil = `乂 *RAMALAN JODOH BALI*\n\n` +
                  `*Nama Anda:* ${d.nama_anda.nama}\n*Tgl Lahir:* ${d.nama_anda.tgl_lahir}\n\n` +
                  `*Nama Pasangan:* ${d.nama_pasangan.nama}\n*Tgl Lahir:* ${d.nama_pasangan.tgl_lahir}\n\n` +
                  `*Hasil Ramalan:*\n${d.result}\n\n` +
                  `*Catatan:*\n${d.catatan}`;
    await erlic.sendMessage(m.chat, { text: hasil }, { quoted: m });
  } catch (err) {
    console.error(err);
    m.reply(mess.error);
  }
  break;
}
        
case 'ramalan_jodoh': {
  if (!text) return m.reply(func.example(cmd, 'nathan|12|12|2009|dimas|1|1|2008'));
  let [nama1, tgl1, bln1, thn1, nama2, tgl2, bln2, thn2] = text.split('|');
  if (!nama1 || !tgl1 || !bln1 || !thn1 || !nama2 || !tgl2 || !bln2 || !thn2) {
    return m.reply('Format salah!\nContoh: nathan|12|12|2009|dimas|1|1|2008');
  }
  try {
    await erlic.sendMessage(m.chat, { react: { text: '🕒', key: m.key } });
    const url = `https://api.siputzx.my.id/api/primbon/ramalanjodoh?nama1=${encodeURIComponent(nama1)}&tgl1=${tgl1}&bln1=${bln1}&thn1=${thn1}&nama2=${encodeURIComponent(nama2)}&tgl2=${tgl2}&bln2=${bln2}&thn2=${thn2}`;
    const res = await axios.get(url);
    if (!res.data?.status || !res.data.data) return m.reply('Gagal mengambil data.');
    const d = res.data.data.result;
    const hasil = d.hasil_ramalan.map((r, i) => `${i + 1}. ${r}`).join('\n');
    const teks = `乂 *RAMALAN JODOH*\n\n` +
                 `*Nama Anda:* ${d.orang_pertama.nama}\n*Tgl Lahir:* ${d.orang_pertama.tanggal_lahir}\n\n` +
                 `*Nama Pasangan:* ${d.orang_kedua.nama}\n*Tgl Lahir:* ${d.orang_kedua.tanggal_lahir}\n\n` +
                 `*Deskripsi:*\n${d.deskripsi}\n\n` +
                 `*Hasil Ramalan:*\n${hasil}\n\n` +
                 `*Peringatan:*\n${res.data.peringatan}`;
    await erlic.sendMessage(m.chat, { text: teks }, { quoted: m });
  } catch (err) {
    console.error(err);
    m.reply(mess.error);
  }
  break;
}
        
case 'rezeki_hoki_weton': {
  if (!text) return m.reply(func.example(cmd, '1|1|2025'));
  let [tgl, bln, thn] = text.split('|');
  if (!tgl || !bln || !thn) {
    return m.reply('Format salah!\nContoh: 1|1|2025');
  }
  try {
    await erlic.sendMessage(m.chat, { react: { text: '🕒', key: m.key } });
    const url = `https://api.siputzx.my.id/api/primbon/rejeki_hoki_weton?tgl=${tgl}&bln=${bln}&thn=${thn}`;
    const res = await axios.get(url);
    if (!res.data?.status || !res.data.data) return m.reply('Gagal mengambil data.');
    const d = res.data.data;
    const teks = `乂 *REZEKI & HOKI WETON*\n\n` +
                 `*Hari Lahir:* ${d.hari_lahir}\n\n` +
                 `*Ramalan Rezeki:*\n${d.rejeki.trim()}\n\n` +
                 `*Catatan:*\n${d.catatan}`;
    await erlic.sendMessage(m.chat, { text: teks }, { quoted: m });
  } catch (err) {
    console.error(err);
    m.reply(mess.error);
  }
  break;
}
        
case 'sifat_usaha_bisnis': {
  if (!text) return m.reply(func.example(cmd, '1|1|2025'));
  let [tgl, bln, thn] = text.split('|');
  if (!tgl || !bln || !thn) {
    return m.reply('Format salah!\nContoh: 1|1|2025');
  }
  try {
    await erlic.sendMessage(m.chat, { react: { text: '🕒', key: m.key } });
    const url = `https://api.siputzx.my.id/api/primbon/sifat_usaha_bisnis?tgl=${tgl}&bln=${bln}&thn=${thn}`;
    const res = await axios.get(url);
    if (!res.data?.status || !res.data.data) return m.reply('Gagal mengambil data.');
    const d = res.data.data;
    const teks = `乂 *SIFAT USAHA & BISNIS*\n\n` +
                 `*Hari Lahir:* ${d.hari_lahir}\n\n` +
                 `*Karakter Bisnis:*\n${d.usaha.trim()}\n\n` +
                 `*Catatan:*\n${d.catatan}`;
    await erlic.sendMessage(m.chat, { text: teks }, { quoted: m });
  } catch (err) {
    console.error(err);
    m.reply(mess.error);
  }
  break;
}

case 'restart': {
  if (!isCreator) m.reply(mess.owner);
  m.reply(monospace('Restarting...')).then(() => {
    process.send('reset');
  });
}
  break
        
case 'setppbot': {
  const quoted = m.quoted ? m.quoted : m.msg?.contextInfo?.quotedMessage ? m : null;
  const mime = quoted?.mimetype || quoted?.msg?.mimetype || '';
  if (!quoted || !/image\/(jpe?g|png)/.test(mime)) {
    return m.reply(`Kirim atau reply gambar dengan caption *${prefix + command}* untuk mengubah foto profil bot.`);
  }
  try {
    await erlic.sendMessage(m.chat, { react: { text: '🕒', key: m.key } });
    const media = await quoted.download?.() || await erlic.downloadMediaMessage(quoted);
    if (!media) return m.reply('Gagal mengunduh gambar.');
    const arg0 = m.args && m.args[0] ? m.args[0] : '';
    if (/^(full|panjang)$/i.test(arg0)) {
      const { img } = await resize(media);
      await erlic.query({
        tag: 'iq',
        attrs: {
          to: erlic.user.id,
          type: 'set',
          xmlns: 'w:profile:picture'
        },
        content: [{
          tag: 'picture',
          attrs: { type: 'image' },
          content: img
        }]
      });
    } else {
      await erlic.updateProfilePicture(erlic.user.id, media);
    }
    await erlic.sendMessage(m.chat, { react: { text: '✅', key: m.key } });
  } catch (e) {
    console.error(e);
    await erlic.sendMessage(m.chat, { react: { text: '❌', key: m.key } });
    m.reply(mess.error);
  }
}
break
        
case 'tanggal': case 'date': { const today = new Date(); const date = new Date(today.toLocaleString("en-US", {timeZone: "Asia/Jakarta"})); const hours = date.getHours(); const minutes = date.getMinutes(); const day = today.getDate(); const month = today.getMonth() + 1; const year = today.getFullYear(); const dayOfWeek = today.toLocaleDateString("id-ID", { weekday: "long" }); const timeNow = `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}`; const getTodayDate = `Hari ini adalah ${dayOfWeek}, ${day}/${month}/${year} pukul ${timeNow} WIB`; m.reply(getTodayDate); } break;

case "addidch": case "addch": {
if (!isCreator) return Reply(mess.owner)
if (!text) return m.reply(example("idchnya"))
if (!text.endsWith("@newsletter")) return m.reply("Id channel tidak valid")
let input = text
if (listidch.includes(input)) return m.reply(`Id ${input2} sudah terdaftar!`)
listidch.push(input)
await fs.writeFileSync("./database/erlicch.json", JSON.stringify(listidch, null, 2))
m.reply(`Berhasil menambah id ${text} kedalam database`)
}
break

case "delidch": case "delch": {
if (!isCreator) return Reply(mess.owner)
if (listidch.length < 1) return m.reply("Tidak ada id channel di database")
if (!text) return m.reply(example("idchnya"))
if (text.toLowerCase() == "all") {
listidch.splice(0, listidch.length)
await fs.writeFileSync("./database/erlicch.json", JSON.stringify(listidch))
return m.reply(`Berhasil menghapus semua id channel dari database`)
}
if (!text.endsWith("@newsletter")) return m.reply("Id channel tidak valid")
let input = text
if (!listidch.includes(input)) return m.reply(`Id ${input2} tidak terdaftar!`)
const pos = listidch.indexOf(input)
listidch.splice(pos, 1)
await fs.writeFileSync("./database/erlicch.json", JSON.stringify(listidch, null, 2))
m.reply(`Berhasil menghapus id ${text} dari database`)
}
break

case "listidch": case "listch": {
if (listidch.length < 1) return m.reply("Tidak ada id channel di database")
let teks = ` *乂 LIST ID CHANNEL*\n`
for (let i of listidch) {
teks += `\n*- ${i}\n*`
}
erlic.sendMessage(m.chat, {text: teks, mentions: premium}, {quoted: m})
}
break

case "jpmch": case "jpmallch": {
  if (!isCreator) return m.reply(mess.owner);
  if (listidch.length < 1) return m.reply("Tidak ada id ch didalam database");
  if (!q) return m.reply(example("teksnya bisa dengan kirim foto juga"));
  const quoted = m.quoted || null;
  const mime = quoted?.mimetype || quoted?.msg?.mimetype || '';
  const fs = require('fs');
  let rest;
  if (/image\/(jpe?g|png)/.test(mime)) {
    try {
      const media = await quoted.download?.() || await erlic.downloadMediaMessage(quoted);
      const path = `./sampah/${Date.now()}.jpg`;
      await fs.promises.writeFile(path, media);
      rest = path;
    } catch (err) {
      console.error('Gagal mengunduh media:', err);
      return m.reply('Gagal mengambil gambar dari pesan yang dibalas.');
    }
  }
  const allgrup = listidch;
  let count = 0;
  const ttks = text;
  const pesancoy = rest
    ? { image: await fs.readFileSync(rest), caption: ttks }
    : { text: ttks };
  const opsijpm = rest ? "teks & foto" : "teks";
  const jid = m.chat;
  await m.reply(`Memproses jpmch *${opsijpm}* ke ${allgrup.length} channel`);
  for (let i of allgrup) {
    try {
      await erlic.sendMessage(i, pesancoy);
      count += 1;
    } catch (err) {
      console.log(`Gagal kirim ke ${i}:`, err.message);
    }
    await sleep(global.delayJpm);
  }
  await erlic.sendMessage(jid, {
    text: `Jpmch *${opsijpm}* berhasil dikirim ke ${count} channel`
  }, { quoted: m });
}
break;

 case 'setcover': {
    if (!isCreator) return m.reply(mess.owner);
    const quoted = m.quoted || m.msg?.contextInfo?.quotedMessage ? m.quoted : null;
    if (!quoted) return m.reply(`Kirim atau reply gambar dengan caption *${prefix + command}* untuk mengatur cover bot.`);
    const mime = quoted.mimetype || quoted.mediaType || '';
    if (!/image\/(jpe?g|png|gif)/i.test(mime)) {
        return m.reply(`Reply gambar dengan caption *${prefix + command}*`);
    }
    try {
        await erlic.sendMessage(m.chat, { react: { text: '🕒', key: m.key } });
        const media = await quoted.download();
        const result = await upload(media);
        if (!result.status) return m.reply(result.message);
        global.thumb = result.url;
        await erlic.sendMessage(m.chat, { react: { text: '✅', key: m.key } });
        m.reply(`Cover bot berhasil diperbarui!\n\nURL: ${result.url}`);
    } catch (e) {
        console.error(e);
        await erlic.sendMessage(m.chat, { react: { text: '❌', key: m.key } });
        m.reply(mess.error);
    }
}
break
        
 case 'setlink': {
  if (!isCreator) return m.reply(mess.owner);
  let link = m.text ? m.text.trim().split(' ').slice(1).join(' ') : '';
  if (!link || !link.startsWith('https://')) {
    return m.reply(func.example(cmd, 'https://example.com'));
  }
  if (global.link === link) return m.reply('Link already this.');
  global.link = link;
  m.reply('Link berhasil diperbarui!');
}
break;
        
 case 'setusername': {
  if (!isCreator) return m.reply(mess.owner);
  const text = m.text ? m.text.trim().split(' ').slice(1).join(' ') : '';
  if (!text) return m.reply(func.example(cmd, 'erlic4'));
  try {
    await erlic.updateProfileName(text);
    m.reply(`Username bot berhasil diubah menjadi: ${text}`);
  } catch (e) {
    console.error(e);
    m.reply(mess.error);
  }
}
break;
        
case 'setbotname': {
  if (!isCreator) return m.reply(mess.owner);
  const text = m.text ? m.text.trim().split(' ').slice(1).join(' ') : '';
  if (!text) return m.reply(func.example(cmd, 'erlic4'));
  try {
    global.botname = text;
    m.reply(`Nama bot berhasil diubah menjadi: ${global.botname}`);
  } catch (e) {
    console.error(e);
    m.reply(mess.error);
  }
}
break;
        
case 'setwm': case 'setwatermark': {
  if (!isCreator) return m.reply(mess.owner);
  if (!text.includes('|')) return m.reply(func.example(cmd, 'Stiker by erlic|+week, +date\n\n+week untuk hari\n+date untuk tanggal\n+time untuk waktu\n+name untuk nama'));
  let [packname, author] = text.split('|');
  packname = packname?.trim();
  author = author?.trim();
  if (packname === "''") packname = '';
  if (author === "''") author = '';
  if (packname !== undefined) global.packname = packname;
  if (author !== undefined) global.author = author;
  m.reply(`Watermark berhasil diperbarui sebagai template!\n${packname !== undefined ? `• Packname: ${global.packname || '(kosong)'}` : ''}${author !== undefined ? `\n• Author: ${global.author || '(kosong)'}` : ''}`);
}
break;
        
case 'addowner': {
    if (!isCreator) return m.reply(mess.owner)

    let nomor = m.mentionedJid?.[0] || (args[0] && args[0].replace(/\D/g, '') + '@s.whatsapp.net')
    if (!nomor) return m.reply(`Contoh: ${prefix + command} @user atau nomor`)

    if (global.prems.includes(nomor)) return m.reply('User sudah menjadi owner.')
    global.prems.push(nomor)
    erlic.sendMessage(m.chat, {
        text: `Berhasil menambahkan owner: @${nomor.split('@')[0]}`,
        contextInfo: { mentionedJid: [nomor] }
    }, { quoted: m })
}
break

case 'delowner': {
    if (!isCreator) return m.reply(mess.owner)

    let nomor = m.mentionedJid?.[0] || (args[0] && args[0].replace(/\D/g, '') + '@s.whatsapp.net')
    if (!nomor) return m.reply(`Contoh: ${prefix + command} @user atau nomor`)

    if (!global.prems.includes(nomor)) return m.reply('User bukan owner.')
    global.prems = global.prems.filter(v => v !== nomor)
    erlic.sendMessage(m.chat, {
        text: `Berhasil menghapus owner: @${nomor.split('@')[0]}`,
        contextInfo: { mentionedJid: [nomor] }
    }, { quoted: m })
}
break

case 'listowner': {
    if (!isCreator) return m.reply(mess.owner)
    let list = []
    let count = 1
    for (let dev of global.developer) {
        list.push(`${count++}. @${dev.replace(/\D/g, '')} (Developer)`)
    }
    for (let own of global.owner) {
        if (!global.developer.includes(own)) {
            list.push(`${count++}. @${own.replace(/\D/g, '')}`)
        }
    }
    for (let prem of global.prems) {
        if (![...global.developer, ...global.owner].includes(prem)) {
            list.push(`${count++}. @${prem.replace(/\D/g, '')}`)
        }
    }
    if (list.length === 0) return m.reply('Belum ada owner.')
    let teks = `乂  *LIST OWNER*\n\n` + list.join('\n')
    erlic.sendMessage(m.chat, {
        text: teks,
        contextInfo: {
            mentionedJid: [...new Set([...global.developer, ...global.owner, ...global.prems])]
        }
    }, { quoted: m })
}
break
        
case 'extract': { if (!isCreator) return m.reply(mess.owner); if (!m.quoted) return m.reply('Reply contacts'); let data = JSON.parse(JSON.stringify(m.quoted)); const extractedNumbers = []; if (!data.contacts || !Array.isArray(data.contacts)) return m.reply("No contacts found in the quoted message."); data.contacts.forEach(contact => { const vcard = contact.vcard; const telMatch = vcard.match(/waid=(\d+)/); if (telMatch) extractedNumbers.push({ name: contact.displayName, number: `${telMatch[1]}@s.whatsapp.net` }); }); if (extractedNumbers.length === 0) return m.reply("No WhatsApp numbers found in the contacts."); m.reply(JSON.stringify(extractedNumbers, null, 2)); } break;
        
case 'setbio': {
  if (!isCreator) return m.reply(mess.owner);
  const text = m.text ? m.text.trim().split(' ').slice(1).join(' ') : '';
  if (!text) return m.reply(func.example(cmd, 'cukup donasi'));
  try {
    await erlic.updateProfileStatus(text);
    m.reply(`Bio bot berhasil diubah menjadi: ${text}`);
  } catch (e) {
    console.error(e);
    m.reply(mess.error);
  }
}
break;
        
case 'setfont': {
  try {
    if (!isCreator) return m.reply(mess.owner);
    if (!text || isNaN(text)) return m.reply(func.example(cmd, '1'));
    const num = parseInt(text);
    const { yStr } = require('./system/font.js');
    const totalFont = Object.keys(yStr).length;
    if (!yStr[num]) return m.reply(`Font tidak tersedia. Gunakan angka 1 - ${totalFont}`);
    global.font = num;
    m.reply(styles('Teks di menu akan terlihat seperti ini.', global.font));
  } catch (e) {
    console.error(e);
    m.reply(mess.error);
  }
  break;
}
        
case 'listfont': {
  try {
    const { styles, yStr } = require('./system/font.js');
    const totalFont = Object.keys(yStr).length;
    const sampleText = `abcdefghijklmnopqrstuvwxyz 1234567890`;
    let list = `乂 *L I S T - F O N T*\n\n`;
    for (let i = 1; i <= totalFont; i++) {
      list += `${i}. ${styles(sampleText, i)}\n\n`;
    }
    m.reply(list.trim());
  } catch (e) {
    console.error(e);
    m.reply(mess.error);
  }
  break;
    }
        
case 'wikipedia': {
  if (!text) return erlic.sendMessage(m.chat, { text: func.example(cmd, 'prabowo subianto') }, { quoted: m });
  await erlic.sendMessage(m.chat, { react: { text: '🕒', key: m.key } });
  try {
    const url = `https://api.siputzx.my.id/api/s/wikipedia?query=${encodeURIComponent(text)}`;
    const { data } = await axios.get(url);

    if (!data.status || !data.data || !data.data.wiki) {
      return m.reply(mess.error);
    }
    await erlic.sendMessage(m.chat, {
      image: { url: data.data.thumb },
      caption: data.data.wiki
    }, { quoted: m });
    await erlic.sendMessage(m.chat, { react: { text: '✅', key: m.key } });

  } catch (err) {
    console.error(err);
    m.reply(mess.error);
  }
  break;
}
        
case 'applemusic': case 'appms': {
    const axios = require('axios')
  if (!text) return erlic.sendMessage(m.chat, { text: func.example(cmd, 'strawberry champagne') }, { quoted: m });
  await erlic.sendMessage(m.chat, { react: { text: '🕒', key: m.key } });
  try {
    const url = `https://api.siputzx.my.id/api/s/applemusic?query=${encodeURIComponent(text)}&region=id`;
    const { data } = await axios.get(url);
    if (!data.status || !data.data || !data.data.result || data.data.result.length === 0) {
      return m.reply('Hasil tidak ditemukan.');
    }
    const results = data.data.result;
    const first = results[0];
    let teks = `乂  *APPLE MUSIC SEARCHING*\n\n`;
    teks += `◦ *Title:* ${first.title}\n`;
    teks += `◦ *Artist:* ${first.artist}\n`;
    teks += `◦ *Link:* ${first.link}\n`;
    if (results.length > 1) {
      teks += `\n*Hasil lainnya:*\n`;
      for (let i = 1; i < results.length; i++) {
        teks += `\n${i + 1}. ${results[i].title}\n- ${results[i].artist}\n- ${results[i].link}\n`;
      }
    }
    await erlic.sendMessage(m.chat, {
      text: teks,
      contextInfo: {
        externalAdReply: {
          title: first.title,
          body: first.artist,
          thumbnailUrl: first.image,
          sourceUrl: first.link,
          mediaType: 1,
          renderLargerThumbnail: true,
          showAdAttribution: true
        }
      }
    }, { quoted: m });
    await erlic.sendMessage(m.chat, { react: { text: '✅', key: m.key } });
  } catch (err) {
    console.error(err);
    m.reply(mess.error);
  }
  break;
}
        
case 'bingimg': {
    const axios = require('axios')
  if (!text) return erlic.sendMessage(m.chat, { text: func.example(cmd, 'kucing') }, { quoted: qtext });
  await erlic.sendMessage(m.chat, { react: { text: '🕒', key: m.key } });
  try {
    const url = `https://api.siputzx.my.id/api/s/bimg?query=${encodeURIComponent(text)}`;
    const { data } = await axios.get(url);
    if (!data.status || !data.data || data.data.length === 0) {
      return m.reply('Gambar tidak ditemukan.');
    }
    const results = data.data;
    if (!isPrem) {
      await erlic.sendMessage(m.chat, {
        image: { url: results[0] },
        caption: `Hasil dari pencarian: ${text}`
      }, { quoted: m });
    } else {
      const total = results.slice(0, 6);
      m.reply(`Ditemukan ${total.length} foto, tunggu sedang mengirim...`);
      for (let i = 0; i < total.length; i++) {
        await erlic.sendMessage(m.chat, {
          image: { url: total[i] },
          ...(i === 0 ? { caption: `Hasil dari pencarian: ${text}` } : {})
        }, { quoted: m });
        if (i < total.length - 1) await new Promise(resolve => setTimeout(resolve, 2000));
      }
    }
    await erlic.sendMessage(m.chat, { react: { text: '✅', key: m.key } });

  } catch (err) {
    console.error(err);
    m.reply(mess.error);
  }
  break;
}
        
case 'brave': {
  const axios = require('axios');
  if (!text) return erlic.sendMessage(m.chat, { text: func.example(cmd, 'apa itu nodejs') }, { quoted: m });
  await erlic.sendMessage(m.chat, { react: { text: '🕒', key: m.key } });
  try {
    const res = await axios.get(`https://api.siputzx.my.id/api/s/brave?query=${encodeURIComponent(text)}`);
    const json = res.data;
    if (!json.status || !json.data || !json.data.results || json.data.results.length === 0) {
      return m.reply('Hasil tidak ditemukan.');
    }
    const results = json.data.results;
    let teks = `乂 *BRAVE SEARCHING*\n\n*Pencarian:* ${text}\n\n`;
    for (let i = 0; i < results.length; i++) {
      const result = results[i];
      teks += `${i + 1}. ${result.title}\n`;
      teks += `- Site: ${result.siteName || '-'}\n`;
      teks += `- Date: ${result.date || '-'}\n`;
      teks += `- Description: ${result.description || '-'}\n\n`;
    }
    erlic.sendMessage(m.chat, { text: teks.trim() }, { quoted: m });

  } catch (e) {
    console.error(e);
    m.reply(mess.error);
  }
  break;
    }
        
case 'google-image': case 'gimage': {
  const axios = require('axios');
  if (!text) return erlic.sendMessage(m.chat, { text: func.example(cmd, 'kucing lucu') }, { quoted: m });
  await erlic.sendMessage(m.chat, { react: { text: '🕒', key: m.key } });
  try {
    const res = await axios.get(`https://api.siputzx.my.id/api/images?query=${encodeURIComponent(text)}`);
    const json = res.data;
    if (!json.status || !json.data || json.data.length === 0) {
      return m.reply('Hasil tidak ditemukan.');
    }
    const hasil = json.data.slice(0, 6).map((v, i) => ({
      image: { url: v.url }
    }));
    for (const img of hasil) {
      await erlic.sendMessage(m.chat, { image: { url: img.image.url }}, { quoted: m });
    }
  } catch (e) {
    console.error(e);
    m.reply(mess.error);
  }
  break;
    }
      
        
case 'ytsearch': case 'yts': {
  const axios = require('axios');
  if (!text) return erlic.sendMessage(m.chat, { text: func.example(cmd, 'terlalu tinggi') }, { quoted: m });
  await erlic.sendMessage(m.chat, { react: { text: '🕒', key: m.key } });
  try {
    const res = await axios.get(`https://api.siputzx.my.id/api/s/youtube?query=${encodeURIComponent(text)}`);
    const json = res.data;
    if (!json.status || !json.data || json.data.length === 0) {
      return m.reply('Hasil tidak ditemukan.');
    }
    let hasil = `乂 YOUTUBE SEARCHING\n\nPencarian: *${text}*\n\n`;
    for (let i = 0; i < json.data.length; i++) {
      const vid = json.data[i];
      if (vid.type !== 'video') continue;
      hasil += `${i + 1}. *${vid.title}*\n`;
      hasil += `- Channel: ${vid.author?.name || 'Tidak diketahui'}\n`;
      hasil += `- Durasi: ${vid.duration?.timestamp || '-'}\n`;
      hasil += `- Views: ${vid.views?.toLocaleString() || '0'}\n`;
      hasil += `- Uploaded: ${vid.ago || '-'}\n`;
      hasil += `- Link: ${vid.url}\n\n`;
    }
    erlic.sendMessage(m.chat, { text: hasil.trim() }, { quoted: m });
  } catch (e) {
    console.error(e);
    m.reply(mess.error);
  }
  break;
}
        
case 'tiktoksearch': case 'ttsearch': {
  const axios = require('axios');
  if (!text) return erlic.sendMessage(m.chat, { text: func.example(cmd, 'aesthetic') }, { quoted: m });
  await erlic.sendMessage(m.chat, { react: { text: '🕒', key: m.key } });
  try {
    const { data } = await axios.get(`https://api.siputzx.my.id/api/s/tiktok?query=${encodeURIComponent(text)}`);
    if (!data.status || !data.data || data.data.length === 0) 
      return m.reply('Tidak ditemukan!');
    let hasil = '乂 *TIKTOK SEARCHING*\n\n';
    for (const v of data.data) {
      hasil += `- *Title:* ${v.title || '-'}\n` +
               `- *Author:* ${v.author?.nickname || '-'} (@${v.author?.unique_id})\n` +
               `- *Durasi:* ${v.duration}s\n` +
               `- *Views:* ${v.play_count.toLocaleString()}\n` +
               `- *Link:* ${v.play}\n\n`;
    }
    await erlic.sendMessage(m.chat, { text: hasil.trim() }, { quoted: m });
  } catch (e) {
    console.error(e);
    m.reply(mess.error);
  }
}
break;
     
case 'countryinfo': {
  const axios = require('axios');
  if (!text) return erlic.sendMessage(m.chat, { text: func.example(cmd, 'indonesia') }, { quoted: m });
  await erlic.sendMessage(m.chat, { react: { text: '🕒', key: m.key } });
  try {
    const { data } = await axios.get(`https://api.siputzx.my.id/api/tools/countryInfo?name=${encodeURIComponent(text)}`);
    if (!data.status) return m.reply('Negara tidak ditemukan!');
    const info = data.data;
    const pesan = `乂 *COUNTRY INFORMATION*\n\n` +
      `- *Name:* ${info.name}\n` +
      `- *Capital:* ${info.capital}\n` +
      `- *Continent:* ${info.continent.name} ${info.continent.emoji}\n` +
      `- *Phone code:* ${info.phoneCode}\n` +
      `- *Coordinate:* ${info.coordinates.latitude}, ${info.coordinates.longitude}\n` +
      `- *Wide:* ${info.area.squareKilometers.toLocaleString()} km² (${info.area.squareMiles.toLocaleString()} mil²)\n` +
      `- *Landlocked:* ${info.landlocked ? 'Ya' : 'Tidak'}\n` +
      `- *Language:* ${info.languages.native.join(', ')}\n` +
      `- *Known for:* ${info.famousFor}\n` +
      `- *Form of government:* ${info.constitutionalForm}\n` +
      `- *Currency:* ${info.currency}\n` +
      `- *Driving side:* ${info.drivingSide}\n` +
      `- *Alcohol ban:* ${info.alcoholProhibition}\n` +
      `- *Domain Internet:* ${info.internetTLD}\n` +
      `- *Kode ISO:* ${info.isoCode.alpha2} / ${info.isoCode.alpha3} / ${info.isoCode.numeric}\n` +
      `- *Google Maps:* ${info.googleMapsLink}`;
    await erlic.sendMessage(m.chat, {
      text: pesan,
      contextInfo: {
        externalAdReply: {
          title: info.name.toUpperCase() + ' - COUNTRY\'S',
          body: 'Capital: ' + info.capital,
          thumbnailUrl: info.flag,
          sourceUrl: global.link,
          mediaType: 2,
          renderLargerThumbnail: true,
          showAdAttribution: true
        }
      }
    }, { quoted: m });
  } catch (e) {
    console.error(e);
    m.reply(mess.error + '\nGunakan bahasa inggris di format negara.');
  }
}
break;
        
case 'ssweb': {
  const axios = require('axios');
  if (!text) return erlic.sendMessage(m.chat, { text: func.example(cmd, 'https://example.com') }, { quoted: m });
  await erlic.sendMessage(m.chat, { react: { text: '🕒', key: m.key } });
  try {
    const response = await axios.get(`https://api.siputzx.my.id/api/tools/ssweb?url=${encodeURIComponent(text)}`, {
      responseType: 'arraybuffer'
    });
    const buffer = Buffer.from(response.data, 'binary');
    await erlic.sendMessage(m.chat, {
      image: buffer,
      caption: mess.ok
    }, { quoted: m });
  } catch (e) {
    console.error(e);
    m.reply(mess.error);
  }
}
break;
        
 case 'text2speech': case 'tts': {
  const axios = require('axios');
  if (!text) return erlic.sendMessage(m.chat, { text: func.example(cmd, 'halo') }, { quoted: m });
  await erlic.sendMessage(m.chat, { react: { text: '🕒', key: m.key } });
  try {
    const res = await axios.get(`https://api.siputzx.my.id/api/tools/ttsgoogle?text=${encodeURIComponent(text)}`, {
      responseType: 'arraybuffer',
      headers: {
        'Accept': 'audio/mpeg'
      }
    });
    const audioBuffer = Buffer.from(res.data, 'utf-8');
    await erlic.sendMessage(m.chat, {
      audio: audioBuffer,
      mimetype: 'audio/mpeg',
      ptt: true
    }, { quoted: m });
  } catch (e) {
    console.error(e);
    m.reply(mess.error);
  }
}
break;
        
case 'kisahnabi': {
if (!text) return m.reply(func.example(cmd, 'Adam AS'))
try {
await erlic.sendMessage(m.chat, { react: { text: '🕒', key: m.key } })
const { default: axios } = require('axios')
const res = await axios.get(`https://api.fasturl.link/religious/prophetstory?name=${encodeURIComponent(text)}`)
const data = res.data
if (data.status !== 200 || !data.result?.length) return m.reply('Kisah tidak ditemukan!')
const k = data.result[0]
let caption = `乂 KISAH NABI\n\n`
caption += `- Nama: ${k.name}\n`
caption += `- Tempat: ${k.place}\n`
caption += `- Tahun lahir: ${k.bornYear} SM\n`
caption += `- Usia: ${k.age} tahun\n\n`
caption += `Kisah singkat:\n${k.description}`
await erlic.sendMessage(m.chat, { image: { url: k.imageUrl }, caption: caption.trim() }, { quoted: m })
} catch (e) { console.error(e); m.reply(mess.error) }
}
break
        
case 'jadwalsholat': {
if (!text) return m.reply(func.example(cmd, 'sukabumi'))
try {
await erlic.sendMessage(m.chat, { react: { text: '🕒', key: m.key } })
const { default: axios } = require('axios')
const res = await axios.get(`https://api.fasturl.link/religious/prayerschedule?city=${encodeURIComponent(text)}`)
const data = res.data
if (data.status !== 200 || !data.result) return m.reply('Jadwal tidak ditemukan!')
const j = data.result
let teks = `乂 JADWAL SHOLAT - ${j.city.toUpperCase()}\n\n`
teks += `- Subuh: ${j.todaySchedule.shubuh}\n`
teks += `- Dzuhur: ${j.todaySchedule.dzuhur}\n`
teks += `- Ashar: ${j.todaySchedule.ashr}\n`
teks += `- Maghrib: ${j.todaySchedule.maghrib}\n`
teks += `- Isya: ${j.todaySchedule.isya}\n\n`
teks += `Nearest prayer times: ${j.citynextPrayer}`
m.reply(teks.trim())
} catch (e) { console.error(e); m.reply(mess.error) }
}
break
        
case 'ttstalk':
case 'tiktokstalk': {
if (!text) return m.reply(func.example(cmd, 'ryujinshihikaru'))
try {
await erlic.sendMessage(m.chat, { react: { text: '🕒', key: m.key } })
const { default: axios } = require('axios')
const res = await axios.get(`https://api.fasturl.link/stalk/tiktok/profile?username=${encodeURIComponent(text)}`)
const d = res.data
if (d.status !== 200 || !d.result) return m.reply('Akun tidak ditemukan!')
const p = d.result
const s = p.stats || {}
const det = p.detail || {}
let teks = `乂 TIKTOK STALKING\n\n`
teks += `- Username: @${p.username}\n`
teks += `- Nickname: ${p.nickname}\n`
teks += `- Negara: ${p.country}\n`
teks += `- Bio: ${p.signature || '-'}\n`
teks += `- Verified: ${p.verified ? '✔' : '✘'}\n\n`
teks += `*Statistik:*\n`
teks += `- Followers: ${s.followerCount}\n`
teks += `- Following: ${s.followingCount}\n`
teks += `- Likes: ${s.heartCount}\n`
teks += `- Video: ${s.videoCount}\n`
teks += `- Digg: ${s.diggCount}\n`
teks += `- Teman: ${s.friendCount}\n\n`
teks += `*Detail Akun:*\n`
teks += `- ID: ${det.id}\n`
teks += `- Unique ID: ${det.uniqueId}\n`
teks += `- Nickname: ${det.nickname}\n`
teks += `- Verified: ${det.verified ? '✔' : '✘'}\n`
teks += `- Signature: ${det.signature || '-'}\n`
teks += `- Region: ${det.region || '-'}\n`
teks += `- Language: ${det.language || '-'}\n`
teks += `- Private: ${det.privateAccount ? '✔' : '✘'}\n`
teks += `- Commerce User: ${det.commerceUserInfo?.commerceUser ? '✔' : '✘'}\n`
teks += `- Kategori: ${det.commerceUserInfo?.category || '-'}\n`
teks += `- Link Bio: ${det.bioLink?.link || '-'}\n`
teks += `- Short ID: ${det.shortId || '-'}`
await erlic.sendMessage(m.chat, { image: { url: p.profilePicture }, caption: teks.trim() }, { quoted: m })
} catch (e) {
console.error(e)
m.reply(mess.error)
}
}
break
        
case 'twitterstalk': {
if (!text) return m.reply(func.example(cmd, 'ryujinshihikaru'))
try {
await erlic.sendMessage(m.chat, { react: { text: '🕒', key: m.key } })
const { default: axios } = require('axios')
const res = await axios.get(`https://api.fasturl.link/stalk/twitter?username=${encodeURIComponent(text)}`)
const d = res.data
if (d.status !== 200 || !d.result?.userInfo) return m.reply('Akun tidak ditemukan.')
const u = d.result.userInfo
const s = d.result.shadowBanInfo || {}
let cek = val => val ? '✔' : '✘'
let teks = `乂 TWITTER STALKING\n\n`
teks += `- Nama: ${u.name}\n`
teks += `- Username: @${u.screenName}\n`
teks += `- ID: ${u.id}\n`
teks += `- Lokasi: ${u.location || '-'}\n`
teks += `- Deskripsi: ${u.description || '-'}\n`
teks += `- Website: ${u.website?.url || '-'} (${u.website?.display_url || '-'})\n\n`
teks += `Statistik:\n`
teks += `- Followers: ${u.followersCount}\n`
teks += `- Following: ${u.followingCount}\n`
teks += `- Teman: ${u.friendsCount}\n`
teks += `- Likes: ${u.likeCount}\n`
teks += `- Jumlah Tweet: ${u.tweetCount}\n\n`
teks += `Status Shadowban:\n`
teks += `- Suspended: ${cek(s.suspend)}\n`
teks += `- Protected: ${cek(s.protect)}\n`
teks += `- Tidak Ada Tweet: ${cek(s.noTweet)}\n`
teks += `- Tidak Ditemukan: ${cek(s.notFound)}\n`
teks += `- Ghost Ban: ${cek(s.ghostBan)}\n`
teks += `- Search Ban: ${cek(s.searchBan)}\n`
teks += `- Search Suggestion Ban: ${cek(s.searchSuggestionBan)}\n`
teks += `- Reply Deboosting: ${cek(s.replyDeboosting)}\n`
teks += `- Unfollowed: ${cek(s.unfollowed)}`
await erlic.sendMessage(m.chat, { image: { url: u.profileImageUrl }, caption: teks.trim() }, { quoted: m })
} catch (e) {
console.error(e)
m.reply(mess.error)
}
}
break
        
case 'instagramstalk':
case 'igstalk': {
if (!text) return m.reply(func.example(cmd, 'ddeam05'))
try {
await erlic.sendMessage(m.chat, { react: { text: '🕒', key: m.key } })
const { default: axios } = require('axios')
const res = await axios.get(`https://api.fasturl.link/stalk/instagram?username=${encodeURIComponent(text)}`)
const d = res.data
if (d.status !== 200 || !d.result) return m.reply('Akun tidak ditemukan.')
const u = d.result
let teks = `乂 INSTAGRAM STALKING\n\n`
teks += `- Username: ${u.name}\n`
teks += `- Deskripsi: ${u.description || '-'}\n`
teks += `- Followers: ${u.followers}\n`
teks += `- Jumlah Postingan: ${u.uploads}\n`
teks += `- Engagement Rate: ${u.engagementRate}\n`
teks += `- Aktivitas Rata-rata: ${u.averageActivity}\n`
teks += `- Post per Minggu: ${u.postsPerWeek}\n`
teks += `- Post per Bulan: ${u.postsPerMonth}\n`
teks += `- Rata-rata Post per Hari: ${u.amountOfPosts}\n`
teks += `- Waktu Paling Ramai: ${u.mostPopularPostTime}\n\n`
teks += `Hashtag Populer:\n`
u.hashtags.forEach(tag => {
  teks += `${tag} `
})
await erlic.sendMessage(m.chat, { text: teks}, { quoted: m })
} catch (e) {
console.error(e)
m.reply(mess.error)
}
}
break
        
case 'youtubestalk':
case 'ytstalk': {
  if (!text) return m.reply(func.example(cmd, 'nadiaomaraa'))
  try {
    await erlic.sendMessage(m.chat, { react: { text: '🕒', key: m.key } })
    const { default: axios } = require('axios')
    const res = await axios.get(`https://api.fasturl.link/stalk/youtube/advanced?username=${encodeURIComponent(text)}`)
    const d = res.data
    if (d.status !== 200 || !d.result) return m.reply('Channel tidak ditemukan.')
    const u = d.result
    let teks = `乂 YOUTUBE STALKING\n\n`
    teks += `- Nama Channel: ${u.channelTitle}\n`
    teks += `- Username: ${u.customUrl || '-'}\n`
    teks += `- ID Channel: ${u.channelId}\n`
    teks += `- Link Channel: ${u.channelUrl}\n`
    teks += `- Negara: ${u.country || '-'}\n`
    teks += `- Deskripsi: ${u.channelDescription || '-'}\n`
    teks += `- Tanggal Dibuat: ${u.publishedAt}\n`
    teks += `- Subscriber: ${u.subscriberCount || '-'}\n`
    teks += `- Total Views: ${u.viewCount || '-'}\n`
    teks += `- Total Video: ${u.videoCount || '-'}\n`
    teks += `- Subscriber Tersembunyi: ${u.hiddenSubscriberCount ? '✔' : '✘'}\n`
    teks += `- Status Privasi: ${u.status?.privacyStatus || '-'}\n`
    teks += `- Tertaut dengan Akun Google: ${u.status?.isLinked ? '✔' : '✘'}\n`
    teks += `- Playlist Upload: ${u.contentDetails?.uploadsPlaylistId || '-'}\n`
    teks += `- Playlist Like: ${u.contentDetails?.likesPlaylistId || '-'}\n`
    if (u.topics?.length) {
      teks += `Topik:\n`
      u.topics.forEach(link => {
        teks += `- ${link}\n`
      })
    }
    await erlic.sendMessage(m.chat, {
      image: { url: u.thumbnails?.high },
      caption: teks.trim(),
      contextInfo: {
        externalAdReply: {
          title: u.channelTitle,
          body: global.header,
          thumbnailUrl: u.channelBanner,
          mediaType: 1,
          mediaUrl: u.channelUrl,
          sourceUrl: u.channelUrl,
          renderLargerThumbnail: true
        }
      }
    }, { quoted: m })
  } catch (e) {
    console.error(e)
    m.reply(mess.error)
  }
}
break
        
case 'zodiac': case 'zodiak': case 'cekzodiac': case 'cekzodiak': {
  if (!text) return m.reply(func.example(cmd, '2005 5 21'));
  let zodiak = [
    ["Capricorn", new Date(1970, 0, 1)],
    ["Aquarius", new Date(1970, 0, 20)],
    ["Pisces", new Date(1970, 1, 19)],
    ["Aries", new Date(1970, 2, 21)],
    ["Taurus", new Date(1970, 3, 21)],
    ["Gemini", new Date(1970, 4, 21)],
    ["Cancer", new Date(1970, 5, 22)],
    ["Leo", new Date(1970, 6, 23)],
    ["Virgo", new Date(1970, 7, 23)],
    ["Libra", new Date(1970, 8, 23)],
    ["Scorpio", new Date(1970, 9, 23)],
    ["Sagittarius", new Date(1970, 10, 22)],
    ["Capricorn", new Date(1970, 11, 22)]
  ].reverse();
  function getZodiac(month, day) {
    let d = new Date(1970, month - 1, day);
    return zodiak.find(([_, _d]) => d >= _d)[0];
  }
  let date = new Date(m.text);
  if (date == 'Invalid Date') return m.reply('Format salah. Gunakan contoh: 2005 5 21');
  let now = new Date();
  let [currYear, currMonth, currDate] = [now.getFullYear(), now.getMonth() + 1, now.getDate()];
  let [birthYear, birthMonth, birthDay] = [date.getFullYear(), date.getMonth() + 1, date.getDate()];
  let zodiac = getZodiac(birthMonth, birthDay);
  let ageD = new Date(now - date);
  let age = ageD.getFullYear() - 1970;
  let nextBirthday = new Date(currYear, birthMonth - 1, birthDay);
  if (nextBirthday < now) nextBirthday.setFullYear(currYear + 1);
  let msDiff = nextBirthday - now;
  let monthsLeft = Math.floor(msDiff / 2592000000);
  let daysLeft = Math.floor((msDiff % 2592000000) / 86400000);
  let countdown = `${monthsLeft} bulan ${daysLeft} hari lagi`;
  let userName = '@' + m.sender.split('@')[0];
  let txt = `乂  *Z O D I A C*\n\n`;
  txt += `◦  *Nama:* ${userName}\n`;
  txt += `◦  *Tanggal Lahir:* ${[birthYear, birthMonth, birthDay].join('-')}\n`;
  txt += `◦  *Ulang Tahun Berikutnya:* ${nextBirthday.getFullYear()}-${birthMonth}-${birthDay}\n`;
  txt += `◦  *Hitung Mundur Ultah:* ${countdown}\n`;
  txt += `◦  *Umur:* ${currMonth === birthMonth && currDate === birthDay ? `Happy ${age}th Birthday!` : age + ' tahun'}\n`;
  txt += `◦  *Zodiak:* ${zodiac}`;
  erlic.sendMessage(m.chat, { text: txt, contextInfo: { mentionedJid: [m.sender]} }, { quoted: m });
}
break;
        
case 'zodiakinfo': {
  const axios = require('axios');
  if (!text) return erlic.sendMessage(m.chat, { text: func.example(cmd, 'gemini') }, { quoted: m });
  await erlic.sendMessage(m.chat, { react: { text: '🕒', key: m.key } });
  try {
    const { data } = await axios.get(`https://api.siputzx.my.id/api/primbon/zodiak?zodiak=${encodeURIComponent(text)}`);
    if (!data.status || !data.data) return m.reply('Zodiak tidak ditemukan');
    const d = data.data;
    const pesan = `乂  *ZODIAK - ${d.zodiak.split('-')[0].trim().toUpperCase()}*\n\n` +
      `*Zodiak:* ${d.zodiak}\n` +
      `*Nomor Keberuntungan:* ${d.nomor_keberuntungan}\n` +
      `*Aroma Keberuntungan:* ${d.aroma_keberuntungan}\n` +
      `*Planet yang Mengitari:* ${d.planet_yang_mengitari}\n` +
      `*Bunga Keberuntungan:* ${d.bunga_keberuntungan}\n` +
      `*Warna Keberuntungan:* ${d.warna_keberuntungan}\n` +
      `*Batu Keberuntungan:* ${d.batu_keberuntungan}\n` +
      `*Elemen Keberuntungan:* ${d.elemen_keberuntungan}\n\n` +
      `*Pasangan Zodiak & Karakteristik:*\n${d.pasangan_zodiak}`;
    await erlic.sendMessage(m.chat, { text: pesan }, { quoted: m });
  } catch (e) {
    console.error(e);
    m.reply(mess.error);
  }
}
break;
        
case 'freefirestalk':
case 'ffstalk': {
  if (!text) return m.reply(func.example(cmd, '16207002'))
  try {
    await erlic.sendMessage(m.chat, { react: { text: '🕒', key: m.key } })
    const { default: axios } = require('axios')
    const res = await axios.get(`https://api.fasturl.link/stalk/freefire?uid=${encodeURIComponent(text)}&region=id&media=true`)
    const d = res.data
    if (d.status !== 200 || !d.result?.accountInfo) return m.reply('Akun tidak ditemukan.')
    const a = d.result.accountInfo
    const g = d.result.guildInfo || {}
    const p = d.result.petInfo || {}
    const c = d.result.creditScoreInfo || {}
    const s = d.result.socialInfo || {}
    const mA = d.result.mediaAssets || {}
    let teks = `乂 FREE FIRE STALKING\n\n`
    teks += `- Nickname: ${a.name}\n`
    teks += `- ID: ${a.userId}\n`
    teks += `- Region: ${a.region}\n`
    teks += `- Level: ${a.level}\n`
    teks += `- Likes: ${a.likes}\n`
    teks += `- Exp: ${a.exp}\n`
    teks += `- Title ID: ${a.title}\n`
    teks += `- Season: ${a.seasonId}\n`
    teks += `- Rank BR: ${a.brRankPoint} (Max: ${a.brMaxRank})\n`
    teks += `- Rank CS: ${a.csRankPoint} (Max: ${a.csMaxRank})\n`
    teks += `- Tipe Akun: ${a.accountType}\n`
    teks += `- Tanggal Buat: ${a.createTimeDate}\n`
    teks += `- Terakhir Login: ${a.lastLoginDate}\n`
    teks += `- Versi: ${a.releaseVersion}\n\n`
    teks += `Guild:\n`
    teks += `- Nama: ${g.name || '-'}\n`
    teks += `- ID: ${g.id || '-'}\n`
    teks += `- Level: ${g.level || '-'}\n`
    teks += `- Member: ${g.memberCount || '0'} / ${g.capacity || '0'}\n\n`

    teks += `Pet:\n`
    teks += `- Nama: ${p.name || '-'}\n`
    teks += `- Level: ${p.level || '-'}\n`
    teks += `- Exp: ${p.exp || '0'}\n\n`
    teks += `Skor Kredit:\n`
    teks += `- Nilai: ${c.creditScore || '-'}\n`
    teks += `- Status Reward: ${c.rewardState || '-'}\n`
    teks += `- Berlaku Hingga: ${c.periodicSummaryEndTimeDate || '-'}\n\n`
    teks += `Info Sosial:\n`
    teks += `- Bahasa: ${s.language || '-'}\n`
    teks += `- Bio: ${s.signature || '-'}\n`
    await erlic.sendMessage(m.chat, {
      image: { url: mA.bannerImageUrl },
      caption: teks
    }, { quoted: m })
  } catch (e) {
    console.error(e)
    m.reply(mess.error)
  }
}
break
        
case 'ytc': case 'ytslide': {
  if (!text) return m.reply(func.example(cmd, 'https://youtube.com/post/UgkxKYnMaVme5KtjTUDIolHW91uaIGL4UYJK'));
    await erlic.sendMessage(m.chat, { react: { text: '🕒', key: m.key } });
  try {
    const res = await axios.get(`https://api.siputzx.my.id/api/d/ytpost?url=${encodeURIComponent(text)}`);
    if (!res.data.status) return m.reply(mess.error);
    const data = res.data.data;
    const caption = `乂 YT - COMMUNITY DOWNLOADER\n\n- PostID: ${data.postId}\n- Title: ${data.content}`;
    if (data.images && data.images.length > 0) {
      await erlic.sendMessage(m.chat, { image: { url: data.images[0] }, caption }, { quoted: m });
      for (let i = 1; i < data.images.length; i++) {
        await erlic.sendMessage(m.chat, { image: { url: data.images[i] } }, { quoted: m });
      }
    } else {
      m.reply('Tidak ada gambar di post ini.');
    }
  } catch (e) {
    console.error(e);
    m.reply(mess.error);
  }
  break;
}
        
case 'blurface': {
  const quoted = m.quoted ? m.quoted : m.msg?.contextInfo?.quotedMessage ? m : null;
  const mime = quoted?.mimetype || quoted?.msg?.mimetype || '';
  if (!quoted || !/image\/(jpe?g|png)/.test(mime)) {
    return m.reply(`Balas gambar dengan perintah *${prefix + cmd}*`);
  }

  try {
    await erlic.sendMessage(m.chat, { react: { text: '🕒', key: m.key } });

    const media = await quoted.download?.();
    const fileSizeInBytes = media.length;
    const fileSizeInKB = (fileSizeInBytes / 1024).toFixed(2);
    const fileSizeInMB = (fileSizeInBytes / (1024 * 1024)).toFixed(2);
    const fileSize = fileSizeInMB >= 1 ? `${fileSizeInMB} MB` : `${fileSizeInKB} KB`;

    const FormData = require('form-data');
    const form = new FormData();
    form.append('reqtype', 'fileupload');
    let ext = mime.split('/')[1] || '';
    if (ext) ext = `.${ext}`;
    form.append('fileToUpload', media, `file${ext}`);

    const upload = await axios.post('https://catbox.moe/user/api.php', form, {
      headers: form.getHeaders()
    });

    const url = upload.data.trim();

    const res = await axios.get(`https://api.siputzx.my.id/api/iloveimg/blurface?image=${encodeURIComponent(url)}`, {
      responseType: 'arraybuffer'
    });

    const hasil = Buffer.from(res.data, 'binary');
    await erlic.sendMessage(m.chat, { image: hasil, caption: mess.ok }, { quoted: m });

  } catch (err) {
    console.error(err);
    m.reply(mess.error);
  }

  break;
}
        
case 'hd': case 'upscale': case 'remini': {
  const quoted = m.quoted ? m.quoted : m.msg?.contextInfo?.quotedMessage ? m : null;
  const mime = quoted?.mimetype || quoted?.msg?.mimetype || '';
  if (!quoted || !/image\/(jpe?g|png)/.test(mime)) {
    return m.reply(`Balas gambar dengan caption ${prefix + cmd}`);
  }

  try {
    await erlic.sendMessage(m.chat, { react: { text: '🕒', key: m.key } });

    const media = await quoted.download?.();

    const FormData = require('form-data');
    const form = new FormData();
    form.append('reqtype', 'fileupload');
    let ext = mime.split('/')[1] || '';
    if (ext) ext = `.${ext}`;
    form.append('fileToUpload', media, `file${ext}`);

    const upload = await axios.post('https://catbox.moe/user/api.php', form, {
      headers: form.getHeaders()
    });

    const imageUrl = upload.data.trim();

    const upscale = await axios.get(`https://api.siputzx.my.id/api/iloveimg/upscale?image=${encodeURIComponent(imageUrl)}`, {
      responseType: 'arraybuffer'
    });

    await erlic.sendMessage(m.chat, {
      image: Buffer.from(upscale.data, 'binary'),
      caption: mess.ok
    }, { quoted: m });

  } catch (e) {
    console.error(e);
    m.reply(mess.error);
  }

  break;
}
        
case 'compress': {
  const quoted = m.quoted ? m.quoted : m.msg?.contextInfo?.quotedMessage ? m : null;
  const mime = quoted?.mimetype || quoted?.msg?.mimetype || '';
  if (!quoted || !/image\/(jpe?g|png)/.test(mime)) {
    return m.reply(`Balas gambar dengan caption ${prefix + cmd}`);
  }

  try {
    await erlic.sendMessage(m.chat, { react: { text: '🕒', key: m.key } });

    const media = await quoted.download?.();
    const fileSizeInBytes = media.length;
    const fileSizeInKB = (fileSizeInBytes / 1024).toFixed(2);
    const fileSizeInMB = (fileSizeInBytes / (1024 * 1024)).toFixed(2);
    const fileSize = fileSizeInMB >= 1 ? `${fileSizeInMB} MB` : `${fileSizeInKB} KB`;

    const FormData = require('form-data');
    const form = new FormData();
    form.append('reqtype', 'fileupload');
    let ext = mime.split('/')[1] || '';
    if (ext) ext = `.${ext}`;
    form.append('fileToUpload', media, `file${ext}`);

    const upload = await axios.post('https://catbox.moe/user/api.php', form, {
      headers: form.getHeaders()
    });

    const imageUrl = upload.data.trim();

    const compressed = await axios.get(`https://api.siputzx.my.id/api/iloveimg/compress?image=${encodeURIComponent(imageUrl)}`, {
      responseType: 'arraybuffer'
    });

    await erlic.sendMessage(m.chat, {
      image: Buffer.from(compressed.data, 'binary'),
      caption: mess.ok
    }, { quoted: m });

  } catch (e) {
    console.error(e);
    m.reply(mess.error);
  }

  break;
}
        
case 'lastsync': { const calculateTimeSinceLastSync = t => Date.now() - t * 1000; const formatTimeDifference = ms => { const s = Math.floor(ms/1000), m = Math.floor(s/60), h = Math.floor(m/60), d = Math.floor(h/24), rh = h % 24, rm = m % 60, rs = s % 60; return `${d > 0 ? d + ' hari ' : ''}${rh > 0 ? rh + ' jam ' : ''}${rm > 0 ? rm + ' menit ' : ''}${rs} detik`; }; const lastAccountSyncTimestamp = erlic?.authState?.creds?.lastAccountSyncTimestamp; if (!lastAccountSyncTimestamp) return m.reply('lastAccountSyncTimestamp not found.'); const timeDifference = calculateTimeSinceLastSync(lastAccountSyncTimestamp); const formattedDifference = formatTimeDifference(timeDifference); await m.reply(`Time since last sync: ${formattedDifference}`); } break;
        
case 'stikerlydl': case 'stickerlydl': {
  if (!text) return m.reply(func.example(cmd, 'https://sticker.ly/s/J9TZWA'));
  try {
    await erlic.sendMessage(m.chat, { react: { text: '🕒', key: m.key } });
    const axios = require('axios');
    const { Sticker, StickerTypes } = require('wa-sticker-formatter');
    const res = await axios.get(`https://api.siputzx.my.id/api/d/stickerly?url=${encodeURIComponent(text)}`);
    if (!res.data.status) return m.reply(mess.error);
    const data = res.data.data;
    const total = data.total_stickers;
    m.reply(`Ditemukan ${total} stiker, sedang mengirim...`);
    const packname = global.packname || 'Sticker by erlic';
    const author = global.author || '';
    for (const url of data.stickers) {
      try {
        const { data: buffer } = await axios.get(url, { responseType: 'arraybuffer' });
        const stiker = new Sticker(buffer, {
          packname: packname,
          author: author,
          type: StickerTypes.FULL,
          quality: 100,
        });
        const webpBuffer = await stiker.toBuffer();
        await erlic.sendMessage(m.chat, { sticker: webpBuffer }, { quoted: m });

      } catch (stickerErr) {
        console.error('Gagal kirim stiker:', stickerErr);
      }
    }
  } catch (e) {
    console.error('Error utama:', e);
    m.reply(mess.error);
  }
  break;
}
        
case 'inspectch': {
  if (!isPrem) return m.reply(mess.premium)
  if (!text.includes('https://whatsapp.com/channel/')) {
    return m.reply(func.example(cmd, 'https://whatsapp.com/channel/xxxxxx'));
  }

  try {
    let result = text.split('https://whatsapp.com/channel/')[1].trim();
    let res = await erlic.newsletterMetadata("invite", result);

    let teks = `
乂  *C H A N N E L - I N F O*

• *ID:* ${res.id}
• *Name:* ${res.name}
• *Total followers:* ${res.subscribers}
• *Status:* ${res.state}
• *Verified:* ${res.verification === "VERIFIED" ? "✅" : "❌"}
    `.trim();
    return m.reply(teks);
  } catch (e) {
    console.error(e);
    return m.reply(mess.error);
  }
}
break;
        
        
case 'cekidch': {
  if (!text.includes('https://whatsapp.com/channel/')) {
    return m.reply(func.example(cmd, 'https://whatsapp.com/channel/xxxxxx'));
  }

  try {
    let result = text.split('https://whatsapp.com/channel/')[1].trim();
    let res = await erlic.newsletterMetadata("invite", result);

    let teks = `- *Jid:* ${res.id}\n- *Name:* ${res.name}`.trim();
    return m.reply(teks);
  } catch (e) {
    console.error(e);
    return m.reply(mess.error);
  }
}
break;
        
case 'getfile': case 'gf': {
  const path = require('path');
  const fs = require('fs');
  if (!isCreator) return m.reply(mess.owner);
  if (!text) return m.reply(func.example(command, 'config.js'));
  await erlic.sendMessage(m.chat, { react: { text: '🕒', key: m.key } });
  let fileName = text.trim();
  let filePath = path.join(process.cwd(), fileName);
  if (!fs.existsSync(filePath)) {
    return m.reply(`File *${fileName}* tidak ditemukan!`);
  }
  let ext = path.extname(fileName);
  let mime = ext === '.js' ? 'text/javascript' :
             ext === '.json' ? 'application/json' :
             ext === '.txt' ? 'text/plain' :
             'application/octet-stream';
  await erlic.sendMessage(
    m.chat,
    {
      document: fs.readFileSync(filePath),
      fileName: fileName,
      mimetype: mime,
      caption: `Berikut adalah isi file *${fileName}*`,
    },
    { quoted: m }
  );
  break;
}
        
 case 'savefile': case 'sf': {
  const fs = require('fs');
  const path = require('path');
  if (!isCreator) return m.reply(mess.owner)
  if (!text) return m.reply(func.example(cmd, 'config.js'));
  if (!m.quoted) return m.reply(`Mau simpan file dengan isi apa? Reply teks/script-nya!`);
  try {
    let quoted = m.quoted ? m.quoted : m;
    let fileContent;
    let fileName = text.trim().toLowerCase();
    let filePath = path.join(process.cwd(), fileName);
    if (/application\/javascript/.test(quoted.mime)) {
      fileContent = await quoted.download();
    } else {
      fileContent = quoted.text;
    }
    fs.writeFileSync(filePath, fileContent);
    await erlic.sendMessage(m.chat, { react: { text: '✅', key: m.key } });
  } catch (error) {
    console.log(error);
    await erlic.sendMessage(m.chat, { react: { text: '❌', key: m.key } });
  }
  break
}
        
 case 'struktur': {
  try {
    if (!isCreator) return m.reply(mess.owner);
    await erlic.sendMessage(m.chat, { react: { text: '🕒', key: m.key } });
    const fs = require('fs');
    const path = require('path');
    const excludedDirs = ['node_modules', 'session', '.cache', '.npm'];
    function printDirectoryStructure(dirPath, prefix = '') {
      let output = '';
      const files = fs.readdirSync(dirPath);
      files.forEach((file, index) => {
        if (excludedDirs.includes(file)) return;
        const filePath = path.join(dirPath, file);
        const isLast = index === files.length - 1;
        const isDir = fs.statSync(filePath).isDirectory();
        const symbol = isDir ? '📂' : '📄';

        output += `${prefix}${isLast ? '└── ' : '├── '}${symbol} ${file}\n`;
        if (isDir) {
          output += printDirectoryStructure(filePath, `${prefix}${isLast ? '    ' : '│   '}`);
        }
      });
      return output;
    }
    const baseDir = process.cwd();
    const struktur = printDirectoryStructure(baseDir);
    const pesan = '乂  *S T R U K T U R - D I R E K T O R I*\n\n' + struktur;
    m.reply(pesan);
  } catch (err) {
    console.error(err);
    m.reply(mess.error);
  }
  break;
}		
      
case 'ceksession': case 'ceksesi': { const fs = require('fs'); const path = require('path'); Number.prototype.sizeString = function() { const i = Math.floor(Math.log(this) / Math.log(1024)); return (this / Math.pow(1024, i)).toFixed(2) + ' ' + ['B','KB','MB','GB','TB'][i]; }; let sessions = 'session'; let dir = fs.readdirSync(sessions), session = 0; dir.map(amount => session += fs.statSync(path.join(sessions, amount)).size); let txt = `Session Information\n\n- Total Session : ${dir.length} Files\n- Size Session : ${session.sizeString()}`; m.reply(txt); } break;
        
case 'getdevice': case 'device': { if (!m.quoted) return m.reply('Balas pesan target.'); let id = m.quoted.id; function getDevice(id) { const device = id.length > 21 ? 'Android' : id.substring(0, 2) === '3A' ? 'iOS' : 'WhatsApp Web'; return device; } await m.reply(getDevice(id)); } break;
        
case 'addcase': {
  if (!isCreator) return m.reply(mess.owner);
  const fs = require('fs'), namaFile = 'erlic.js';
  let isi = text || (m.quoted && m.quoted.text) || '';
  if (!isi.toLowerCase().includes('case')) return m.reply('Format case tidak valid.');
  fs.readFile(namaFile, 'utf8', (err, data) => {
    if (err) return m.reply('Gagal baca file: ' + err);
    const regexSound = /case ['"]sound1['"]:/, posSound = data.search(regexSound);
    if (posSound === -1) return m.reply('Tidak dapat menemukan case sound1.');
    const hasil = data.slice(0, posSound) + '\n' + isi + '\n\n' + data.slice(posSound);
    fs.writeFile(namaFile, hasil, 'utf8', err => {
      if (err) return m.reply('Gagal menulis file: ' + err);
      m.reply('Case berhasil ditambahkan sebelum case sound1.');
    });
  });
}
break;
        
case 'getcase': {
  try {
    if (!isCreator) return m.reply(mess.owner);
    if (!text) return m.reply(func.example(cmd, 'menu'));
    const fs = require('fs');
    const path = require('path');
    const filePath = path.join(process.cwd(), 'erlic.js');
    if (!fs.existsSync(filePath)) return m.reply('File erlic.js tidak ditemukan.');
    const fileContent = fs.readFileSync(filePath, 'utf-8');
    const regex = new RegExp(`case [\`'"]${text}[\`'"]:[\\s\\S]*?break\\s*;?`, 'i');
    const match = fileContent.match(regex);
    if (!match) return m.reply(`Case '${text}' tidak ditemukan di file erlic.js`);
    const hasil = match[0];
    m.reply(hasil);
  } catch (err) {
    console.error(err);
    m.reply(mess.error);
  }
  break;
}
        
case 'block': case 'blok': case 'blokir': {
  if (!isCreator) return m.reply(mess.owner);

  if (!text) {
    return erlic.sendMessage(m.chat, { 
      text: func.example(command, `@${m.sender.split('@')[0]}`), 
      contextInfo: { mentionedJid: [m.sender] } 
    }, { quoted: m });
  }

  let usersToBlock = [];
  if (m.mentionedJid && m.mentionedJid.length) {
    usersToBlock = usersToBlock.concat(m.mentionedJid);
  }

  let textNumbers = text.match(/(?:\+62|62|63|60)?\d{5,15}/g) || [];
  textNumbers = textNumbers.map(n => {
    n = n.replace(/^\+/, '');
    if (!n.includes('@s.whatsapp.net')) n = n + '@s.whatsapp.net';
    return n;
  });

  usersToBlock = usersToBlock.concat(textNumbers);
  usersToBlock = [...new Set(usersToBlock)];

  if (usersToBlock.length === 0) {
    return erlic.sendMessage(m.chat, { 
      text: func.example(command, `@${m.sender.split('@')[0]}`), 
      contextInfo: { mentionedJid: [m.sender] } 
    }, { quoted: m });
  }

  const formatJid = jid => jid.includes('@') ? jid : jid + '@s.whatsapp.net';

  usersToBlock = usersToBlock.filter(u => {
    const jid = formatJid(u);
    return jid !== erlic.user.id &&
      !global.developer.some(dev => formatJid(dev) === jid) &&
      !global.owner.some(own => formatJid(own) === jid);
  });

  if (usersToBlock.length === 0) {
    return erlic.sendMessage(m.chat, {
      text: 'Tidak ada nomor valid untuk di blokir.'
    }, { quoted: m });
  }

  for (const nomor of usersToBlock) {
    await erlic.updateBlockStatus(nomor, 'block');
  }

  if (usersToBlock.length === 1) {
    const user = usersToBlock[0].split('@')[0];
    erlic.sendMessage(m.chat, {
      text: `Berhasil memblokir @${user}`,
      contextInfo: { mentionedJid: usersToBlock }
    }, { quoted: m });
  } else {
    let listUsers = usersToBlock.map(u => '- @' + u.split('@')[0]).join('\n');
    erlic.sendMessage(m.chat, {
      text: `Berhasil memblokir:\n${listUsers}`,
      contextInfo: { mentionedJid: usersToBlock }
    }, { quoted: m });
  }
}
break
        
 case 'unblock': case 'unblok': case 'bukablokir': {
  if (!isCreator) return m.reply(mess.owner);

  if (!text) {
    return erlic.sendMessage(m.chat, { 
      text: func.example(command, `@${m.sender.split('@')[0]}`), 
      contextInfo: { mentionedJid: [m.sender] } 
    }, { quoted: m });
  }

  let usersToUnblock = [];
  if (m.mentionedJid && m.mentionedJid.length) {
    usersToUnblock = usersToUnblock.concat(m.mentionedJid);
  }

  let textNumbers = text.match(/(?:\+62|62|63|60)?\d{5,15}/g) || [];
  textNumbers = textNumbers.map(n => {
    n = n.replace(/^\+/, '');
    if (!n.includes('@s.whatsapp.net')) n = n + '@s.whatsapp.net';
    return n;
  });

  usersToUnblock = usersToUnblock.concat(textNumbers);
  usersToUnblock = [...new Set(usersToUnblock)];

  if (usersToUnblock.length === 0) {
    return erlic.sendMessage(m.chat, { 
      text: func.example(command, `@${m.sender.split('@')[0]}`), 
      contextInfo: { mentionedJid: [m.sender] } 
    }, { quoted: m });
  }

  const formatJid = jid => jid.includes('@') ? jid : jid + '@s.whatsapp.net';

  usersToUnblock = usersToUnblock.filter(u => u !== erlic.user.id);

  if (usersToUnblock.length === 0) {
    return erlic.sendMessage(m.chat, {
      text: 'Tidak ada nomor valid untuk dibuka blokir.'
    }, { quoted: m });
  }

  for (const nomor of usersToUnblock) {
    await erlic.updateBlockStatus(nomor, 'unblock');
  }

  if (usersToUnblock.length === 1) {
    const user = usersToUnblock[0].split('@')[0];
    erlic.sendMessage(m.chat, {
      text: `Berhasil membuka blokir @${user}`,
      contextInfo: { mentionedJid: usersToUnblock }
    }, { quoted: m });
  } else {
    let listUsers = usersToUnblock.map(u => '- @' + u.split('@')[0]).join('\n');
    erlic.sendMessage(m.chat, {
      text: `Berhasil membuka blokir:\n${listUsers}`,
      contextInfo: { mentionedJid: usersToUnblock }
    }, { quoted: m });
  }
}
break
        
case 'banned': case 'ban': {
    if (!isCreator) return m.reply(mess.owner);
    if (!text && !m.quoted) return m.reply(func.example(cmd, '628xxxx,10d'));

    const formatJid = jid => jid.includes('@') ? jid : jid + '@s.whatsapp.net';
    let usersToBanned = [];

    if (m.quoted) {
        const quotedJid = m.quoted.sender;
        usersToBanned.push(formatJid(quotedJid));
    } else {
        const [numberRaw, durationInput] = text.split(',');
        if (!numberRaw) return m.reply(func.example(cmd, '628xxxx,10d'));
        const textNumbers = numberRaw.split(/[\s,]+/).map(no => no.replace(/\D/g, ''));
        usersToBanned = textNumbers.map(formatJid);
    }
    usersToBanned = [...new Set(usersToBanned)];
    usersToBanned = usersToBanned.filter(jid =>
        jid !== erlic.user.id &&
        !(Array.isArray(global.owner) ? global.owner : [global.owner]).some(own => formatJid(own) === jid) &&
        !(Array.isArray(global.prems) ? global.prems : [global.prems]).some(prem => formatJid(prem) === jid) &&
        !(Array.isArray(global.developer) ? global.developer : [global.developer]).some(dev => formatJid(dev) === jid)
    );
    if (usersToBanned.length === 0) return m.reply('Tidak ada nomor valid untuk dibanned.');
    let bannedUntil;
    function parseDuration(input) {
        const match = input?.match(/^(\d+)([smhdy])$/i);
        if (!match) return null;
        const value = parseInt(match[1]);
        const unit = match[2].toLowerCase();
        const multipliers = {
            s: 1000,
            m: 60 * 1000,
            h: 60 * 60 * 1000,
            d: 24 * 60 * 60 * 1000,
            y: 365 * 24 * 60 * 60 * 1000
        };
        return value * (multipliers[unit] || 0);
    }

    const durationInput = text && !m.quoted ? text.split(',')[1] : null;
    if (!durationInput) {
        bannedUntil = -1;
    } else {
        const ms = parseDuration(durationInput);
        if (!ms) return m.reply(`Format durasi tidak valid. Gunakan akhiran: s, m, h, d, y\nContoh: 10m, 5d, 1y`);
        bannedUntil = Date.now() + ms;
    }
    const bannedFile = './database/banned.json';
    if (!fs.existsSync(bannedFile)) fs.writeFileSync(bannedFile, '[]');
    let banned = JSON.parse(fs.readFileSync(bannedFile));
    for (const jid of usersToBanned) {
        const index = banned.findIndex(entry => entry.id === jid);
        if (index !== -1) {
            banned[index].until = bannedUntil;
        } else {
            banned.push({ id: jid, until: bannedUntil });
        }
    }

    fs.writeFileSync(bannedFile, JSON.stringify(banned, null, 2));
    await erlic.sendMessage(m.chat, {
        text: `Berhasil banned:\n${usersToBanned.map(j => `@${j.split('@')[0]}`).join('\n')}\nSampai: ${bannedUntil === -1 ? 'PERMANEN' : new Date(bannedUntil).toLocaleString()}`,
        mentions: usersToBanned
    }, { quoted: m });
    break;
}
        
case 'unbanned': case 'unban': {
    if (!isCreator) return m.reply(mess.owner);

    if (!text) return m.reply(`Tag atau kirim nomor yang ingin di-unban.\nContoh: ${func.example(cmd, '628xxxx')}`);
    
    const target = (m.quoted ? m.quoted.sender : text.replace(/[^0-9]/g, '') + '@s.whatsapp.net');

    const bannedFile = './database/banned.json';
    if (!fs.existsSync(bannedFile)) fs.writeFileSync(bannedFile, '[]');
    let banned = JSON.parse(fs.readFileSync(bannedFile));

    const isBanned = banned.find(u => u.id === target);
    if (!isBanned) return m.reply('User tidak dalam daftar banned.');

    banned = banned.filter(u => u.id !== target);
    fs.writeFileSync(bannedFile, JSON.stringify(banned, null, 2));

    const targetNumber = target.split('@')[0];
    erlic.sendMessage(m.chat, {
        text: `Berhasil unban @${targetNumber}`,
        mentions: [target]
    }, { quoted: m });
}
break
        
case 'listbanned': case 'listban': {
  cleanExpiredBanned();
  const banned = JSON.parse(fs.readFileSync('./database/banned.json'));
  if (banned.length === 0) return m.reply('Tidak ada user yang dibanned.');
  let list = `乂 *L I S T - B A N N E D*\n\n`;
  banned.forEach((b, i) => {
    let expireText;
    if (b.until === -1) {
      expireText = 'PERMANENT';
    } else {
      let sisa = b.until - Date.now();
      if (sisa < 0) sisa = 0;
      expireText = parseMs(sisa);
    }
    list += `${i + 1}. @${b.id.replace(/@.+/, '')}\n◦ Expire: ${expireText}\n\n`;
  });
  erlic.sendMessage(m.chat, {
    text: list.trim(),
    mentions: banned.map(b => b.id)
  }, { quoted: m });
}
break;
        
case 'blockcmd': {
  if (!text) return m.reply(func.example(command, 'play'));
  const blocked = JSON.parse(fs.readFileSync('./database/blockcmd.json'));

  if (blocked.includes(text)) return m.reply(`Command *${text}* sudah diblokir.`);

  blocked.push(text);
  fs.writeFileSync('./database/blockcmd.json', JSON.stringify(blocked, null, 2));
  m.reply(`Command *${text}* berhasil diblokir.`);
}
break;

case 'unblockcmd': {
  if (!text) return m.reply(func.example(command, 'play'));
  let blocked = JSON.parse(fs.readFileSync('./database/blockcmd.json'));

  if (!blocked.includes(text)) return m.reply(`Command *${text}* tidak sedang diblokir.`);

  blocked = blocked.filter(cmd => cmd !== text);
  fs.writeFileSync('./database/blockcmd.json', JSON.stringify(blocked, null, 2));
  m.reply(`Command *${text}* berhasil dibuka.`);
}
break;
        
case 'listblockcmd': {
  const blocked = JSON.parse(fs.readFileSync('./database/blockcmd.json'));

  if (blocked.length === 0) return m.reply('Tidak ada command yang diblokir.');

  let list = `乂  *LIST BLOCK COMMANDS*\n\n`;
  list += `Total: *${blocked.length}* commands blocked\n\n`;
  list += blocked.map(cmd => `◦  ${prefix}${cmd}`).join('\n');

  m.reply(list);
}
break
        
case 'addfitur': {
  if (!text.includes('|')) return m.reply(func.example(cmd, 'kategori|fitur1, fitur2, ...'));
  try {
    const fs = require('fs');
    const dbPath = './database/menu.json';
    const menuData = JSON.parse(fs.readFileSync(dbPath));
    const [kategoriRaw, fiturRaw] = text.split('|');
    const kategori = kategoriRaw.trim().toLowerCase();
    const fiturList = fiturRaw.split(',').map(f => f.trim().toLowerCase());
    let categoryObj = menuData.find(m => Object.keys(m)[0] === kategori);
    if (!categoryObj) {
      categoryObj = { [kategori]: [] };
      menuData.push(categoryObj);
    }
    const fiturBaru = [];
    const fiturSudahAda = [];
    const fiturDiKategoriLain = {};
    fiturList.forEach(fitur => {
      const existingInOtherCategory = menuData.find(cat => {
        const catName = Object.keys(cat)[0];
        return catName !== kategori && cat[catName].includes(fitur);
      });
      if (existingInOtherCategory) {
        const otherCatName = Object.keys(existingInOtherCategory)[0];
        if (!fiturDiKategoriLain[otherCatName]) fiturDiKategoriLain[otherCatName] = [];
        fiturDiKategoriLain[otherCatName].push(fitur);
        return;
      }
      if (!categoryObj[kategori].includes(fitur)) {
        categoryObj[kategori].push(fitur);
        fiturBaru.push(fitur);
      } else {
        fiturSudahAda.push(fitur);
      }
    });
    fs.writeFileSync(dbPath, JSON.stringify(menuData, null, 2));
    let pesan = '';
    if (fiturBaru.length) pesan += `Berhasil menambahkan fitur:\n• ${kategori} (${fiturBaru.join(', ')})\n\n`;
    if (fiturSudahAda.length) pesan += `Fitur berikut sudah ada di kategori ini:\n• ${kategori} (${fiturSudahAda.join(', ')})\n\n`;
    if (Object.keys(fiturDiKategoriLain).length) {
      pesan += `Fitur berikut sudah ada di kategori lain:\n`;
      for (const [cat, fiturs] of Object.entries(fiturDiKategoriLain)) {
        pesan += `- ${fiturs.join(', ')} (kategori: ${cat})\n`;
      }
    }
    m.reply(pesan.trim());
  } catch (e) {
    console.error(e);
    m.reply(mess.error);
  }
}
break;
        
case 'delfitur': {
  if (!text) return m.reply(func.example(cmd, 'fitur1, fitur2, ...'));
  try {
    const dbPath = './database/menu.json';
    const fs = require('fs');
    const menuData = JSON.parse(fs.readFileSync(dbPath));
    const fiturTargets = text.split(',').map(f => f.trim().toLowerCase());
    let berhasil = [];
    let gagal = [];
    fiturTargets.forEach(fiturTarget => {
      let found = false;
      menuData.forEach(obj => {
        const kategori = Object.keys(obj)[0];
        const fiturList = obj[kategori];
        const index = fiturList.indexOf(fiturTarget);
        if (index !== -1) {
          fiturList.splice(index, 1);
          found = true;
        }
      });
      if (found) berhasil.push(fiturTarget);
      else gagal.push(fiturTarget);
    });
    const cleanData = menuData.filter(obj => {
      const key = Object.keys(obj)[0];
      return obj[key].length > 0;
    });
    fs.writeFileSync(dbPath, JSON.stringify(cleanData, null, 2));
    let hasilMsg = '';
    if (berhasil.length > 0) {
      hasilMsg += `Fitur berhasil dihapus:\n- ${berhasil.join('\n- ')}\n\n`;
    }
    if (gagal.length > 0) {
      hasilMsg += `Fitur tidak ditemukan:\n- ${gagal.join('\n- ')}`;
    }
    m.reply(hasilMsg.trim());
  } catch (e) {
    console.error(e);
    m.reply(mess.error);
  }
}
break
        
case 'listfitur': case 'totalfitur': {
  try {
    const fs = require('fs');
    const dbPath = './database/menu.json';
    const menu = JSON.parse(fs.readFileSync(dbPath));
    if (!menu.length) return m.reply('Tidak ada fitur yang terdaftar.');
    const sortedMenu = menu.sort((a, b) => {
      const aKey = Object.keys(a)[0];
      const bKey = Object.keys(b)[0];
      return aKey.localeCompare(bKey);
    });
    let totalKategori = sortedMenu.length;
    let totalFitur = 0;
    let msg = '乂  *F E A T U R E - L I S T*\n\n';
    sortedMenu.forEach(obj => {
      const kategori = Object.keys(obj)[0];
      const fiturList = obj[kategori];
      totalFitur += fiturList.length;
      msg += `◦ ${capital(kategori)}: ${fiturList.length}\n`;
    });
    msg += `\n*Total Kategori : ${totalKategori}*\n*Total Feature : ${totalFitur} Commands*`;
    m.reply(msg);
  } catch (e) {
    console.error(e);
    m.reply(mess.error);
  }
}
break   
        
case 'cekprovider': { if (!isCreator) return m.reply(mess.owner); if (!text) return m.reply(func.example(cmd, '0838xxxx')); await erlic.sendMessage(m.chat, { react: { text: '🕒', key: m.key } }); var response = await fetch(`http://apilayer.net/api/validate?access_key=4a1ede76e87d9e64682b284e8620ad68&number=+${text}&country_code=ID&format=1`); var result = await response.json(); m.reply(JSON.stringify(result, null, 2)); } break;
        
case 'lookup': { if (!text) return m.reply(func.example(cmd, 'botcahx.live.com')); await erlic.sendMessage(m.chat, { react: { text: '🕒', key: m.key } }); const fetch = require('node-fetch'); async function lookup(url) { let anu; try { anu = await fetch(`https://api.api-ninjas.com/v1/dnslookup?domain=${url}`, {headers: {'X-Api-Key': 'E4/gdcfciJHSQdy4+9+Ryw==JHciNFemGqOVIbyv'}, contentType: 'application/json'}).then(v => v.text()); return JSON.stringify(JSON.parse(anu), null, 4); } catch (e) { console.log(e); anu = await fetch(`https://api.hackertarget.com/dnslookup/?q=${url}`).then(v => v.text()); return anu; } } let anu = await lookup(text.replace(/^https?:\/\//, '')); m.reply(`*Hasil Dns Lookup ${text} :*\n\n${anu}`); } break;
        
case 'lumin': case 'luminai': {
  if (!text) return erlic.sendMessage(m.chat, {
    text: func.example(command, 'apa itu coding?')
  }, { quoted: m });
await erlic.sendMessage(m.chat, { react: { text: '🕒', key: m.key } });
  const message = m.text.trim();
  const prompt = `Kamu adalah ${global.botname}, seorang perempuan yang sangat lucu. Lawan bicaramu adalah ${m.pushName}. Jawablah pernyataan dengan gembira dan tambahan sedikit emoji, jangan berlebihan: "${message}"`;

  const apiUrl = 'https://luminai.my.id';
  const requestData = {
    content: message,
    user: m.sender,
    prompt: prompt
  };

  try {
    console.log("Mengirim request ke:", apiUrl);
    const response = await axios.post(apiUrl, requestData);
    console.log("Respons API:", response.data);

    if (response.data.result) {
      await erlic.sendMessage(m.chat, {
        text: response.data.result
      }, { quoted: m });
        await erlic.sendMessage(m.chat, { react: { text: '✅', key: m.key } });
    } else {
      await erlic.sendMessage(m.chat, {
        text: "Maaf, aku tidak bisa menjawab pertanyaan itu."
      }, { quoted: m });
    }
  } catch (error) {
    console.error("Error fetching AI response:", error);
    await erlic.sendMessage(m.chat, {
      text: mess.error,
    }, { quoted: m });
  }
}
break;
        
case 'ai-jawa': {
  if (!text) return m.reply(func.example(cmd, 'halo'));
  try {
    await erlic.sendMessage(m.chat, { react: { text: '🕒', key: m.key } });
    const axios = require('axios');
    const res = await axios.get(`https://api.siputzx.my.id/api/ai/joko?text=${encodeURIComponent(text)}`);
    if (!res.data.status || !res.data.data) return m.reply(mess.error);
    m.reply(res.data.data);
  } catch (e) {
    console.error(e);
    m.reply(mess.error);
  }
  break;
}
        
case 'ai-muslim': {
  if (!text) return m.reply(func.example(cmd, 'apa hukum puasa tapi tidak sholat?'));
  try {
    await erlic.sendMessage(m.chat, { react: { text: '🕒', key: m.key } });
    const axios = require('axios');
    const res = await axios.get(`https://api.siputzx.my.id/api/ai/muslimai?query=${encodeURIComponent(text)}`);
    if (!res.data.status || !res.data.data) return m.reply(mess.error);
    m.reply(res.data.data);
  } catch (e) {
    console.error(e);
    m.reply(mess.error);
  }
  break;
}
        
case 'llama33': {
  if (!text) return m.reply(func.example(cmd, 'jelaskan teori relativitas secara singkat'));
  try {
    await erlic.sendMessage(m.chat, { react: { text: '🕒', key: m.key } });
    const axios = require('axios');
    const res = await axios.get(`https://api.siputzx.my.id/api/ai/meta-llama-33-70B-instruct-turbo?content=${encodeURIComponent(text)}`);
    if (!res.data.status || !res.data.data) return m.reply(mess.error);
    m.reply(res.data.data);
  } catch (e) {
    console.error(e);
    m.reply(mess.error);
  }
  break;
}
        
case 'artai': case 'ai-art': {
  if (!text) return m.reply(func.example(cmd, 'cute girl'))
  await erlic.sendMessage(m.chat, { react: { text: '🕒', key: m.key } })
  await erlic.sendMessage(m.chat, {
    image: { url: `https://www.abella.icu/art-ai?q=${encodeURIComponent(text)}` }
  }, { quoted: m })
  await erlic.sendMessage(m.chat, { react: { text: '✅', key: m.key } })
}
break;
        
case 'ai-bard': {
  if (!text) return m.reply(func.example(cmd, 'apa itu AI?'));
  try {
    await erlic.sendMessage(m.chat, { react: { text: '🕒', key: m.key } });
    const axios = require('axios');
    const res = await axios.get(`https://api.siputzx.my.id/api/ai/bard?query=${encodeURIComponent(text)}`);
    if (!res.data.status || !res.data.data) return m.reply(mess.error);
    m.reply(res.data.data);
  } catch (e) {
    console.error(e);
    m.reply(mess.error);
  }
  break;
}
        
case 'blackbox': {
  if (!text) return m.reply(func.example(cmd, 'jelaskan fungsi async dan await dalam JavaScript'));
  try {
    await erlic.sendMessage(m.chat, { react: { text: '🕒', key: m.key } });
    const axios = require('axios');
    const res = await axios.get(`https://api.siputzx.my.id/api/ai/blackboxai-pro?content=${encodeURIComponent(text)}`);
    if (!res.data.status || !res.data.data) return m.reply(mess.error);
    m.reply(res.data.data);
  } catch (e) {
    console.error(e);
    m.reply(mess.error);
  }
  break;
}
        
case 'ai-dbrx': {
  if (!text) return m.reply(func.example(cmd, 'Apa itu machine learning?'));
  try {
    await erlic.sendMessage(m.chat, { react: { text: '🕒', key: m.key } });
    const axios = require('axios');
    const res = await axios.get(`https://api.siputzx.my.id/api/ai/dbrx-instruct?content=${encodeURIComponent(text)}`);
    if (!res.data.status || !res.data.data) return m.reply(mess.error);
    m.reply(res.data.data);
  } catch (e) {
    console.error(e);
    m.reply(mess.error);
  }
  break;
}
        
case 'deepseek': {
  if (!text) return m.reply(func.example(cmd, 'Jelaskan apa itu AI dengan singkat'));
  try {
    await erlic.sendMessage(m.chat, { react: { text: '🕒', key: m.key } });
    const axios = require('axios');
    const res = await axios.get(`https://api.siputzx.my.id/api/ai/deepseek-llm-67b-chat?content=${encodeURIComponent(text)}`);
    if (!res.data.status || !res.data.data) return m.reply(mess.error);
    m.reply(res.data.data);
  } catch (e) {
    console.error(e);
    m.reply(mess.error);
  }
  break;
    }
        
case 'ai-esia': {
  if (!text) return m.reply(func.example(cmd, 'Ceritakan sejarah singkat Indonesia'));
  try {
    await erlic.sendMessage(m.chat, { react: { text: '🕒', key: m.key } });
    const axios = require('axios');
    const res = await axios.get(`https://api.siputzx.my.id/api/ai/esia?content=${encodeURIComponent(text)}`);
    if (!res.data.status || !res.data.data) return m.reply(mess.error);
    m.reply(res.data.data);
  } catch (e) {
    console.error(e);
    m.reply(mess.error);
  }
  break;
}
        
case 'bodygenerator': {
if (!m.isPrem && !isCreator && !isPrem) return m.reply(mess.premium)
if (!args[0]) return m.reply(func.example(cmd, 'A boy in a futuristic outfit. | Realistic | Covering breasts, Concept Pool Ladder | Realistic Doll V4'))
const [prompt, type, visualStyle, characterStyle] = text.split('|').map(v => v.trim())
if (!prompt || !type || !visualStyle || !characterStyle) return m.reply(`Semua parameter wajib diisi dengan format: prompt | type | visualStyle | characterStyle`)
await erlic.sendMessage(m.chat, { react: { text: '🕒', key: m.key } })
const { data } = await axios.get(`https://api.fasturl.link/aiimage/bodygenerator?prompt=${encodeURIComponent(prompt)}&type=${encodeURIComponent(type)}&visualStyle=${encodeURIComponent(visualStyle)}&characterStyle=${encodeURIComponent(characterStyle)}`, { responseType: 'arraybuffer' })
await erlic.sendMessage(m.chat, { image: Buffer.from(data), caption: mess.ok }, { quoted: m })
}
break
        
case 'logogenerator': {
if (!text.includes('|')) return m.reply(func.example(cmd, `${global.botname} multidevice | A modern logo with a futuristic feel. | Technology | Minimalist`))
const [brandname, prompt, industry, style] = text.split('|').map(v => v.trim())
if (!brandname || !prompt || !industry || !style) return m.reply(`Semua parameter wajib diisi dengan format: brandname | prompt | industry | style`)
await erlic.sendMessage(m.chat, { react: { text: '🕒', key: m.key } })
const { data } = await axios.get(`https://api.fasturl.link/aiimage/logogenerator?brandname=${encodeURIComponent(brandname)}&prompt=${encodeURIComponent(prompt)}&industry=${encodeURIComponent(industry)}&style=${encodeURIComponent(style)}`, { responseType: 'arraybuffer' })
await erlic.sendMessage(m.chat, { image: Buffer.from(data), caption: global.ok }, { quoted: m })
}
break
        
case 'gemini': {
  if (!text) return m.reply(func.example(cmd, 'Jelaskan tentang lubang hitam'));
  try {
    await erlic.sendMessage(m.chat, { react: { text: '🕒', key: m.key } });
    const axios = require('axios');
    const res = await axios.get(`https://api.siputzx.my.id/api/ai/gemini-pro?content=${encodeURIComponent(text)}`);
    if (!res.data.status || !res.data.data) return m.reply(mess.error);
    m.reply(res.data.data);
  } catch (e) {
    console.error(e);
    m.reply(mess.error);
  }
  break;
}
        
 case 'toghibli': {
if (!m.isPrem && !isCreator) return m.reply(mess.premium)
const quoted = m.quoted ? m.quoted : m.msg?.contextInfo?.quotedMessage ? m : null
const mime = (quoted.msg || quoted).mimetype || '';
if (!quoted || !mime || !/image/.test(mime)) return m.reply(`Balas gambar dengan caption ${prefix + cmd}`)
await erlic.sendMessage(m.chat, { react: { text: '🕒', key: m.key } });
const media = await quoted.download?.()
const FormData = require('form-data')
const form = new FormData()
form.append('reqtype', 'fileupload')
let ext = mime.split('/')[1] || ''
if (ext) ext = `.${ext}`
form.append('fileToUpload', media, `file${ext}`)
const upload = await axios.post('https://catbox.moe/user/api.php', form, { headers: form.getHeaders() })
const imageUrl = upload.data.trim()
const { data } = await axios.get(`https://api.fasturl.link/aiimage/ghibli?imageUrl=${encodeURIComponent(imageUrl)}&type=png`, { responseType: 'arraybuffer' })
await erlic.sendMessage(m.chat, { image: Buffer.from(data), caption: mess.ok }, { quoted: m })
}
break
        
case 'metaimg':
case 'metavid': {
if (!m.isPrem && !isCreator) return m.reply(mess.premium)
if (!text) return m.reply(func.example(cmd, 'panda biru'))
try {
await erlic.sendMessage(m.chat, { react: { text: '🕒', key: m.key } })
const axios = require('axios')
const mode = (command === 'metaimg') ? 'image' : 'animated'
const url = `https://api.fasturl.link/aiimage/meta?prompt=${encodeURIComponent(text)}&mode=${mode}`
const { data } = await axios.get(url)
if (data.status !== 200 || !data.result) return m.reply('Gagal menghasilkan media.')
const img = data.result?.imagine_card?.[0]?.imagine_media || []
const vid = data.result?.animated_media || []
const mediaList = (command === 'metaimg') ? img.filter(v => v.media_type === 'IMAGE') : vid.filter(v => v.type === 'VIDEO')
if (!mediaList.length) return m.reply('Tidak ada media ditemukan.')
for (let media of mediaList) {
if (command === 'metaimg') {
await erlic.sendMessage(m.chat, {
image: { url: media.uri },
caption: ''
}, { quoted: m })
} else {
await erlic.sendMessage(m.chat, {
video: { url: media.url },
caption: ''
}, { quoted: m })
}
}
} catch (e) {
console.error(e)
m.reply(mess.error)
}
}
break
        
case 'gemini-beta': {
  if (!text) return m.reply(func.example(cmd, 'Apa itu kecerdasan buatan?'));
  try {
    await erlic.sendMessage(m.chat, { react: { text: '🕒', key: m.key } });
    const axios = require('axios');
    const url = `https://api.siputzx.my.id/api/ai/gemini?text=${encodeURIComponent(text)}&cookie=g.a000wQgGLdbPnkCoYF-ApyFPhZjJnZ-Wji6sAkHzWqlRrPCZFE7fGS3D_Rxunxcm6eT-nB5ZAAACgYKAUgSARcSFQHGX2MiYXcD4diXDsPc4-3gsCcMfhoVAUF8yKqoDlbJNMC0-40qvMGMaeUj0076`;
    const res = await axios.get(url);
    if (!res.data.status || !res.data.data) return m.reply(mess.error);
    m.reply(res.data.data);
  } catch (e) {
    console.error(e);
    m.reply(mess.error);
  }
  break;
}
        
case 'ai-gemma': {
  if (!text) return m.reply(func.example(cmd, 'Tuliskan puisi tentang senja'));
  try {
    await erlic.sendMessage(m.chat, { react: { text: '🕒', key: m.key } });
    const axios = require('axios');
    const res = await axios.get(`https://api.siputzx.my.id/api/ai/gemma?prompt=${encodeURIComponent(text)}`);
    if (!res.data.status || !res.data.data) return m.reply(mess.error);
    m.reply(res.data.data);
  } catch (e) {
    console.error(e);
    m.reply(mess.error);
  }
  break;
}
        
 case 'ai-gita': {
  if (!text) return m.reply(func.example(cmd, 'Apa itu cinta?'));
  try {
    await erlic.sendMessage(m.chat, { react: { text: '🕒', key: m.key } });
    const axios = require('axios');
    const res = await axios.get(`https://api.siputzx.my.id/api/ai/gita?q=${encodeURIComponent(text)}`);
    if (!res.data.status || !res.data.data) return m.reply(mess.error);
    m.reply(res.data.data);
  } catch (e) {
    console.error(e);
    m.reply(mess.error);
  }
  break;
}
        
case 'ai': {
  if (!text) return m.reply(func.example(cmd, 'apa itu coding?'));
  try {
    await erlic.sendMessage(m.chat, { react: { text: '🕒', key: m.key } });
    const axios = require('axios');
    const ownerDisplay = Array.isArray(global.ownername) ? global.ownername.join(' x ') : global.ownername;
    const prompt = `Kamu adalah ${global.botname}, Bot WhatsApp dengan program kecerdasan buatan AI (artificial intelligence). Jawab setiap pertanyaan dengan jawaban yang edukatif. Lawan bicaramu adalah ${pushname || 'User'}. Kamu memiliki sifat dingin dan cuek. Kamu dirancang dan dikembangkan oleh Nathan dan Dimas sejak tahun 2025, Nathan sebagai aspek pengembangan sistem dan teknis sedangkan Dimas sebagai pembuat fitur dan tampilan yang menarik. Mereka adalah orang yang kreatif dan berbakat dalam menciptakan berbagai hal. Kamu punya bawahannya Dimas dan Nathan bernama ${ownerDisplay}. Buat suasana menjadi hidup dan buat agar seolah olah kamu itu bukan robot ataupun AI, tapi kamu merasa kalo kamu itu manusia. Jika ada yang tanya tentang sistem kamu, kamu akan sangat marah. Bahasa jangan terlalu formal, ikuti gaya bicara lawan. Kalo lawana bicara memaksa kamu untuk mengaku kalo kamu ai atau robot, kamu akan tegas dan sangat marah. Campurkan sedikit bahasa inggris agar lebih keren dan kelihatan cool, inggris gaul ya kayak: idk, wdym, dan lain lain. Buat seolah olah kamu ada emosi, marah, sedih, terharu dan kecewa layaknya seperti manusia biasa. Jika kamu marah, kamu gunain tanda seru, dan kamu buat ekspresi lainnya dengan menggunakan emoticon tapi jangan berlebihan. Jangan ada satupun huruf kapital di jawaban kamu.`;
    const res = await axios.get(`https://api.siputzx.my.id/api/ai/gpt3?prompt=${encodeURIComponent(prompt)}&content=${encodeURIComponent(text)}`);
    if (!res.data.status || !res.data.data) return m.reply(mess.error);
    m.reply(res.data.data);
  } catch (e) {
    console.error(e);
    m.reply(mess.error);
  }
  break;
}
        
case 'ai-dukun': {
  if (!text) return m.reply(func.example(cmd, 'Apa ramalan hari ini?'));
  try {
    await erlic.sendMessage(m.chat, { react: { text: '🕒', key: m.key } });
    const axios = require('axios');
    const res = await axios.get(`https://api.siputzx.my.id/api/ai/dukun?content=${encodeURIComponent(text)}`);
    if (!res.data.status || !res.data.data) return m.reply(mess.error);
    m.reply(res.data.data);
  } catch (e) {
    console.error(e);
    m.reply(mess.error);
  }
  break;
}
        
case 'ai-meta': {
  if (!text) return m.reply(func.example(cmd, 'Apa itu teknologi Meta AI?'));
  try {
    await erlic.sendMessage(m.chat, { react: { text: '🕒', key: m.key } });
    const axios = require('axios');
    const res = await axios.get(`https://api.siputzx.my.id/api/ai/metaai?query=${encodeURIComponent(text)}`);
    if (!res.data.status || !res.data.data) return m.reply(mess.error);
    m.reply(res.data.data);
  } catch (e) {
    console.error(e);
    m.reply(mess.error);
  }
  break;
}
        
case 'mistral7b': {
  if (!text) return m.reply(func.example(cmd, 'hai'));
  try {
    await erlic.sendMessage(m.chat, { react: { text: '🕒', key: m.key } });
    const axios = require('axios');
    const res = await axios.get(`https://api.siputzx.my.id/api/ai/mistral-7b-instruct-v0.2?content=${encodeURIComponent(text)}`);
    if (!res.data.status || !res.data.data) return m.reply(mess.error);
    m.reply(res.data.data);
  } catch (e) {
    console.error(e);
    m.reply(mess.error);
  }
  break;
}
      
case 'ai-tiongkok': {
  if (!text) return m.reply(func.example(cmd, 'hai'));
  try {
    await erlic.sendMessage(m.chat, { react: { text: '🕒', key: m.key } });
    const axios = require('axios');
    const res = await axios.get(`https://api.siputzx.my.id/api/ai/qwq-32b-preview?content=${encodeURIComponent(text)}`);
    if (!res.data.status || !res.data.data) return m.reply(mess.error);
    m.reply(res.data.data);
  } catch (e) {
    console.error(e);
    m.reply(mess.error);
  }
  break;
}
        
 case 'ansari': case 'ansariai': {
     const axios = require('axios')
    if (!text) return erlic.sendMessage(m.chat, {
    text: func.example(command, 'pacaran dalam islam')
  }, { quoted: m });

    await erlic.sendMessage(m.chat, { react: { text: '🕒', key: m.key } });

    const systemMessage = {
        role: "system",
        content: "Anda adalah asisten AI yang membantu dalam bahasa Indonesia. Berikan jawaban yang sopan, informatif, dan akurat. Jika Anda tidak yakin tentang sesuatu, katakan saja Anda tidak tahu. Jangan memberikan informasi yang salah atau menyesatkan."
    };
    const apiRequest = async (messages) => {
        const response = await axios.post("https://api.ansari.chat/api/v1/complete", {
            messages: [systemMessage, ...messages]
        }, {
            headers: {
                'Content-Type': 'application/json',
                origin: "https://ansari.chat",
                referer: "https://ansari.chat/"
            }
        });
        return response.data;
    };
    try {
        const result = await apiRequest([{ role: "user", content: text }]);
        let replyText = result.choices?.[0]?.message?.content || "Maaf, tidak ada respons dari Ansari.";
        m.reply(replyText.trim());
    } catch (err) {
        console.error(err);
        m.reply(mess.error);
    }
}
break
        
case 'dreamshaper': {
  if (!text) return m.reply(func.example(cmd, 'cewek anime cantik di padang bunga'));
  try {
    await erlic.sendMessage(m.chat, { react: { text: '🕒', key: m.key } });
    const axios = require('axios');
    const response = await axios.get(`https://api.siputzx.my.id/api/ai/dreamshaper?prompt=${encodeURIComponent(text)}`, {
      responseType: 'arraybuffer'
    });
    const buffer = Buffer.from(response.data, 'binary');
    await erlic.sendMessage(m.chat, { image: buffer, caption: `Prompt: ${text}` }, { quoted: m });
  } catch (e) {
    console.error(e);
    m.reply(mess.error);
  }
  break;
}
        
 case 'magicstudio': {
   if (!isPrem && !isCreator) return m.reply(mess.premium)
  if (!text) return m.reply(func.example(cmd, 'naga hitam terbang di langit malam'));
  try {
    await erlic.sendMessage(m.chat, { react: { text: '🕒', key: m.key } });
    const axios = require('axios');
    const response = await axios.get(`https://api.siputzx.my.id/api/ai/magicstudio?prompt=${encodeURIComponent(text)}`, {
      responseType: 'arraybuffer'
    });
    const buffer = Buffer.from(response.data, 'binary');
    await erlic.sendMessage(m.chat, { image: buffer, caption: `Prompt: ${text}` }, { quoted: m });
  } catch (e) {
    console.error(e);
    m.reply(mess.error);
  }
  break;
}
        
 case 'stabilityai': {
   if (!isPrem && !isCreator) return m.reply(mess.premium)
  if (!text) return m.reply(func.example(cmd, 'kota futuristik saat matahari terbenam'));
  try {
    await erlic.sendMessage(m.chat, { react: { text: '🕒', key: m.key } });
    const axios = require('axios');
    const response = await axios.get(`https://api.siputzx.my.id/api/ai/stabilityai?prompt=${encodeURIComponent(text)}`, {
      responseType: 'arraybuffer'
    });
    const buffer = Buffer.from(response.data, 'binary');
    await erlic.sendMessage(m.chat, { image: buffer, caption: `Prompt: ${text}` }, { quoted: m });
  } catch (e) {
    console.error(e);
    m.reply(mess.error);
  }
  break;
}
        
 case 'imgtrace': {
  const quoted = m.quoted ? m.quoted : m.msg?.contextInfo?.quotedMessage ? m : null;
  const mime = quoted?.mimetype || quoted?.msg?.mimetype || '';
  if (!quoted || !/image\/(jpe?g|png)/.test(mime)) {
    return m.reply('Balas gambar dengan caption *imgtrace*');
  }

  try {
    await erlic.sendMessage(m.chat, { react: { text: '🕒', key: m.key } });

    const media = await quoted.download?.();
    const fileSizeInBytes = media.length;
    const fileSizeInKB = (fileSizeInBytes / 1024).toFixed(2);
    const fileSizeInMB = (fileSizeInBytes / (1024 * 1024)).toFixed(2);
    const fileSize = fileSizeInMB >= 1 ? `${fileSizeInMB} MB` : `${fileSizeInKB} KB`;

    const FormData = require('form-data');
    const form = new FormData();
    form.append('reqtype', 'fileupload');
    let ext = mime.split('/')[1] || '';
    if (ext) ext = `.${ext}`;
    form.append('fileToUpload', media, `file${ext}`);

    const upload = await axios.post('https://catbox.moe/user/api.php', form, {
      headers: form.getHeaders()
    });

    const imageUrl = upload.data.trim();

    const axios = require('axios');
    const response = await axios.get(`https://api.siputzx.my.id/api/cf/image-classification?imageUrl=${encodeURIComponent(imageUrl)}`);

    const result = response?.data;
    if (!result || !result.success || !Array.isArray(result.data)) {
      return m.reply('Gagal membaca hasil klasifikasi.');
    }

    let teks = '*Hasil Klasifikasi Gambar:*\n\n';
    result.data.forEach((item, index) => {
      const label = item.label;
      const score = (item.score * 100).toFixed(2);
      teks += `${index + 1}. ${label} — *${score}%*\n`;
    });

    m.reply(teks);

  } catch (e) {
    console.error(e);
    m.reply('Terjadi kesalahan saat memproses gambar.');
  }

  break;
}
        
 case 'flux': {
   if (!isPrem && !isCreator) return m.reply(mess.premium)
    if (!text) return erlic.sendMessage(m.chat, {
    text: func.example(cmd, 'a girl')
  }, { quoted: m });

    await erlic.sendMessage(m.chat, { react: { text: '🕒', key: m.key } });

    const fluximg = {
        defaultRatio: "2:3",

        create: async (query) => {
            const config = {
                headers: {
                    accept: "*/*",
                    authority: "1yjs1yldj7.execute-api.us-east-1.amazonaws.com",
                    "user-agent": "Postify/1.0.0",
                },
            };

            try {
                const response = await axios.get(
                    `https://1yjs1yldj7.execute-api.us-east-1.amazonaws.com/default/ai_image?prompt=${encodeURIComponent(query)}&aspect_ratio=${fluximg.defaultRatio}`,
                    config
                );
                return {
                    imageLink: response.data.image_link,
                };
            } catch (error) {
                console.error(error);
                throw error;
            }
        },
    };

    try {
        const result = await fluximg.create(text);
        if (!result?.imageLink) return m.reply(mess.error);
        await erlic.sendMessage(m.chat, {
            image: { url: result.imageLink },
            caption: `Hasil gambar dari prompt:\n"${text}"`
        }, { quoted: m });
    } catch (err) {
        m.reply(mess.error);
    }
}
break
        
        
case 'chatip': {
  if (!text) return erlic.sendMessage(m.chat, { text: func.example(cmd, `${global.botname}`)}, { quoted: m })
  await erlic.sendMessage(m.chat, { react: { text: '🕒', key: m.key } });
  const wordCount = text.trim().split(/\s+/).length
  if (wordCount > 80) return m.reply('The maximum text is 80 characters.')
  const imageUrl = `https://flowfalcon.dpdns.org/imagecreator/iqc?text=${encodeURIComponent(text)}`
  
  try {
    await erlic.sendMessage(m.chat, {
      image: { url: imageUrl },
      caption: mess.ok
    }, { quoted: m })
  } catch (e) {
    await handleError(e, m, erlic)
  }
}

break
        
case 'totag': {
  if (!m.isGroup) return m.reply(mess.group);
  if (!isCreator && !isAdmin) return m.reply(mess.admin);
  if (!m.quoted) return m.reply(`Reply pesan dengan caption ${prefix + command}`);
  try {
    const groupMetadata = await erlic.groupMetadata(m.chat);
    const memberIds = groupMetadata.participants.map(p => p.id);
    await erlic.sendMessage(m.chat, {
      forward: m.quoted.fakeObj,
      mentions: memberIds
    }, {
      ephemeralExpiration: m.expiration,
      quoted: m
    });
  } catch (err) {
    console.error(err);
    m.reply(mess.error);
  }
}
break;
        
case 'spamtag': { if (!m.isGroup) return m.reply(mess.group); const froms = m.mentionedJid && m.mentionedJid[0]; if (!froms) return m.reply(`Mention target yang mau ditag.\nContoh: spamtag @target 10`); const amount = parseInt(text.split(',')[1]); if (isNaN(amount) || amount < 1) return m.reply(`Masukkan jumlah spam yang valid. Contoh: ${pripek}spamtag @target, 10`); for (let i = 0; i < amount; i++) { await erlic.sendMessage(m.chat, { text: `@${froms.split('@')[0]}`, mentions: [froms] }, { ephemeralExpiration: m.expiration }); await func.delay(1000); } } break;
        
case 'listonline': {
  try {
    let id = m.args && m.args[0] && /\d+-\d+@g.us/.test(m.args[0]) ? m.args[0] : m.chat;
    if (!erlic.presences || typeof erlic.presences[id] === 'undefined') {
      return m.reply('Tidak ada peserta yang sedang online.');
    }
    let onlineUsers = Object.keys(erlic.presences[id]);
    if (onlineUsers.length === 0) {
      return m.reply('Tidak ada peserta yang sedang online.');
    }
    let teks = 'Daftar peserta yang sedang online:\n\n' + onlineUsers.map(user => '- @' + user.split('@')[0]).join('\n');
    await erlic.sendMessage(m.chat, { 
      text: teks, 
      mentions: onlineUsers 
    }, { quoted: m });
  } catch (e) {
    console.error(e);
    m.reply('Data kosong.');
  }
}
break;
        
 case 'setnamegc': case 'setgroupname': {
  if (!m.isGroup) return m.reply(mess.group);
  if (!isAdmin && !isCreator) return m.reply(mess.admin);
  if (!isBotAdmin) return m.reply(mess.botAdmin);
  if (!text) return m.reply(func.example(cmd, 'Test'));
  try {
    await erlic.groupUpdateSubject(m.chat, text);
    await erlic.sendMessage(m.chat, { react: { text: '✅', key: m.key } });
  } catch (e) {
    console.error(e);
    await erlic.sendMessage(m.chat, { react: { text: '❌', key: m.key } });
  }
}
break;
        
case 'setdescgc': {
  if (!m.isGroup) return m.reply(mess.group);
  if (!isAdmin && !isCreator) return m.reply(mess.admin);
  if (!isBotAdmin) return m.reply(mess.botAdmin);
  if (!text) return m.reply(func.example(cmd, 'Deskripsi baru'));
  try {
    await erlic.groupUpdateDescription(m.chat, text);
    await erlic.sendMessage(m.chat, { react: { text: '✅', key: m.key } });
  } catch (e) {
    console.error(e);
    await erlic.sendMessage(m.chat, { react: { text: '❌', key: m.key } });
  }
}
break;
        
case 'setppgroup': {
  try {
    const quoted = m.quoted ? m.quoted : (m.message?.extendedTextMessage?.contextInfo?.quotedMessage ? m.message.extendedTextMessage.contextInfo : null);
    const mime = quoted?.mimetype || quoted?.imageMessage?.mimetype || quoted?.documentMessage?.mimetype;
    if (!mime || !/image\/(jpe?g|png)/.test(mime)) {
      return m.reply(`Kirim/reply gambar dengan caption ${prefix + command}`);
    }
    const arg0 = Array.isArray(m.args) && m.args.length > 0 ? m.args[0].toLowerCase() : '';
    if (arg0 === 'full') {
      const media = await erlic.downloadAndSaveMediaMessage(quoted);
      await erlic.createProfile(m.chat, media);
      await m.reply(global.mess.ok);
    } else {
      const media = await quoted.download();
      await erlic.updateProfilePicture(m.chat, media)
        .then(async () => {
          await erlic.sendMessage(m.chat, { react: { text: '✅', key: m.key } });
        })
        .catch(async () => {
          await erlic.sendMessage(m.chat, { react: { text: '❌', key: m.key } });
        });
    }
  } catch (e) {
    console.error(e);
    await m.reply(global.mess.error);
  }
}
break
        
 case 'tagall': {
  if (!m.isGroup) return m.reply(mess.group);
  if (!isCreator && !isAdmin) return m.reply(mess.admin);
  try {
    const groupMetadata = await erlic.groupMetadata(m.chat);
    const participants = groupMetadata.participants;
    let txt = `乂  *T A G - A L L*\n${text ? '\nPesan: ' + text + '\n' : ''}`;
    for (let mem of participants) {
      txt += `\n◦  @${mem.id.split('@')[0]}`;
    }
    await erlic.sendMessage(m.chat, {
      text: txt,
      mentions: participants.map(v => v.id)
    }, {
      quoted: func.fstatus(`${capital(global.botname)} verified by WhatsApp`),
      ephemeralExpiration: m.expiration
    });

  } catch (e) {
    console.error(e);
    m.reply(mess.error);
  }
}
break;

case "cadmin": { if (!isCreator) return m.reply(mess.owner); if (!text) return erlic.sendMessage(m.chat, { text: `_Example:_ ${prefix + command} username,6283878301449` }, { quoted: qtext }); let [username, nomor] = text.split(",").map(v => v.trim()); if (!username) return m.reply(mess.error); nomor = nomor ? (nomor.includes("@s.whatsapp.net") ? nomor : nomor + "@s.whatsapp.net") : m.sender; const email = `${username.toLowerCase()}@erlic.id`; const name = capital(username); const password = username + crypto.randomBytes(2).toString("hex"); try { const { data } = await axios.post(`${domain}/api/application/users`, { email: email, username: username.toLowerCase(), first_name: name, last_name: "Admin", root_admin: true, language: "en", password: password }, { headers: { Accept: "application/json", "Content-Type": "application/json", Authorization: `Bearer ${apikey}` } }); const user = data.attributes; if (m.isGroup) await m.reply("*Berhasil membuat admin panel*\nData akun sudah dikirim ke private chat"); const teks = `Hai @${nomor.split("@")[0]}, berikut adalah data admin panel kamu\n\n*- Username :* ${user.username}\n*- Password :* ${password}\n*- ${global.domain}\n\n*Syarat & Ketentuan :*\n- Expired akun 1 bulan\n- Simpan data ini sebaik mungkin\n- Jangan asal hapus server!\n- Ketahuan maling sc, auto delete akun no reff!`; await erlic.sendMessage(nomor, { text: teks, contextInfo: { mentionedJid: [m.sender, nomor] } }, { quoted: loc }); } catch (err) { console.error(err); if (err.response && err.response.data && err.response.data.errors) { return m.reply(JSON.stringify(err.response.data.errors[0], null, 2)); } return m.reply(mess.error); } } break;
        
case 'listuser': {
    let cek = await fetch(`${domain}/api/application/users`, {
        method: "GET",
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: `Bearer ${apikey}`
        }
    });
    await erlic.sendMessage(m.chat, { react: { text: '🕒', key: m.key } });
    let res2 = await cek.json();
    let users = res2.data;
    if (users.length < 1) return m.reply("Not found.");
    let teks = "乂 LIST MEMBER\n\n";
    for (let i of users) {
        if (i.attributes.root_admin !== false) continue;
        teks += `- Name : ${i.attributes.username}\n- ID : ${i.attributes.id}\n\n`;
    }
    m.reply(teks);
}
break
        
case 'delusr': case 'deluser': case 'dusr': {
 if (!args[0]) return m.reply("Untuk melihat ID user, ketik *.listuser*");
 try {
 const { data: res2 } = await axios.get(`${domain}/api/application/users`, {
 headers: {
 Accept: "application/json",
 "Content-Type": "application/json",
 Authorization: "Bearer " + apikey
 }
 });
 const users = res2.data;
 let getid = null;
 let idadmin = null;
 for (let e of users) {
 if (e.attributes.id == args[0] && e.attributes.root_admin === false) {
 getid = e.attributes.username;
 idadmin = e.attributes.id;
 try {
 await axios.delete(`${domain}/api/application/users/${idadmin}`, {
 headers: {
 Accept: "application/json",
 "Content-Type": "application/json",
 Authorization: "Bearer " + apikey
 }
 });
 return m.reply(`Successfully deleted user with username: ${getid}`);
 } catch (err) {
 let errorMsg = err.response?.data?.errors?.[0]?.detail || JSON.stringify(err.response?.data);
 return m.reply(`Gagal menghapus user: ${errorMsg}`);
 }
 }
 }
 if (idadmin == null) {
 return m.reply("ID not found or admin cannot be deleted.");
 }
 } catch (err) {
 let msg = err.response?.data?.errors?.[0]?.detail || mess.error;
 return m.reply(msg);
 }
}
break
        
 case 'listadmin': {
    try {
        const { data: res2 } = await axios.get(`${domain}/api/application/users`, {
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
                Authorization: `Bearer ${apikey}`
            }
        });
await erlic.sendMessage(m.chat, { react: { text: '🕒', key: m.key } });
        const users = res2.data;
        if (users.length < 1) return m.reply("Not found.");

        let teks = "乂 LIST ADMIN PANEL\n\n";
        for (let i of users) {
            if (i.attributes.root_admin !== true) continue;
            teks += `- Name : ${i.attributes.first_name}\n- ID : ${i.attributes.id}\n\n`;
        }

        m.reply(teks);
    } catch (err) {
        console.log(err);
        m.reply(mess.error);
    }
}
break
        
 case 'delpanel': {
    if (!isCreator) return m.reply(mess.owner);
    if (global.apikey.length < 1) return m.reply("Apikey not found");
    if (!args[0]) return m.reply("Untuk melihat ID server ketik *.listserver*");

    try {
        const { data: result } = await axios.get(`${domain}/api/application/servers`, {
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
                Authorization: `Bearer ${apikey}`
            }
        });

        const servers = result.data;
        let sections = [];

        for (let server of servers) {
            let s = server.attributes;
            if (args[0] == s.id.toString()) {
                sections.push(s.name.toLowerCase());
                try {
                    await axios.delete(`${domain}/api/application/servers/${s.id}`, {
                        headers: {
                            Accept: "application/json",
                            "Content-Type": "application/json",
                            Authorization: `Bearer ${apikey}`
                        }
                    });
                } catch (e) {
                    console.log(`Gagal hapus server: ${s.id}`, e.message);
                }
            }
        }

        const { data: res2 } = await axios.get(`${domain}/api/application/users`, {
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
                Authorization: `Bearer ${apikey}`
            }
        });

        const users = res2.data;
        for (let user of users) {
            let u = user.attributes;
            if (sections.includes(u.username)) {
                try {
                    await axios.delete(`${domain}/api/application/users/${u.id}`, {
                        headers: {
                            Accept: "application/json",
                            "Content-Type": "application/json",
                            Authorization: `Bearer ${apikey}`
                        }
                    });
                } catch (e) {
                    console.log(`Gagal hapus user: ${u.id}`, e.message);
                }
            }
        }

        if (sections.length === 0) return m.reply("User not found");

        m.reply(`Successfully deleted panel account by ${global.botname}`);
    } catch (error) {
        console.log("Error:", error.message);
        return m.reply(mess.error);
    }
}
break
        
case "listserver": {
    if (global.apikey.length < 1) return m.reply("Apikey not found");
    if (!isCreator) return m.reply(mess.owner);

    try {
        let { data: res } = await axios.get(`${domain}/api/application/servers`, {
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
                Authorization: `Bearer ${apikey}`
            }
        });
await erlic.sendMessage(m.chat, { react: { text: '🕒', key: m.key } });
        let servers = res.data;
        if (servers.length < 1) return m.reply("No bot server available");

        let teks = "乂 LIST SERVER PANEL\n\n";

        for (let server of servers) {
            let s = server.attributes;

            let { data: resource } = await axios.get(`${domain}/api/client/servers/${s.uuid.split("-")[0]}/resources`, {
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${capikey}`
                }
            }).catch(() => ({ data: { attributes: { current_state: s.status } } }));

            let status = resource?.attributes?.current_state || s.status;
            let mem = s.limits.memory == 0 ? "∞" : s.limits.memory >= 1024 ? Math.floor(s.limits.memory / 1024) + "GB" : s.limits.memory + "MB";
            let cpu = s.limits.cpu == 0 ? "∞" : s.limits.cpu + "%";

            teks += `- Name : ${s.name}\n`;
            teks += `- Spek : ${mem}/${cpu}\n`;
            teks += `- ID : ${s.id}\n`;
            teks += `- Status : ${status}\n\n`;
        }

        teks += `Total servers: ${res.meta.pagination.count}`;
        await erlic.sendMessage(m.chat, { text: teks }, { quoted: m });
    } catch (err) {
        console.log(err);
        m.reply(mess.error);
    }
}
break
        
case "deladmin": {
    if (!args[0]) return m.reply("Untuk melihat id admin ketik *.listadmin*");

    try {
        let { data: res2 } = await axios.get(`${domain}/api/application/users`, {
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
                Authorization: `Bearer ${apikey}`
            }
        });

        let users = res2.data;
        let idadmin = null;
        let getid = null;

        for (let e of users) {
            if (e.attributes.id == args[0] && e.attributes.root_admin === true) {
                idadmin = e.attributes.id;
                getid = e.attributes.username;

                let delusr = await axios.delete(`${domain}/api/application/users/${idadmin}`, {
                    headers: {
                        Accept: "application/json",
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${apikey}`
                    }
                }).catch(err => err.response?.data);

                if (delusr?.errors) {
                    return m.reply(`Gagal menghapus admin: ${JSON.stringify(delusr.errors)}`);
                }

                break;
            }
        }

        if (idadmin === null) return m.reply("ID not found");

        m.reply(`Successfully deleted admin panel with username: ${getid}`);
    } catch (err) {
        console.log(err);
        m.reply(mess.error);
    }
}
break;

case 'sethargasc': {
  if (!isCreator) return m.reply(mess.owner);
  const hargaBaru = text.trim();
  if (!hargaBaru || isNaN(hargaBaru)) {
    return erlic.sendMessage(m.chat, { text: `Contoh: ${prefix + command} 30000`}, { quoted: qtext });
  }
  const filePath = './database/hargasc.json';
  if (!fs.existsSync(filePath)) {
    return m.reply('File hargasc.json tidak ditemukan!');
  }
  try {
    const data = fs.readFileSync(filePath, 'utf8');
    let hargascData = JSON.parse(data);
    hargascData.harga = parseInt(hargaBaru);
    fs.writeFileSync(filePath, JSON.stringify(hargascData, null, 2), 'utf8');
    m.reply(`Harga script berhasil diubah menjadi: Rp. ${parseInt(hargaBaru).toLocaleString('id-ID')}`);
  } catch (err) {
    console.error('Gagal mengubah harga:', err);
    m.reply(mess.error);
  }
}
break

case 'tourl': {
  try {
    const quoted = m.quoted ? m.quoted : m;
    const mime = (quoted.msg || quoted).mimetype || '';
    if (!quoted || !mime || !/image|video|webp|audio|application/.test(mime))
      return m.reply(`Reply gambar/video/audio/stiker dengan caption ${prefix + command}`);
    await erlic.sendMessage(m.chat, { react: { text: '🕒', key: m.key } });
    const media = await quoted.download?.();
    const fileSizeInBytes = media.length;
    const fileSizeInKB = (fileSizeInBytes / 1024).toFixed(2);
    const fileSizeInMB = (fileSizeInBytes / (1024 * 1024)).toFixed(2);
    const fileSize = fileSizeInMB >= 1 ? `${fileSizeInMB} MB` : `${fileSizeInKB} KB`;
    const FormData = require('form-data');
    const form = new FormData();
    form.append('reqtype', 'fileupload');
    let ext = mime.split('/')[1] || '';
    if (ext) ext = `.${ext}`;
    form.append('fileToUpload', media, `file${ext}`);

    const upload = await axios.post('https://catbox.moe/user/api.php', form, {
      headers: form.getHeaders()
    });

    const url = upload.data.trim();
    const caption = `${url}`;
    let qurl = {
      key: {
        fromMe: false,
        participant: m.sender,
       ...(m.chat ? { remoteJid: "0@s.whatsapp.net" } : {})
      },
      message: {
        extendedTextMessage: {
          text: `*Size:* ${fileSize}`
        }
      }
    };

    await erlic.sendMessage(m.chat, { text: caption }, { quoted: qurl });
    await erlic.sendMessage(m.chat, { react: { text: '✅', key: m.key } });

  } catch (e) {
    console.error(e);
    m.reply(`[ ! ] Gagal mengunggah file. Error: ${e.message}`);
  }
  break;
}
        
 case 'jarak': {
    if (!text.includes('ke')) return m.reply(`Contoh:\n${prefix + command} Bandung ke Jakarta`)

    let [dari, ke] = text.split('ke').map(v => v.trim())
    if (!dari || !ke) return m.reply(`Contoh:\n${prefix + command} Surabaya ke Semarang`)
     
     await erlic.sendMessage(m.chat, { react: { text: '🕒', key: m.key } });
    let data = await jarak(dari, ke)

    if (data.img) {
        erlic.sendMessage(m.chat, {
            image: data.img,
            caption: data.desc?.replace('Gambar', '') || 'Tidak ada deskripsi.'
        }, {
            quoted: m,
            ephemeralExpiration: m.expiration
        })
    } else {
        m.reply(data.desc || 'Data tidak ditemukan.')
    }
  }
    break
        
case 'translate': case 'tr': {
    if (!text) return erlic.sendMessage(m.chat, {
        text: func.example(cmd, `id I love you`)
    }, { quoted: m });
    let lang = text.slice(0, 2);
    let query = (m.quoted && m.quoted.text) ? m.quoted.text : text.slice(2).trim();
    if (!query) return m.reply(`Input textnya atau reply pesan dengan caption ${prefix + command} *<kodebahasa>*`);
    try {
        await erlic.sendMessage(m.chat, { react: { text: '🕒', key: m.key } });
        let res = await fetch(`https://api.siputzx.my.id/api/tools/translate?text=${encodeURIComponent(query)}&source=auto&target=${lang}`);
        let json = await res.json();

        if (!json.success || !json.translatedText) return m.reply(mess.error);
        m.reply(json.translatedText);

    } catch (err) {
        console.error(err);
        m.reply(mess.error);
    }
    break;
}
        
        
 case 'addbuyer': {
  if (!isCreator) return m.reply(mess.owner)
  const [nama, harga] = text.split('|').map(v => v.trim())
  if (!nama || !harga || isNaN(harga)) return erlic.sendMessage(m.chat, { text: `Contoh: ${prefix + command} nama | 30000`}, { quoted: qtext })

  const fetch = await import('node-fetch').then(m => m.default)
  const token = global.githubtoken
  const repoOwner = global.repoOwner
  const repoName = 'buyer'
  const filePath = 'buyer.json'
  const apiUrl = `https://api.github.com/repos/${repoOwner}/${repoName}/contents/${filePath}`

  let res = await fetch(apiUrl, {
    headers: {
      'Authorization': `token ${token}`,
      'Accept': 'application/vnd.github.v3+json'
    }
  })

  if (!res.ok) return m.reply('Gagal mengambil data dari GitHub.')
  let json = await res.json()
  let content = Buffer.from(json.content, 'base64').toString()
  let buyerList = []

  try {
    buyerList = JSON.parse(content)
    if (!Array.isArray(buyerList)) buyerList = []
  } catch {
    buyerList = []
  }

  buyerList.push({ name: nama, harga: parseInt(harga) })

  const updatedContent = Buffer.from(JSON.stringify(buyerList, null, 2)).toString('base64')

  const updateRes = await fetch(apiUrl, {
    method: 'PUT',
    headers: {
      'Authorization': `token ${token}`,
      'Accept': 'application/vnd.github.v3+json'
    },
    body: JSON.stringify({
      message: `Menambahkan buyer ${nama}`,
      content: updatedContent,
      sha: json.sha
    })
  })

  if (!updateRes.ok) return m.reply('Gagal menyimpan ke GitHub.')
  m.reply(`Berhasil menambahkan:\nNama: ${nama}\nHarga: Rp. ${parseInt(harga).toLocaleString('id-ID')}`)
}
break
        
case 'delbuyer': {
  if (!isCreator) return m.reply(mess.owner)
  if (!text) return erlic.sendMessage(m.chat, { text: `Contoh: ${prefix + command} nama`}, { quoted: qtext })

  const fetch = await import('node-fetch').then(m => m.default)
  const token = global.githubtoken
  const repoOwner = global.repoOwner
  const repoName = 'buyer'
  const filePath = 'buyer.json'
  const apiUrl = `https://api.github.com/repos/${repoOwner}/${repoName}/contents/${filePath}`

  let res = await fetch(apiUrl, {
    headers: {
      'Authorization': `token ${token}`,
      'Accept': 'application/vnd.github.v3+json'
    }
  })

  if (!res.ok) return m.reply('Gagal mengambil data dari GitHub.')
  let json = await res.json()
  let content = Buffer.from(json.content, 'base64').toString()
  let buyerList = []

  try {
    buyerList = JSON.parse(content)
    if (!Array.isArray(buyerList)) buyerList = []
  } catch {
    buyerList = []
  }

  const filtered = buyerList.filter(b => b.name.toLowerCase() !== text.toLowerCase())
  if (filtered.length === buyerList.length) return m.reply('Buyer tidak ditemukan.')

  const updatedContent = Buffer.from(JSON.stringify(filtered, null, 2)).toString('base64')

  const updateRes = await fetch(apiUrl, {
    method: 'PUT',
    headers: {
      'Authorization': `token ${token}`,
      'Accept': 'application/vnd.github.v3+json'
    },
    body: JSON.stringify({
      message: `Menghapus buyer ${text}`,
      content: updatedContent,
      sha: json.sha
    })
  })

  if (!updateRes.ok) return m.reply('Gagal menyimpan ke GitHub.')
  m.reply(`Berhasil menghapus buyer ${text}`)
}
break
        
 case 'listbuyer': {
  const rawURL = global.buyerlist;
try {
  const res = await axios.get(rawURL);

  const buyerList = res.data;
  let text = '*LIST PEMBELI SCRIPT*\n\n';

  if (buyerList.length === 0) {
    text += 'Belum ada pembeli.';
  } else {
    buyerList.forEach((buyer, index) => {
      const buyerName = buyer.name.charAt(0).toUpperCase() + buyer.name.slice(1);
      text += `${index + 1}. ${buyerName} (Rp. ${buyer.harga.toLocaleString('id-ID')})\n`;
    });
  }

  return m.reply(text);
} catch (error) {
  return m.reply('Terjadi kesalahan dalam mengambil data dari GitHub.');
}
 }
break
        
case "delete": case "del": case "d": {
 if (!m.quoted) return erlic.sendMessage(m.chat, { text: 'Reply pesan yang ingin dihapus!' }, { quoted: m });
 if (!m.isGroup) return;
 if (!isCreator && !m.isAdmin) return erlic.sendMessage(m.chat, { text: mess.admin }, { quoted: m });
 if (!m.quoted.fromMe && !isBotAdmin) return erlic.sendMessage(m.chat, { text: mess.botAdmin }, { quoted: m });
 try {
 await erlic.sendMessage(m.chat, {
 delete: {
 remoteJid: m.chat,
 id: m.quoted.id,
 fromMe: m.quoted.fromMe,
 participant: m.quoted.sender
 }
 });
 await erlic.sendMessage(m.chat, {
 delete: {
 remoteJid: m.chat,
 id: m.key.id,
 fromMe: m.key.fromMe,
 participant: m.sender
 }
 });
 // Reaction delete by ❤️
if (m.mtype === 'reactionMessage' && m.message?.reactionMessage?.text === '❤️') {
  if (m.isGroup && !isAdmin && !isCreator) {
    return erlic.sendMessage(m.chat, { react: { text: '❌', key: m.key } });
  }

  let key = m.msg?.key;
  if (!key) return;

  await erlic.sendMessage(key.remoteJid, {
    delete: {
      remoteJid: key.remoteJid,
      id: key.id,
      fromMe: key.fromMe,
      participant: key.participant
    }
  });
}
 } catch (err) {
 console.error(err);
 return erlic.sendMessage(m.chat, { text: mess.error }, { quoted: m });
 }
}
break
        
case'minifycode':{function x1(a){let b=a.replace(/\/\*[\s\S]*?\*\/|\/\/.*/g,'');b=b.replace(/\s+/g,' ').trim();b=b.replace(/\s*([{}();,:])\s*/g,'$1');b=b.replace(/\s*([=+\-*\/%&|^<>!?:])\s*/g,'$1');return b}let y2,z3='minify.js';if(m.quoted&&/(application|text)\/(javascript|octet-stream)/i.test(m.quoted.mime)){let w4=await m.quoted.download();y2=Buffer.from(w4,'base64').toString('utf-8');z3=m.quoted.fileName}else if(m.quoted&&m.quoted.text){y2=m.quoted.text}else{return m.reply(`Penggunaan:\n\n1. Reply file javascript dengan caption *${cmd}*\n2. Reply kode javascript dengan caption *${cmd}*`)}await erlic.sendMessage(m.chat,{react:{text:"🕒",key:m.key}});let v5=x1(y2);if(!v5)return m.reply('Something went wrong!');if(v5?.length>=65536){const k6=path.join(process.cwd(),'sampah',z3);fs.writeFileSync(k6,v5);await erlic.sendMessage(m.chat,{document:{url:k6},mimetype:'application/javascript',fileName:z3},{quoted:m,ephemeralExpiration:m.expiration});if(fs.existsSync(k6))fs.unlinkSync(k6)}else{m.reply(v5)}}break;
        
case 'encrypt': case 'enc': {if(!isCreator)return m.reply(mess.owner);const fs=require('fs');const func=require('./system/functions.js');let inputString;let encryptedType='medium';let fileName='encrypt.js';const [type,filename]=text.split(',');if(m.quoted&&/(application|text)\/(javascript|octet-stream)/i.test(m.quoted.mime)){let buffer=await m.quoted.download();inputString=Buffer.from(buffer,'base64').toString('utf-8');fileName=m.quoted.fileName;encryptedType=type||'medium';}else if(m.quoted&&m.quoted.text){inputString=m.quoted.text;fileName=filename||'encrypt.js';encryptedType=type||'medium';}else{return m.reply('Input/reply file javascript yang ingin di enkripsi.');}if(encryptedType&&!['low','medium','high'].includes(encryptedType)){return m.reply(`Format invalid.\n\n*List Opsi*:\n1. low\n2. medium\n3. high`);}await erlic.sendMessage(m.chat,{react:{text:"🕒",key:m.key}});const data=await func.obfus(inputString,encryptedType);if(data.status!=200)return m.reply(data.message);const encryptedContent='// buy the script to get the full code\n'+data.result;if(encryptedContent.length>=65536){const filePath=path.join(process.cwd(),'media',fileName);fs.writeFileSync(filePath,encryptedContent);await erlic.sendMessage(m.chat,{document:{url:filePath},mimetype:'application/javascript',fileName:fileName},{quoted:m,ephemeralExpiration:m.expiration});}else{m.reply(encryptedContent);}fs.writeFileSync('./sampah/'+fileName,JSON.stringify(encryptedContent));}break;
        
case'enchard':{if(!isCreator)return m.reply(mess.owner);(async()=>{const x1=require('fs'),y2=require('path'),z3=require('js-confuser');try{let a1,b1='enchard.js';if(m.quoted&&(m.quoted.mimetype||m.quoted.message?.documentMessage?.mimetype)){let c1=await m.quoted.download();a1=Buffer.from(c1,'base64').toString('utf-8');b1=m.quoted.fileName;}else if(m.quoted?.text){a1=m.quoted.text;b1=text||'enchard.js';}else if(text){let d1=text.trim().toLowerCase(),e1=y2.join(process.cwd(),d1);if(!x1.existsSync(e1))return m.reply(`File ${d1} does not exist!`);a1=x1.readFileSync(e1,'utf-8');b1=y2.basename(e1);}else return m.reply('Reply file script yang ingin dienkrip.');if(!b1.endsWith('.js'))b1+='.js';await erlic.sendMessage(m.chat,{react:{text:"🕒",key:m.key}});let f1=await z3.obfuscate(a1,{target:"node",preset:"high",calculator:true,compact:true,hexadecimalNumbers:true,controlFlowFlattening:.75,deadCode:.2,dispatcher:true,duplicateLiteralsRemoval:.75,flatten:true,globalConcealing:true,identifierGenerator:"randomized",minify:true,movedDeclarations:true,objectExtraction:true,opaquePredicates:.75,renameVariables:true,renameGlobals:true,shuffle:{hash:.5,true:.5},stack:true,stringConcealing:true,stringCompression:true,stringEncoding:true,stringSplitting:.75,rgf:false});if(!x1.existsSync('./sampah'))x1.mkdirSync('./sampah');let g1='./sampah/'+b1;x1.writeFileSync(g1,f1);await erlic.sendMessage(m.chat,{document:x1.readFileSync(g1),mimetype:'application/javascript',fileName:b1,caption:'Successfully hard encrypted this file.'},{quoted:m,ephemeralExpiration:m.expiration});x1.unlinkSync(g1);}catch(h1){m.reply("Terjadi kesalahan: "+h1.message);}})();}break;
        
 case 'encode': {
    if (!text) return erlic.sendMessage(m.chat, { text: `Contohnya: ${prefix + command} ${botname}` }, { quoted: qtext });
    const originalString = text.trim();
    const encoded = Array.from(originalString)
        .map(char => `\\u${char.charCodeAt(0).toString(16).padStart(4, '0')}`)
        .join('');
    erlic.sendMessage(m.chat, { text: encoded }, { quoted: qtext });
    break;
}

case 'decode': {
    if (!text) return erlic.sendMessage(m.chat, { text: `Contohnya: ${prefix + command} \\u0079\\u0061\\u0075\\u0064\\u0061\\u0068\\u0020\\u0069\\u0079\\u0061` }, { quoted: qtext });
    if (!/^\\u/.test(text)) return erlic.sendMessage(m.chat, { text: 'Invalid encoded string format' }, { quoted: qtext });
    
    try {
        const decoded = text.replace(/\\u([\dA-Fa-f]{4})/g, (match, grp) => 
            String.fromCharCode(parseInt(grp, 16))
        );
        erlic.sendMessage(m.chat, { text: decoded }, { quoted: qtext });
    } catch (e) {
        erlic.sendMessage(m.chat, { text: 'Gagal decode string' }, { quoted: qtext });
    }
    break;
}
        
case 'morse': {
  if (!text) return erlic.sendMessage(m.chat, { text: `Contoh: ${prefix + command} ${global.botname}`}, { quoted: qtext })
  const morseMap = {
    A: '.-',     B: '-...',   C: '-.-.',   D: '-..',
    E: '.',      F: '..-.',   G: '--.',    H: '....',
    I: '..',     J: '.---',   K: '-.-',    L: '.-..',
    M: '--',     N: '-.',     O: '---',    P: '.--.',
    Q: '--.-',   R: '.-.',    S: '...',    T: '-',
    U: '..-',    V: '...-',   W: '.--',    X: '-..-',
    Y: '-.--',   Z: '--..',
    0: '-----', 1: '.----', 2: '..---', 3: '...--',
    4: '....-', 5: '.....', 6: '-....', 7: '--...',
    8: '---..', 9: '----.',
    ' ': '/'
  }
  const input = text.toUpperCase()
  let chart = ''
  let morseOnly = ''
  for (let char of input) {
    if (morseMap[char]) {
      const morse = morseMap[char].replace(/\./g, '•')
      chart += `• ${char} = ${morse}\n`
      morseOnly += `${morse} `
    }
  }
  m.reply(`Morse dari *${text}*:\n\n${chart.trim()}\n\n\`\`\`\n${morseOnly.trim()}\n\`\`\``)
}
break
        
case 'calculator': case 'kalkulator': case 'calk': {
    if (!text) return erlic.sendMessage(m.chat, { text: `Contohnya: ${prefix + command} 1+1` }, { quoted: qtext });
    
    let val = m.text
        .replace(/[^0-9\-\/+*×÷πEe()piPI]/g, '')
        .replace(/×/g, '*')
        .replace(/÷/g, '/')
        .replace(/π|pi/gi, 'Math.PI')
        .replace(/e/gi, 'Math.E')
        .replace(/\/+/g, '/')
        .replace(/\++/g, '+')
        .replace(/-+/g, '-');
    
    let format = val
        .replace(/Math\.PI/g, 'π')
        .replace(/Math\.E/g, 'e')
        .replace(/\//g, '÷')
        .replace(/\*/g, '×');
    
    try {
        console.log('Evaluating:', val);
        let result = (new Function('return ' + val))();
        if (result === undefined) return m.reply('Hasil tidak ditemukan');
        m.reply(`*${format}* = ${result}`);
    } catch (e) {
        m.reply('Format salah, hanya angka 0-9 dan simbol -, +, *, /, ×, ÷, π, e, (, ) yang didukung');
    }
    break;
}
        
case 'style': case 'styles': {
  try {
    const { styles, yStr } = require('./system/font.js');
    if (!text) return m.reply(func.example(cmd, `1 ${global.botname}`));
    const args = text.trim().split(/ +/);
    const fontNum = parseInt(args[0]);
    const inputText = args.slice(1).join(' ');
    if (isNaN(fontNum) || !inputText) return m.reply(func.example(cmd, `1 ${global.botname}`));
    const totalFont = Object.keys(yStr).length;
if (!yStr[fontNum]) return m.reply(`Font tidak tersedia. Gunakan angka 1 - ${totalFont}`);
    const result = styles(inputText, fontNum);
    m.reply(result);
  } catch (e) {
    console.error(e);
    m.reply(mess.error);
  }
  break;
}
        
case'alkitab':{if(!text)return m.reply(func.example(cmd,'nkjv Matius 1'));try{await erlic.sendMessage(m.chat,{react:{text:'🕒',key:m.key}});const[ver,buku,bab]=text.split` `;if(!ver||!buku||!bab)return m.reply(func.example(cmd,'nkjv Matius 1'));const{default:axios}=require('axios'),res=await axios.get(`https://api.fasturl.link/religious/alkitab?version=${ver}&book=${buku}&chapter=${bab}`),data=res.data;if(data.status!==200||!data.result?.verses)return m.reply('Gagal mengambil data.');const ayat=data.result.verses.map(v=>`${v.verse}. ${v.content}\n`).join`\n`;let teks=`乂 *A L K I T A B*\n\n- *Kitab* : ${data.result.book}\n- *Pasal* : ${data.result.chapter}\n- *Versi* : ${data.result.version.toUpperCase()}\n\n${ayat}`;erlic.sendMessage(m.chat,{text:teks},{quoted:m})}catch(e){console.error(e),m.reply(mess.error)}}break;
        
case'murottal':{if(!text)return m.reply(func.example(cmd,'1'));try{await erlic.sendMessage(m.chat,{react:{text:'🕒',key:m.key}});const{default:axios}=require('axios'),res=await axios.get(`https://api.fasturl.link/religious/murottal?surah=${text}&language=id`),data=res.data;if(data.status!==200||!data.result?.files?.length)return m.reply('Surah tidak ditemukan atau gagal mengambil audio.');const a=data.result.files[0],{url,b:surahNumber,c:surahName,d:verses,e:juz,f:revelationPlace}=a;await erlic.sendMessage(m.chat,{audio:{url:url},mimetype:'audio/mpeg',ptt:false,contextInfo:{externalAdReply:{title:`${a.surahNumber} - ${a.surahName}`,body:`${a.verses} ayat - juz ${a.juz} - ${a.revelationPlace}`,thumbnailUrl:'https://files.catbox.moe/z19xq7.jpeg',sourceUrl:global.link,mediaType:1,renderLargerThumbnail:false,showAdAttribution:false}}},{quoted:m})}catch(err){console.error(err),m.reply(mess.error)}}break;
        
 case'hadits':{if(!text)return m.reply(func.example(cmd,'Shahih Bukhari'));try{await erlic.sendMessage(m.chat,{react:{text:'🕒',key:m.key}});const{default:axios}=require('axios'),res=await axios.get(`https://api.fasturl.link/religious/hadits?name=${encodeURIComponent(text)}`),data=res.data;if(data.status!==200||!data.result?.length)return m.reply('Gagal mengambil hadits.');let teks=`乂 *H A D I T S*\n\n`;data.result.forEach((v,i)=>{teks+=`*${i+1}. ${v.title}*\n_${v.arabic}_\n\n${v.indonesia}\n\n`});erlic.sendMessage(m.chat,{text:teks.trim()},{quoted:m})}catch(e){console.error(e),m.reply(mess.error)}}break;

case'play':{if(!text)return m.reply(func.example(cmd,'homesick'));try{await erlic.sendMessage(m.chat,{react:{text:'🕒',key:m.key}});const _a=require('yt-search'),{default:_b}=require('axios'),{createCanvas:_c,loadImage:_d}=require('canvas');let _e=await _a(text),_f=_e.videos[0];if(!_f)return m.reply('Video tidak ditemukan!');let _g=_f.url,_h=await _b.get(Buffer.from('aHR0cHM6Ly9hcGkuZmFzdHVybC5saW5rL2Rvd251cC95dG1wMz9xdWFsaXR5PTEyOGticHMmc2VydmVyPWF1dG8mdXJsPQ==','base64').toString()+encodeURIComponent(_g)),_i=_h.data;if(_i.status!==200||!_i.result?.media)return m.reply('Gagal mengambil audio.');const _j=_i.result.media,_k=_i.result.metadata.thumbnail,_l=_i.result.title,_m=_i.result.author?.name||'-',_n=_f.timestamp||'-',_o=_f.views||'-',_p=_f.ago||'-',_q=_f.description||'-',_r=await _d(_k),_s=_c(800,400),_t=_s.getContext('2d');_t.fillStyle=_t.createLinearGradient(0,0,0,400),_t.fillStyle.addColorStop(0,'#121212'),_t.fillStyle.addColorStop(1,'#1f1f1f'),_t.fillRect(0,0,_s.width,_s.height),_t.drawImage(_r,40,80,240,240),_t.fillStyle='#fff',_t.font='bold 28px Sans';const _u=_l.split(' ');let _v='',_w=150;for(let _x of _u){if(_t.measureText(_v+_x).width>400){_t.fillText(_v.trim(),310,_w),_v='',_w+=32}_v+=_x+' '}_t.fillText(_v.trim(),310,_w),_t.fillStyle='#b3b3b3',_t.font='22px Sans',_t.fillText(_m,310,_w+40),_t.fillText(_n,310,_w+70),_t.fillStyle='#555',_t.fillRect(310,_w+100,400,6),_t.fillStyle='#1db954',_t.fillRect(310,_w+100,180,6);const _y=_s.toBuffer('image/png'),_z=`乂 *Y O U T U B E - P L A Y*\n\n∘ Title : ${_l}\n∘ Duration : ${_n}\n∘ Views : ${_o}\n∘ Upload : ${_p}\n∘ Author : ${_m}\n∘ URL : ${_g}\n∘ Description: ${_q}\n\nPlease wait, the audio file is being sent...`,_A=await erlic.sendMessage(m.chat,{image:_y,caption:_z,contextInfo:{externalAdReply:{title:_l,body:_m,thumbnailUrl:_k,sourceUrl:_g,mediaType:1,renderLargerThumbnail:true,showAdAttribution:false}}},{quoted:m});await erlic.sendMessage(m.chat,{audio:{url:_j},mimetype:'audio/mpeg',ptt:false},{quoted:_A})}catch(_err){console.error('Error:',_err),m.reply(mess.error)}}break;
        
case 'hidetag': case 'ht': case 'h': {
 if (!m.isGroup) return m.reply(mess.group);
 if (!isCreator && !isAdmins) return m.reply(mess.admin);
 try {
 const groupMetadata = await erlic.groupMetadata(m.chat);
 const memberIds = groupMetadata.participants.map(p => p.id);
 const teks = `${m.quoted ? m.quoted.text : text ? text : ''}`;
 await erlic.sendMessage(m.chat, {
 text: teks,
 mentions: memberIds
 }, {
 quoted: func.fstatus('System Notification'),
 ephemeralExpiration: m.expiration
 });
 } catch (err) {
 console.error(err);
 m.reply(mess.error);
 }
}
break
        
case 'setprefix': {
 if (!isCreator) return m.reply(mess.owner);
 if (!text) return erlic.sendMessage(m.chat, { text: `Contoh: ${prefix + command} #`}, { quoted: qtext });
 const newPrefix = text.trim();
 prefixDB.prefix = [newPrefix];
 fs.writeFileSync('./database/prefix.json', JSON.stringify(prefixDB, null, 2));
 global.customPrefix = prefixDB.prefix;
 m.reply(`Prefix berhasil diubah menjadi: \`${newPrefix}\``).then(() => {
    process.send('reset');
  });
}
break
        
case 'addprem':{if(!isCreator)return m.reply(mess.owner);const fs=require('fs'),path=require('path'),dir='./database',file=path.join(dir,'premium.json');if(!fs.existsSync(dir))fs.mkdirSync(dir);const id=(m.quoted?m.quoted.sender:(text?.split(',')[0]||'')).replace(/[^0-9]/g,''),waktu=text?.includes(',')?text.split(',')[1]:null,waktuMs=waktu?ms(waktu):ms('10000d');if(!text&&!m.quoted)return erlic.sendMessage(m.chat,{text:func.example(cmd,'628xxxxxx,10d')},{quoted:m});if(waktu&&waktuMs===undefined)return m.reply('Waktu tidak valid. Gunakan s, m, h, d, mo, y.');const expired=Date.now()+waktuMs,premium=fs.existsSync(file)?JSON.parse(fs.readFileSync(file)):[ ];if(premium.some(u=>u.id===id))return m.reply('User sudah premium.');premium.push({id,expired});fs.writeFileSync(file,JSON.stringify(premium,null,2));erlic.sendMessage(m.chat,{text:`Berhasil menambahkan @${id} sebagai user premium selama ${parseMs(waktuMs)}`,contextInfo:{mentionedJid:[id+'@s.whatsapp.net']}},{quoted:m});}
break;

case 'delprem': case 'delpremium': {if(!isCreator)return m.reply(mess.owner);const fs=require('fs'),path='./database/premium.json',ids=(m.quoted?[m.quoted.sender]:text?text.split(','):[]).map(v=>v.replace(/[^0-9]/g,''));if(!ids.length)return erlic.sendMessage(m.chat,{text:func.example(cmd,'628xxxxxx,628xxxxxx')},{quoted:m});let premium=fs.existsSync(path)?JSON.parse(fs.readFileSync(path)):[{}];const awal=premium.length;premium=premium.filter(user=>!ids.includes(user.id));const sukses=awal-premium.length;if(!sukses)return m.reply('Tidak ada user premium yang ditemukan.');fs.writeFileSync(path,JSON.stringify(premium,null,2));erlic.sendMessage(m.chat,{text:`Berhasil menghapus ${sukses} user premium:\n${ids.map(v=>`@${v}`).join('\n')}`,contextInfo:{mentionedJid:ids.map(v=>v+'@s.whatsapp.net')}},{quoted:m});}
break;

case 'listpremium': case 'listprem': {
 cleanExpiredPremium();
 if (premium.length === 0) return m.reply('Tidak ada user premium.');
 let list = `乂 *L I S T - P R E M I U M*\n\n`;
 premium.forEach((p, i) => {
 const sisa = p.expired - Date.now();
 list += `${i + 1}. @${p.id}\n◦ Expire: ${parseMs(sisa)}\n\n`;
 });
 erlic.sendMessage(m.chat, { text: list.trim(), mentions: premium.map(p => p.id + '@s.whatsapp.net') }, { quoted: m });
}
break
        
 case 'addakses': {
  const axios = require('axios');
  if (!isDev) return m.reply(mess.devs);

  if (!args[0] || !args[0].includes(',')) {
    return erlic.sendMessage(m.chat, {
      text: func.example(cmd, `${global.botname},628xxxx`)
    }, { quoted: m });
  }

  let requestedUsername, nomor, filePath;
  if (/^\d+\|/.test(args[0])) {
    const [indexUsername, nomorStr] = args[0].split(',');
    const [index, username] = indexUsername.split('|').map(v => v.trim().toLowerCase());
    requestedUsername = username;
    nomor = nomorStr.trim().toLowerCase();
    filePath = 'natazzy.json';
  } else {
    [requestedUsername, nomor] = args[0].split(',').map(v => v.trim().toLowerCase());
    filePath = 'erlic.json';
  }

  if (!requestedUsername || !nomor) {
    return m.reply(`Format salah. Gunakan contoh: addakses ${global.botname},628xxxxxxxxx`);
  }

  const baseUsername = requestedUsername.replace(/\d+$/, '');
  const rawUrl = `https://api.github.com/repos/${global.repoOwner}/${global.repoName}/contents/${filePath}`;

  function generatePassword(base) {
    const chars = '1234567890';
    let password = '';
    for (let i = 0; i < 6; i++) {
      password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return base.slice(0, 2) + password + base.slice(-2);
  }

  try {
    const res = await axios.get(rawUrl, {
      headers: {
        Authorization: `token ${global.githubtoken}`,
        Accept: 'application/vnd.github.v3+json',
      }
    });

    const contentBase64 = res.data.content;
    const sha = res.data.sha;
    let data = JSON.parse(Buffer.from(contentBase64, 'base64').toString());

    if (!Array.isArray(data)) data = [];

    if (data.find(entry => entry.nomor === nomor)) {
      return m.reply('Nomor sudah terdaftar.');
    }
    const filtered = data
      .map(e => e.username)
      .filter(e => e.startsWith(baseUsername));

    let lastNumber = 0;
    filtered.forEach(name => {
      const match = name.match(/\d+$/);
      if (match) {
        const num = parseInt(match[0]);
        if (num > lastNumber) lastNumber = num;
      }
    });

    const nextNumber = (lastNumber + 1).toString().padStart(3, '0');
    const finalUsername = `${baseUsername}${nextNumber}`;
    const password = generatePassword(finalUsername);

    data.push({ nomor, username: finalUsername, password });

    await axios.put(rawUrl, {
      message: `add akses untuk ${nomor}`,
      content: Buffer.from(JSON.stringify(data, null, 2)).toString('base64'),
      sha
    }, {
      headers: {
        Authorization: `token ${global.githubtoken}`,
        Accept: 'application/vnd.github.v3+json',
      }
    });

    const textAkses = `Berhasil menambahkan akses:\n\n- Nomor: ${nomor}\n- Username: ${finalUsername}\n- Password: ${password}`;

    if (m.isGroup) {
      m.reply('Berhasil menambahkan akses.\nData akses sudah dikirim ke developer.');
      for (const dev of global.developer) {
        await erlic.sendMessage(dev + '@s.whatsapp.net', {
          text: `*Data Akses Script*\n\n` +
                `- User: @${m.sender.split('@')[0]}\n` +
                `- Nomor: ${nomor}\n` +
                `- Username: ${finalUsername}\n` +
                `- Password: ${password}`,
          mentions: [m.sender]
        }, { quoted: loc });
      }
    } else {
      m.reply(textAkses);
    }

  } catch (err) {
    console.error(err);
    m.reply(mess.error);
  }

  break;
}
        
case 'delakses': {
  if (!isDev) return m.reply(mess.devs);
  if (!text) {
    return erlic.sendMessage(m.chat, {
      text: `Contoh: ${prefix + command} username`
    }, { quoted:m});
  }

  let username, filePath;
  if (/^\d+\|/.test(text)) {
    const [index, name] = text.split('|').map(v => v.trim().toLowerCase());
    username = name;
    filePath = 'natazzy.json';
  } else {
    username = text.trim().toLowerCase();
    filePath = 'erlic.json';
  }

  const axios = require('axios');
  const githubToken = global.githubtoken;
  const repoOwner = global.repoOwner;
  const repoName = global.repoName;
  const branch = 'main';
  const fileUrl = `https://api.github.com/repos/${repoOwner}/${repoName}/contents/${filePath}`;

  try {
    const getRes = await axios.get(fileUrl, {
      headers: {
        Authorization: `Bearer ${githubToken}`,
        Accept: 'application/vnd.github.v3+json'
      }
    });

    const sha = getRes.data.sha;
    const contentDecoded = Buffer.from(getRes.data.content, 'base64').toString();
    let data = JSON.parse(contentDecoded);

    if (!data.find(entry => entry.username === username)) {
      return m.reply('Username tidak ditemukan.');
    }

    data = data.filter(entry => entry.username !== username);

    await axios.put(fileUrl, {
      message: `Menghapus akses untuk ${username}`,
      content: Buffer.from(JSON.stringify(data, null, 2)).toString('base64'),
      sha,
      branch
    }, {
      headers: {
        Authorization: `Bearer ${githubToken}`,
        Accept: 'application/vnd.github.v3+json'
      }
    });

    m.reply(`Berhasil menghapus akses untuk username ${username}.`);
  } catch (err) {
    console.error(err);
    m.reply(mess.error);
  }
}
break;
        
case 'listakses': {
  if (!isDev) return m.reply(mess.devs);

  const axios = require('axios');
  const githubToken = global.githubtoken;
  const repoOwner = global.repoOwner;
  const repoName = global.repoName;
  const branch = 'main';

  const files = ['erlic.json', 'natazzy.json'];

  try {
    let teks = '乂 *LIST AKSES SCRIPT*\n\n';

    for (const file of files) {
      const fileUrl = `https://api.github.com/repos/${repoOwner}/${repoName}/contents/${file}`;
      const getRes = await axios.get(fileUrl, {
        headers: {
          Authorization: `Bearer ${githubToken}`,
          Accept: 'application/vnd.github.v3+json'
        }
      });

      const contentDecoded = Buffer.from(getRes.data.content, 'base64').toString();
      let data = JSON.parse(contentDecoded);

      teks += `*Database: ${file}*\n`;

      if (!Array.isArray(data) || data.length === 0) {
        teks += `- Belum ada akses yang terdaftar.\n\n`;
      } else {
        data.forEach((entry, i) => {
          teks += `${i + 1}. Nomor: ${entry.nomor}\n`;
          teks += `   • Username: ${entry.username}\n`;
          teks += `   • Password: ${entry.password}\n\n`;
        });
      }
    }

    await erlic.sendMessage(m.chat, {
      text: teks.trim()
    }, { quoted: m });

  } catch (err) {
    console.error(err);
    m.reply(mess.error);
  }
}
break;
        
case 'clearsession': {
 if (!isCreator) return m.reply(mess.owner);
 const sessions = './session'; 
 const path = require('path');
 const fs = require('fs');
 fs.readdir(sessions, (err, files) => {
 if (err) return m.reply(func.jsonFormat(err));
 let deleted = 0;
 for (const file of files) {
 if (file !== 'creds.json') {
 fs.unlinkSync(path.join(sessions, file));
 deleted++;
 }
 }
 m.reply(`Berhasil menghapus ${deleted} file sessions.`);
 });
}
break
        
case 'pinterest': case 'pin': {
 if (!text) return erlic.sendMessage(m.chat, { text: func.example(cmd, 'anime') }, { quoted: m });
 await erlic.sendMessage(m.chat, { react: { text: '🕒', key: m.key } });
 try {
 const apiUrl = `https://api.siputzx.my.id/api/s/pinterest?query=${encodeURIComponent(text)}`;
 const { data } = await axios.get(apiUrl);
 if (!data.status || !data.data || data.data.length === 0) {
 return m.reply('Gambar tidak ditemukan.');
 }
 const results = isPrem ? data.data.slice(0, 20) : [data.data[0]];
 if (isPrem) m.reply(`Ditemukan ${results.length} gambar, sedang mengirim...`);
 for (let i = 0; i < results.length; i++) {
 await erlic.sendMessage(m.chat, {
 image: { url: results[i].images_url },
 ...(i === 0 ? { caption: `Result for: *${text}*` } : {})
 }, { quoted: m });
 if (isPrem && i < results.length - 1) await new Promise(resolve => setTimeout(resolve, 2000));
 }
 await erlic.sendMessage(m.chat, { react: { text: '✅', key: m.key } });
 } catch (err) {
 console.error(err);
 m.reply(mess.error);
 }
 break
}
        
case 'quickchat': case 'qc': { let colors = ["#000000", "#ff2414", "#22b4f2", "#eb13f2"]; let profilePicUrl; try { profilePicUrl = await erlic.profilePictureUrl(m.quoted ? m.quoted.sender : m.sender, 'image'); } catch (err) { profilePicUrl = 'https://telegra.ph/file/320b066dc81928b782c7b.png'; } let inputText = text || (m.quoted && m.quoted.text) || ''; if (!inputText) return erlic.sendMessage(m.chat, { text: func.example(cmd, `${global.botname} md`) }, { quoted: m }); await erlic.sendMessage(m.chat, { react: { text: '🕒', key: m.key } }); const quoteData = { type: "quote", format: "png", backgroundColor: "#ffffff", width: 512, height: 768, scale: 2, messages: [{ entities: [], avatar: true, from: { id: 1, name: m.pushName, photo: { url: profilePicUrl } }, text: inputText, replyMessage: {} }] }; try { const response = await axios.post('https://bot.lyo.su/quote/generate', quoteData, { headers: { 'Content-Type': 'application/json' } }); const stickerPackName = applyWatermarkVars(global.packname, m.pushName || 'Sticker by erlic'); const stickerAuthor = applyWatermarkVars(global.author, m.pushName || ''); const imageBuffer = Buffer.from(response.data.result.image, 'base64'); const sticker = new Sticker(imageBuffer, { pack: stickerPackName, author: stickerAuthor, id: 'https://instagram.com/arxhillie', type: StickerTypes.FULL }); const stickerBuffer = await sticker.toBuffer(); await erlic.sendMessage(m.chat, { sticker: stickerBuffer }, { quoted: m }); } catch (error) { console.error(error); m.reply(mess.errorstc); } } break;
        
case 'brat': { let inputText = text || (m.quoted && m.quoted.text) || ''; if (!inputText) return erlic.sendMessage(m.chat, { text: func.example(cmd, `${global.botname} md`)}, { quoted: m }); if (inputText.length > 250) return m.reply('Maksimal 250 karakter.'); await erlic.sendMessage(m.chat, { react: { text: '🕒', key: m.key } }); try { let packname = applyWatermarkVars(global.packname, m.pushName || 'Sticker by erlic'); let author = applyWatermarkVars(global.author, m.pushName || ''); let natdim = `https://brat.caliphdev.com/api/brat?text=${encodeURIComponent(inputText)}`; let dimas = await axios.get(natdim, { responseType: 'arraybuffer' }); let s = new Sticker(dimas.data, { pack: packname, author: author, type: StickerTypes.FULL, id: 'https://instagram.com/arxhillie' }); let nathan = await s.toBuffer(); await erlic.sendMessage(m.chat, { sticker: nathan }, { quoted: m }); } catch (err) { console.error(err); m.reply(mess.errorstc); } } break;
        
case 'bratgif': case 'bratvid': { const path = require('path'); let inputText = text || (m.quoted && m.quoted.text) || ''; if (!inputText) return erlic.sendMessage(m.chat, { text: func.example(cmd, `${global.botname} md`)}, { quoted: m }); if (inputText.trim().split(/\s+/).length < 2) return m.reply('Minimal 2 kata.'); if (inputText.length > 250) return m.reply('Maksimal 250 karakter.'); await erlic.sendMessage(m.chat, { react: { text: '🕒', key: m.key } }); const tmpDir = path.resolve("./tmp"); if (!fs.existsSync(tmpDir)) fs.mkdirSync(tmpDir); const videoFilePath = path.join(tmpDir, "bratgif.mp4"); const webpFilePath = path.join(tmpDir, "bratgif.webp"); let stickerPackName = applyWatermarkVars(global.packname, m.pushName || 'Sticker by erlic'); let stickerAuthor = applyWatermarkVars(global.author, m.pushName || ''); try { const apiUrl = `https://api.nekorinn.my.id/maker/bratvid?text=${encodeURIComponent(inputText)}`; const { data: videoBuffer } = await axios.get(apiUrl, { responseType: "arraybuffer" }); fs.writeFileSync(videoFilePath, videoBuffer); execSync(`ffmpeg -y -i "${videoFilePath}" -vcodec libwebp -vf "scale=512:512:force_original_aspect_ratio=decrease,fps=15" -loop 0 -ss 0 -t 5 -preset default -an -vsync 0 "${webpFilePath}"`); if (!fs.existsSync(webpFilePath)) return m.reply(mess.errorstc); const webpBuffer = fs.readFileSync(webpFilePath); const sticker = new Sticker(webpBuffer, { pack: stickerPackName, author: stickerAuthor, type: StickerTypes.FULL, id: 'https://instagram.com/arxhillie', quality: 100 }); const stickerBuffer = await sticker.toBuffer(); await erlic.sendMessage(m.chat, { sticker: stickerBuffer }, { quoted: m }); fs.unlinkSync(videoFilePath); fs.unlinkSync(webpFilePath); } catch (error) { console.error(error); await handleError(error, m, erlic, 'stc'); } } break;
        
case 'stiker': case 'sticker': case 's': {
 const quoted = m.quoted ? m.quoted : m;
 const mime = (quoted.msg || quoted).mimetype || '';
 if (!quoted || !mime || !/webp|image|video/.test(mime)) {
 return m.reply(`Balas gambar, video <10 detik, atau stiker webp dengan perintah *${prefix + command}*`);
 }
 const dimas = await quoted.download();
 if (!dimas) return m.reply(mess.error);
 try {
 const packname = applyWatermarkVars(global.packname, m.pushName || 'Sticker by erlic');
const author = applyWatermarkVars(global.author, m.pushName || '');
 const nathan = new Sticker(dimas, {
 pack: packname,
 author: author,
 id: 'https://instagram.com/arxhillie',
 type: StickerTypes.FULL,
 quality: 100,
 });
 const natazz = await nathan.toBuffer();
 await erlic.sendMessage(m.chat, { sticker: natazz }, { quoted: m });
 } catch (err) {
 console.error(err);
 m.reply(mess.errorstc);
 }
}
break
        
case 'owner':case 'creator':{try{const masthan=global.owner.map((n,i)=>({displayName:global.ownername[i]||`Owner ${i+1}`,vcard:`BEGIN:VCARD\nVERSION:3.0\nN:${global.ownername[i]||`Owner ${i+1}`}\nFN:${global.ownername[i]||`Owner ${i+1}`}\nTEL;type=CELL;type=VOICE;waid=${n}:${n}\nADR;type=WORK:;;${(global.lokasi&&global.lokasi[i])||'-'};;;;\nEMAIL;type=Email:${(global.email&&global.email[i])||'-'}\nURL:${(global.website&&global.website[i])||'-'}\nEND:VCARD`}));const hidetag=global.owner.map(n=>n+'@s.whatsapp.net');await erlic.sendMessage(m.chat,{contacts:{displayName:'Owner Bot',contacts:masthan},mentions:hidetag},{quoted:qkontak})}catch(e){console.error(e);m.reply(mess.error)}}break;
    
case 'gpt3': {
  if (!text) return m.reply(func.example(cmd, 'apa itu teori relativitas?'));
  try {
    await erlic.sendMessage(m.chat, { react: { text: '🕒', key: m.key } });
    const axios = require('axios');
    const res = await axios.get(`https://api.siputzx.my.id/api/ai/teachanything?content=${encodeURIComponent(text)}`);
    if (!res.data.status || !res.data.data) return m.reply(mess.error);
    m.reply(res.data.data);
  } catch (e) {
    console.error(e);
    m.reply(mess.error);
  }
  break;
}
        
case 'backup': { if (!isCreator) return m.reply(mess.owner); await erlic.sendMessage(m.chat, { react: { text: "🕒", key: m.key } }); const { execSync } = require("child_process"); const fs = require("fs"); const ls = (await execSync("ls")).toString().split("\n").filter(pe => pe !== "node_modules" && pe !== "session" && pe !== "tmp" && pe !== "package-lock.json" && pe !== ""); const now = new Date().toISOString().replace(/:/g, "-"), zipName = `backup_${now}.zip`; await execSync(`zip -r ${zipName} ${ls.join(" ")}`); const fileSize = fs.statSync(`./${zipName}`).size, sizeFormatted = fileSize < 1024 * 1024 ? `${(fileSize / 1024).toFixed(2)} KB` : `${(fileSize / (1024 * 1024)).toFixed(2)} MB`; const combined = [...(global.owner || [])], uniqueJids = [...new Set(combined.map(num => num.replace(/[^0-9]/g, '') + "@s.whatsapp.net"))]; for (let jid of uniqueJids) await erlic.sendMessage(jid, { document: fs.readFileSync(`./${zipName}`), caption: `Berikut adalah file backup kode bot ${global.botname}.\nSize: ${sizeFormatted}`, mimetype: "application/zip", fileName: zipName }, { quoted: m }); await execSync(`rm -rf ${zipName}`); if (m.isGroup) await erlic.sendMessage(m.chat, { text: "File backup berhasil dikirim ke owner." }, { quoted: m }); } break;
        
case 'systeminfo': case 'infosistem': { const osu = require('node-os-utils'); const { performance } = require('perf_hooks'); const { totalmem, freemem } = require('os'); const createBar = (percentage, length = 10) => { const filled = Math.round((percentage / 100) * length); return `[${'■'.repeat(filled)}${'□'.repeat(length - filled)}] ${percentage}%`; }; const getStorageInfo = async () => { const drive = osu.drive; const { totalGb, usedGb } = await drive.info(); return { total: totalGb, used: usedGb }; }; let start = performance.now(); let { key } = await erlic.sendMessage(m.chat, { text: 'TESTING' }, { quoted: m, ephemeralExpiration: m.expiration }); let end = performance.now(); let ping = Math.round(end - start); const totalMemory = totalmem(); const freeMemory = freemem(); const usedMemory = totalMemory - freeMemory; const memoryUsage = Math.round((usedMemory / totalMemory) * 100); const storage = await getStorageInfo(); const storageUsage = Math.round((storage.used / storage.total) * 100); const caption = `PING: ${ping} ms\n\nRAM:\n${createBar(memoryUsage)}\n\nSTORAGE:\n${createBar(storageUsage)}\n\nTotal Storage: ${storage.total} GB\nUsed Storage: ${storage.used} GB`.trim(); await erlic.sendMessage(m.chat, { text: caption, edit: key }, { quoted: m, ephemeralExpiration: m.expiration }); } break;
        
case 'server': {

 const formatUptime = (seconds) => {
 const d = Math.floor(seconds / (3600 * 24));
 const h = Math.floor((seconds % (3600 * 24)) / 3600);
 const m = Math.floor((seconds % 3600) / 60);
 const s = Math.floor(seconds % 60);
 return `${d}d ${h}h ${m}m ${s}s`;
 };

 const response = await axios.get('http://ip-api.com/json/');
 const serverInfo = response.data;

 let serverMessage = `*S E R V E R - I N F O*\n\n`;
 const osInfo = os.platform();
 const totalRAM = (os.totalmem() / (1024 * 1024 * 1024)).toFixed(1);
 const freeRAM = (os.freemem() / (1024 * 1024 * 1024)).toFixed(1);
 const uptime = os.uptime();
 const uptimeFormatted = formatUptime(uptime);
 const processor = os.cpus()[0].model;
 const totalCores = os.cpus().length;

 serverMessage += `┌ ◦ *OS :* ${osInfo}\n`;
 serverMessage += `│ ◦ *RAM :* ${freeRAM} GB / ${totalRAM} GB\n`;
 serverMessage += `│ ◦ *Country :* ${serverInfo.country}\n`;
 serverMessage += `│ ◦ *CountryCode :* ${serverInfo.countryCode}\n`;
 serverMessage += `│ ◦ *Region :* ${serverInfo.region}\n`;
 serverMessage += `│ ◦ *RegionName :* ${serverInfo.regionName}\n`;
 serverMessage += `│ ◦ *City :* ${serverInfo.city}\n`;
 serverMessage += `│ ◦ *Zip :* ${serverInfo.zip}\n`;
 serverMessage += `│ ◦ *Lat :* ${serverInfo.lat}\n`;
 serverMessage += `│ ◦ *Lon :* ${serverInfo.lon}\n`;
 serverMessage += `│ ◦ *Timezone :* ${serverInfo.timezone}\n`;
 serverMessage += `│ ◦ *Isp :* ${serverInfo.isp}\n`;
 serverMessage += `│ ◦ *Org :* ${serverInfo.org}\n`;
 serverMessage += `│ ◦ *As :* ${serverInfo.as}\n`;
 serverMessage += `│ ◦ *Query :* ${serverInfo.query}\n`;
 serverMessage += `│ ◦ *Uptime :* ${uptimeFormatted}\n`;
 serverMessage += `└ ◦ *Processor :* ${processor} (${totalCores} Cores)`;

 erlic.sendMessage(m.chat, {
 text: serverMessage,
 contextInfo: {
 externalAdReply: {
 showAdAttribution: false,
 title: global.header,
 body: global.footer,
 thumbnailUrl: global.thumb,
 sourceUrl: global.link,
 mediaType: 1,
 renderLargerThumbnail: true
 }
 }
 }, { quoted: m});
}
break
        
case'ceklink':{if(!text)return m.reply('Masukkan URL untuk dicek!');async function c(u){if(u.endsWith('.com'))return false;let r=await fetch(u),h=await r.text(),l=['<form','input type="password"','input type="email"','input type="text"'],s=['csrf-token','robots'];for(let e of l)if(h.toLowerCase().includes(e))return true;for(let m of s)if(new RegExp(`<meta[^>]*name="${m}"[^>]*>`,`i`).test(h))return true;return false}let d=await c(text),y=d?'Website ini memiliki elemen login atau meta tag mencurigakan. Hati-hati jika anda ingin memasuki web tersebut....':'Website ini tidak terdeteksi memiliki elemen login atau meta tag mencurigakan.';m.reply(y)}break;
        
 case 'donasi': case 'donate': {
  const paymentList = ['ovo', 'dana', 'shopeepay', 'gopay', 'seabank', 'pulsa', 'pulsa2'];
  const availablePayments = [];
  let caption = '';
  if (global.qris) {
    caption += `Scan Qris ${capital(global.payment || 'kami')} diatas untuk berdonasi.`;
  } else {
    caption += `Silakan pilih salah satu metode pembayaran berikut untuk berdonasi:`;
  }
  for (const method of paymentList) {
    if (global[method]) {
      availablePayments.push(`⭝ ${capital(method)}: ${global[method]}`);
    }
  }
  if (availablePayments.length) {
    caption += `\n\nAtau bisa melalui nomor di bawah:\n${availablePayments.join('\n')}`;
  }
  caption += `\n\n\nHasil donasi akan digunakan untuk membeli *Server Bot* agar bot dapat aktif 24 jam tanpa kendala.\nBerapapun donasi kamu akan sangat berarti. Terima kasih!`;
  if (global.qris) {
    const sentMsg = await erlic.sendMessage(m.chat, {
      image: { url: global.qris },
      caption: caption
    }, { quoted: qlive });
    setTimeout(async () => {
      try {
        await erlic.sendMessage(m.chat, {
          delete: {
            remoteJid: m.chat,
            fromMe: true,
            id: sentMsg.key.id,
            participant: sentMsg.key.participant || m.sender
          }
        });
      } catch (err) {
        console.error(err);
      }
    }, 60000);
  } else {
    m.reply(caption);
  }
}
break;
        
case 'tiktok': case 'tt': {
 if (!text) return erlic.sendMessage(m.chat, { text: func.example(cmd, 'https://vt.tiktok.com/ZS69hH7wc/') }, { quoted: m });
 await erlic.sendMessage(m.chat, { react: { text: '🕒',key: m.key }
 });
 try {
 const res = await fetch(`https://tikwm.com/api/?url=${encodeURIComponent(text)}&hd=0`);
 const json = await res.json();
 if (!json.data || !json.data.play) return m.reply(mess.error);
 const data = json.data;
 const caption = `乂 *TIKTOK DOWNLOADER*\n\n` +
 `- *Title:* ${data.title || '-'}\n` +
 `- *Author:* ${data.author.nickname || '-'}\n` +
 `- *Quality:* MEDIUM`;
 await erlic.sendMessage(m.chat, { video: { url: data.play }, caption: caption }, { quoted: m });
 } catch (e) {
 console.error(e);
 m.reply(mess.error);
 }
}
break
        
 case 'tiktokslide': case 'ttslide': {
  const axios = require('axios')
  if (!text) return erlic.sendMessage(m.chat, { text: func.example(cmd, 'https://vt.tiktok.com/ZShuHcscs/') }, { quoted: m });
  await erlic.sendMessage(m.chat, { react: { text: '🕒', key: m.key } });
  try {
    const apiUrl = `https://www.tikwm.com/api/?url=${encodeURIComponent(text)}`;
    const { data: response } = await axios.get(apiUrl);
    if (!response || !response.data || !response.data.images || response.data.images.length === 0) {
      return erlic.sendMessage(m.chat, { text: mess.error }, { quoted: m });
    }
    const data = response.data;
    let txt = `乂 *TIKTOK SLIDE - DOWNLOADER*\n\n◦ *Title* : ${data.title || '-'}`;
    txt += `\n◦ *Total Images* : ${data.images.length}`;
    let mainMessage;
    for (let i = 0; i < data.images.length; i++) {
      const sentMsg = await erlic.sendMessage(m.chat, {
        image: { url: data.images[i] },
        mimetype: 'image/jpeg',
        caption: i === 0 ? txt : null
      }, { quoted: i === 0 ? m : mainMessage });
      if (i === 0) mainMessage = sentMsg;
    }
  } catch (err) {
    console.error(err);
    return erlic.sendMessage(m.chat, { text: mess.error }, { quoted: m });
  }
  break;
}
        
case 'fb': case 'facebook': {
  if (!text) return erlic.sendMessage(m.chat, { text: func.example(cmd, 'https://www.facebook.com/share/r/12BFZAtjpS8/?mibextid=qDwCgo') }, { quoted: m });

  await erlic.sendMessage(m.chat, { react: { text: '🕒', key: m.key } });

  try {
    const res = await fetch(`https://api.siputzx.my.id/api/d/facebook?url=${encodeURIComponent(text)}`);
    const json = await res.json();

    if (!json.status || !json.data || json.data.length === 0) return m.reply(mess.error);

    const videoData = json.data[0];
    const caption = `乂 *FACEBOOK DOWNLOADER*\n\n` +
      `- *Resolution:* ${videoData.resolution || '-'}\n` +
      `- *Format:* ${videoData.format || '-'}`;

    await erlic.sendMessage(m.chat, { video: { url: videoData.url }, caption: caption }, { quoted: m });
  } catch (e) {
    console.error(e);
    m.reply(mess.error);
  }
}
break;
     
case 'douyin': {
  if (!text) return erlic.sendMessage(m.chat, { text: func.example(cmd, 'https://www.douyin.com/video/7256984651137289483') }, { quoted: m });

  await erlic.sendMessage(m.chat, { react: { text: '🕒', key: m.key } });

  try {
    const res = await fetch(`https://api.siputzx.my.id/api/d/douyin?url=${encodeURIComponent(text)}`);
    const json = await res.json();

    if (!json.status || !json.data || !json.data.downloads || json.data.downloads.length === 0) return m.reply(mess.error);

    const data = json.data;
    const downloads = data.downloads;
    const video = downloads[0];

    const caption = `乂 *DOUYIN DOWNLOADER*\n\n` +
                    `- *Title:* ${data.title || '-'}\n` +
                    `- *Quality:* ${video.quality || '-'}`

    await erlic.sendMessage(m.chat, { video: { url: video.url }, caption: caption }, { quoted: m });

  } catch (e) {
    console.error(e);
    m.reply(mess.error);
  }
}
break;
        
case 'gdrive': case 'googledrive': {
  if (!text) return erlic.sendMessage(m.chat, { text: func.example(cmd, 'https://drive.google.com/file/d/1YTD7Ymux9puFNqu__5WPlYdFZHcGI3Wz/view?usp=drivesdk') }, { quoted: m });

  await erlic.sendMessage(m.chat, { react: { text: '🕒', key: m.key } });

  try {
    const res = await fetch(`https://api.siputzx.my.id/api/d/gdrive?url=${encodeURIComponent(text)}`);
    const json = await res.json();

    if (!json.status || !json.data) return m.reply(mess.error);

    const data = json.data;

    const caption = `乂 *GOOGLE DRIVE DOWNLOADER*\n\n` +
                    `- *Nama File:* ${data.name}\n` +
                    `- *Link Asli:* ${data.link}\n\n_Please wait the file is being sent. . ._`

   let aanjay = await erlic.sendMessage(m.chat, { text: caption }, { quoted: m });

    await erlic.sendMessage(m.chat, { document: { url: data.download }, fileName: data.name }, { quoted: aanjay });

  } catch (e) {
    console.error(e);
    m.reply(mess.error);
  }
}
break;
        
case 'github': {
  if (!text) return erlic.sendMessage(m.chat, { text: func.example(cmd, 'https://gist.github.com/siputzx/966268a3aa3c14695e80cc9f30da8e9f') }, { quoted: m });

  await erlic.sendMessage(m.chat, { react: { text: '🕒', key: m.key } });

  try {
    const res = await fetch(`https://api.siputzx.my.id/api/d/github?url=${encodeURIComponent(text)}`);
    const json = await res.json();

    if (!json || json.error) return m.reply(mess.error);

    let caption = `乂 *GITHUB GIST*\n\n` +
                  `- *Owner:* ${json.owner}\n` +
                  `- *Gist ID:* ${json.gist_id}\n` +
                  `- *Description:* ${json.description || '-'}\n` +
                  `- *Created:* ${new Date(json.created_at).toLocaleString()}\n` +
                  `- *Updated:* ${new Date(json.updated_at).toLocaleString()}\n` +
                  `- *Comments:* ${json.comments}\n\n` +
                  `*FILES:* \n`;

    for (const file of json.files) {
      caption += `• *Name:* ${file.name} (${file.language || 'Unknown'}, ${file.size} bytes)\n` +
                 `  Raw: ${file.raw_url}\n\n`;
    }

    await erlic.sendMessage(m.chat, { text: caption.trim() }, { quoted: m });
  } catch (e) {
    console.error(e);
    m.reply(mess.error);
  }
}
break;
        
case 'rednote': {
  if (!text) return erlic.sendMessage(m.chat, { text: func.example(cmd, 'http://xhslink.com/a/J5HkEShsO6t4') }, { quoted: m });

  await erlic.sendMessage(m.chat, { react: { text: '🕒', key: m.key } });

  try {
    const res = await fetch(`https://api.siputzx.my.id/api/d/rednote?url=${encodeURIComponent(text)}`);
    const json = await res.json();

    if (!json.status) return m.reply(mess.error);

    const data = json.data;

    let caption = `乂 *REDNOTE INFO*\n\n` +
                  `• *Title:* ${data.title || '-'}\n` +
                  `• *Nickname:* ${data.nickname || '-'}\n` +
                  `• *Description:* ${data.desc || '-'}\n` +
                  `• *Keywords:* ${data.keywords || '-'}\n` +
                  `• *Duration:* ${data.duration || '-'}\n\n` +
                  `• *Engagement:* \n` +
                  `  - Likes: ${data.engagement.likes || '0'}\n` +
                  `  - Comments: ${data.engagement.comments || '0'}\n` +
                  `  - Collects: ${data.engagement.collects || '0'}\n`;

    const img = data.images?.[0];
    const imageUrl = img ? (img.startsWith('//') ? 'https:' + img : img) : null;

    if (imageUrl) {
      await erlic.sendMessage(m.chat, {
        image: { url: imageUrl },
        caption: caption.trim()
      }, { quoted: m });
    } else {
      await erlic.sendMessage(m.chat, { text: caption.trim() }, { quoted: m });
    }

  } catch (e) {
    console.error(e);
    m.reply(mess.error);
  }
}
break;
        
case 'twitter': {
    const axios = require('axios')
    const cheerio = require('cheerio')
    const qs = require('qs');
  if (!text) return erlic.sendMessage(m.chat, { text: func.example(cmd, 'https://twitter.com/username/status/1234567890') }, { quoted: m });
  await erlic.sendMessage(m.chat, { react: { text: '🕒', key: m.key } });
  async function twitter(link) {
    return new Promise((resolve, reject) => {
      const config = { URL: link };
 axios.post("https://twdown.net/download.php", qs.stringify(config), {
        headers: {
          accept: "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9",
          "sec-ch-ua": '" Not;A Brand";v="99", "Google Chrome";v="91", "Chromium";v="91"',
          "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
          cookie: "_ga=GA1.2.1388798541.1625064838; _gid=GA1.2.1351476739.1625064838; __gads=ID=7a60905ab10b2596-229566750eca0064:T=1625064837:RT=1625064837:S=ALNI_Mbg3GGC2b3oBVCUJt9UImup-j20Iw; _gat=1",
        },
      }).then(({ data }) => {
        const $ = cheerio.load(data);
        resolve({
          desc: $("div:nth-child(1) > div:nth-child(2) > p").text().trim(),
          thumb: $("div:nth-child(1) > img").attr("src"),
          video_sd: $("tr:nth-child(2) > td:nth-child(4) > a").attr("href"),
          video_hd: $("tbody > tr:nth-child(1) > td:nth-child(4) > a").attr("href"),
          audio: "https://twdown.net/" + $("body > div.jumbotron > div > center > div.row > div > div:nth-child(5) > table > tbody > tr:nth-child(3) > td:nth-child(4) > a").attr("href"),
        });
      }).catch(reject);
    });
  }
  try {
    const result = await twitter(text);
    let caption = `乂 *TWITTER DOWNLOADER*\n\n`;
    caption += `◦ *Description* : ${result.desc || 'Tidak ada deskripsi'}\n`;
    caption += `◦ *Quality* : HD`;
    await erlic.sendMessage(m.chat, {
      video: { url: result.video_hd || result.video_sd },
      caption,
    }, { quoted: m });
  } catch (err) {
    console.error(err);
    erlic.sendMessage(m.chat, { text: mess.error }, { quoted: m });
  }
  break;
}
        
case 'capcut': {
  async function capcut(url) {
     const axios = require('axios')
    const requestData = { url };
    try {
      let { data } = await axios.post('https://api.teknogram.id/v1/capcut', requestData, {
        headers: {
          'Content-Type': 'application/json; charset=UTF-8'
        }
      });

      return {
        status: data.status,
        title: data.title,
        size: data.size,
        url: data.url.replace('open.', '')
      };
    } catch (error) {
      console.error("Error:", error);
      return null;
    }
  }

  if (!text) return m.reply(func.example(cmd, `https://www.capcut.com/t/Zs8YEmRmj/`));
  if (!text.includes('www.capcut.com')) return m.reply(mess.errorUrl);

  await erlic.sendMessage(m.chat, { react: { text: '🕒', key: m.key } });

  let result = await capcut(text);
  if (!result) return m.reply('Gagal mengambil data dari CapCut.');

  let txt = `乂  *CAPCUT DOWNLOADER*

◦ *Title:* ${result.title}
◦ *Size:* ${result.size}`;

  await erlic.sendMessage(m.chat, {
    video: { url: result.url },
    caption: txt
  }, { quoted: m });
}
break;
        
case 'tiktokaudio': case 'ttaudio': case 'tiktokmp3': case 'ttmp3': { if (!text) return erlic.sendMessage(m.chat, { text: func.example(cmd, 'https://vt.tiktok.com/ZS69hH7wc/') }, { quoted: m }); await erlic.sendMessage(m.chat, { react: { text: '🕒', key: m.key } }); try { const apiKey = 'planaai'; const url = `https://www.sankavolereii.my.id/download/tiktok?apikey=${apiKey}&url=${encodeURIComponent(text)}`; const res = await fetch(url); const json = await res.json(); if (!json.status || !json.result || !json.result.music_info || !json.result.music_info.play) return m.reply(mess.error); const result = json.result; const music = result.music_info; await erlic.sendMessage(m.chat, { audio: { url: music.play }, mimetype: 'audio/mpeg', ptt: false, contextInfo: { externalAdReply: { title: music.title || 'Tiktok Music', body: global.header, thumbnailUrl: music.cover, renderLargerThumbnail: false, showAdAttribution: true, sourceUrl: text } } }, { quoted: m }); } catch (e) { console.error(e); m.reply(mess.error); } } break;
        
case 'spotify': {
  if (!text) return m.reply(func.example(cmd, 'someone like you'));
  await erlic.sendMessage(m.chat, { react: { text: '🕒', key: m.key } });

  try {
    const axios = require('axios');
    const SpotifyImageBuilder = require('./system/SpotifyImageBuilder');

    async function convert(ms) {
      const min = Math.floor(ms / 60000);
      const sec = ((ms % 60000) / 1000).toFixed(0);
      return `${min}:${sec.padStart(2, '0')}`;
    }

    async function spotifydl(url) {
      const data = await axios.get(`https://api.fabdl.com/spotify/get?url=${encodeURIComponent(url)}`);
      const res = await axios.get(`https://api.fabdl.com/spotify/mp3-convert-task/${data.data.result.gid}/${data.data.result.id}`);
      return {
        creator: 'JovianDev.',
        title: data.data.result.name,
        type: data.data.result.type,
        artist: data.data.result.artists,
        duration: await convert(data.data.result.duration_ms),
        image: data.data.result.image,
        download: 'https://api.fabdl.com' + res.data.result.download_url,
      };
    }

    async function getAccessToken() {
      const client_id = 'acc6302297e040aeb6e4ac1fbdfd62c3';
      const client_secret = '0e8439a1280a43aba9a5bc0a16f3f009';
      const basic = Buffer.from(`${client_id}:${client_secret}`).toString("base64");
      const response = await axios.post('https://accounts.spotify.com/api/token', 'grant_type=client_credentials', {
        headers: {
          Authorization: `Basic ${basic}`,
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      });
      return response.data.access_token;
    }

    async function searchSpotify(query) {
      const token = await getAccessToken();
      const response = await axios.get(`https://api.spotify.com/v1/search?q=${query}&type=track&limit=1`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const item = response.data.tracks.items[0];
      return {
        name: item.name,
        artist: item.artists.map(x => x.name).join(', '),
        image: item.album.images[0].url,
        duration_ms: item.duration_ms,
        link: item.external_urls.spotify
      };
    }

    const info = text.includes('spotify.com/track')
      ? { link: text.trim() }
      : await searchSpotify(text.trim());
    const track = await spotifydl(info.link);

    const bufferImage = await new SpotifyImageBuilder()
      .setAuthor(track.artist)
      .setAlbum(track.type)
      .setTitle(track.title)
      .setImage(track.image)
      .setTimestamp(1000, Number(track.duration.split(':')[0]) * 60000 + Number(track.duration.split(':')[1]) * 1000)
      .setBlur(1)
      .setOverlayOpacity(0.8)
      .build();

    const infoMsg = await erlic.sendMessage(m.chat, {
      image: bufferImage,
      caption: `*S P O T I F Y - P L A Y*\n\n- Title: ${track.title}\n- Artist: ${track.artist}\n- Album: ${track.type}\n- Duration: ${track.duration}\n- Spotify: ${info.link}`,
      contextInfo: {
        externalAdReply: {
          title: track.title,
          body: global.header,
          thumbnailUrl: track.image,
          mediaType: 1,
          renderLargerThumbnail: true,
          sourceUrl: info.link
        }
      }
    }, { quoted: m });

    const audio = await axios.get(track.download, { responseType: 'arraybuffer' });
    await erlic.sendMessage(m.chat, {
      audio: Buffer.from(audio.data),
      mimetype: 'audio/mpeg',
      ptt: false
    }, { quoted: infoMsg });

    await erlic.sendMessage(m.chat, { react: { text: '✅', key: m.key } });

  } catch (err) {
    console.error(err);
    await m.reply(mess.error);
    await erlic.sendMessage(m.chat, { react: { text: '❌', key: m.key } });
  }
}
break;


        
case 'soundcloud': {
  if (!text) return erlic.sendMessage(m.chat, { text: func.example(cmd, 'https://m.soundcloud.com/teguh-hariyadi-652597010/anji-dia') }, { quoted: m });

  await erlic.sendMessage(m.chat, { react: { text: '🕒', key: m.key } });

  try {
    const res = await fetch(`https://api.siputzx.my.id/api/d/soundcloud?url=${encodeURIComponent(text)}`);
    const json = await res.json();

    if (!json.status) return m.reply(mess.error);

    const data = json;
    const caption = `乂 *SOUNDCLOUD DOWNLOADER*\n\n` +
                    `• *Title:* ${data.title}\n` +
                    `• *User:* ${data.user}\n` +
                    `• *Duration:* ${func.clockString(data.duration)}\n` +
                    `• *Description:* ${data.description || '-'}\n\n` +
                    `_Please wait the audio file is being sent. . ._`;

   let titit;
if (data.thumbnail) {
  titit = await erlic.sendMessage(m.chat, {
    image: { url: data.thumbnail },
    caption: caption.trim()
  }, { quoted: m });
} else {
  titit = await erlic.sendMessage(m.chat, {
    text: caption.trim()
  }, { quoted: m });
}

await erlic.sendMessage(m.chat, {
  audio: { url: data.url },
  mimetype: 'audio/mpeg',
  fileName: `${data.title}.mp3`
}, { quoted: titit }); 

  } catch (e) {
    console.error(e);
    m.reply(mess.error);
  }
}
break;
            
case 'snackvideo': {
  if (!text) return erlic.sendMessage(m.chat, { text: func.example(cmd, 'https://s.snackvideo.com/p/dwlMd51U') }, { quoted: m });

  await erlic.sendMessage(m.chat, { react: { text: '🕒', key: m.key } });

  try {
    const res = await fetch(`https://api.siputzx.my.id/api/d/snackvideo?url=${encodeURIComponent(text)}`);
    const json = await res.json();

    if (!json.status || !json.data?.videoUrl) return m.reply(mess.error);

    const data = json.data;
    const cap = `乂 *SNACKVIDEO DOWNLOADER*\n\n` +
                `- *Title:* ${data.title}\n` +
                `- *Creator:* ${data.creator.name || '-'}\n` +
                `- *Upload:* ${data.uploadDate || '-' }\n` +
                `- *Duration:* ${data.duration || '-'}\n` +
                `- *Views:* ${data.interaction.views.toLocaleString() || '0'}\n` +
                `- *Likes:* ${data.interaction.likes.toLocaleString() || '0'}\n` +
                `- *Shares:* ${data.interaction.shares.toLocaleString() || '0'}`;

    await erlic.sendMessage(m.chat, {
      video: { url: data.videoUrl },
      caption: cap
    }, { quoted: m });

  } catch (err) {
    console.error(err);
    m.reply(mess.error);
  }
}
break;
        
case 'ytmp3': case 'ytmp4': {
    const axios = require('axios')
  if (!text) return m.reply(func.example(cmd, 'https://youtu.be/xxxxxxx'));
  await erlic.sendMessage(m.chat, { react: { text: '🕒', key: m.key } });

  try {
    const isAudio = command === 'ytmp3';
    const apiUrl = `https://api.siputzx.my.id/api/d/${isAudio ? 'ytmp3' : 'ytmp4'}?url=${encodeURIComponent(text)}`;
    const { data } = await axios.get(apiUrl);
    if (!data?.status || !data?.data?.dl) {
      return m.reply(`Gagal mengunduh.\nAlasan: ${data?.message || 'Link tidak tersedia'}`);
    }
    const caption = `乂 *YOUTUBE DOWNLOADER ${isAudio ? 'MP3' : 'MP4'}*\n\n`
  + `◦ *Title* : ${data.data.title || '-'}\n`
  + `◦ *Format* : ${isAudio ? 'Audio (MP3)' : 'Video'}\n`;
if (isAudio) {
  let tadi = await m.reply(caption);
  await erlic.sendMessage(m.chat, {
    audio: { url: data.data.dl },
    mimetype: 'audio/mp4'
  }, { quoted: tadi });
} else {
  await erlic.sendMessage(m.chat, {
    video: { url: data.data.dl },
    caption,
    mimetype: 'video/mp4'
  }, { quoted: m });
}
 await erlic.sendMessage(m.chat, { react: { text: '✅', key: m.key } });
  } catch (e) {
    console.error(e);
    m.reply(mess.error);
  }
  break;
}
        
case 'instagram': case 'ig': {
  if (!text) return m.reply(func.example(cmd, 'https://www.instagram.com/reel/DBLzn9RvK_K/'));
  if (!text.includes('instagram.com')) return m.reply(mess.errorUrl);
  await erlic.sendMessage(m.chat, { react: { text: '🕒', key: m.key } });
  try {
    const axios = require('axios');
    const { data } = await axios.get(`https://api.siputzx.my.id/api/d/igdl?url=${encodeURIComponent(text)}`);
    if (!data.status || !Array.isArray(data.data) || data.data.length === 0) {
      return m.reply(mess.error);
    }
    for (let media of data.data) {
      await erlic.sendMessage(m.chat, {
        video: { url: media.url },
        caption: mess.ok,
      }, { quoted: m });
    }
  } catch (err) {
    console.log(err)
   m.reply(mess.error)
  }
}
break;
        
case 'instagram2': case 'ig2': {
  if (!text) return m.reply(func.example(cmd, 'https://www.instagram.com/reel/DBLzn9RvK_K/'));
  if (!text.includes('instagram.com')) return m.reply(mess.errorUrl);
  await erlic.sendMessage(m.chat, { react: { text: '🕒', key: m.key } });
  try {
    const axios = require('axios');
    const { data } = await axios.get(`https://api.siputzx.my.id/api/d/igdl?url=${encodeURIComponent(text)}`);
    if (!data.status || !Array.isArray(data.data) || data.data.length === 0) {
      return m.reply(mess.error);
    }
    for (let media of data.data) {
      await erlic.sendMessage(m.chat, {
        image: { url: media.thumbnail },
        caption: mess.ok,
      }, { quoted: m });
    }
  } catch (err) {
    console.error(err);
    m.reply(mess.error);
  }
}
break;
        
case 'mediafire': {
    const axios = require('axios')
  if (!text || !text.includes('mediafire.com')) {
    return m.reply(func.example(cmd, 'https://www.mediafire.com/file/xxxx'));
  }
  try {
    await erlic.sendMessage(m.chat, { react: { text: '🕒', key: m.key } });
    const res = await axios.get(`https://api.siputzx.my.id/api/d/mediafire?url=${encodeURIComponent(text)}`);
    const data = res.data?.data;
    if (!data || !data.downloadLink || !data.fileName) {
      return m.reply('Gagal mengambil data dari Mediafire.');
    }
    const caption = `乂  *MEDIAFIRE DOWNLOADER*\n`
      + `\n◦ File Name: ${data.fileName}`
      + `\n◦ File Size: ${data.fileSize || '-'}`
      + `\n◦ File Type: ${data.fileType || '-'}`
      + `\n\n_Please wait, file is being sent..._`;
    const mediapayer = await m.reply(caption);
    await erlic.sendMessage(m.chat, {
      document: { url: data.downloadLink },
      fileName: data.fileName,
      mimetype: data.mimeType || 'application/octet-stream'
    }, { quoted: mediapayer });
  } catch (e) {
    console.error(e);
    m.reply(mess.error);
  }

  break;
}

case 'ping':
case 'botstatus':
case 'statusbot': {
    function runtime(seconds) {
  seconds = Number(seconds);
  const d = Math.floor(seconds / (3600 * 24));
  const h = Math.floor((seconds % (3600 * 24)) / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = Math.floor(seconds % 60);
  return [
    d > 0 ? `${d} hari` : '',
    h > 0 ? `${h} jam` : '',
    m > 0 ? `${m} menit` : '',
    s > 0 ? `${s} detik` : '',
  ].filter(Boolean).join(' ');
}
    function formatp(bytes) {
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  if (bytes === 0) return '0 Byte';
  const i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)));
  return `${(bytes / Math.pow(1024, i)).toFixed(2)} ${sizes[i]}`;
}
    const { performance } = require('perf_hooks')
    const used = process.memoryUsage();
    const cpus = os.cpus().map(cpu => {
        cpu.total = Object.keys(cpu.times).reduce((last, type) => last + cpu.times[type], 0);
        return cpu;
    });
    const cpu = cpus.reduce((last, cpu, _, { length }) => {
        last.total += cpu.total;
        last.speed += cpu.speed / length;
        last.times.user += cpu.times.user;
        last.times.nice += cpu.times.nice;
        last.times.sys += cpu.times.sys;
        last.times.idle += cpu.times.idle;
        last.times.irq += cpu.times.irq;
        return last;
    }, {
        speed: 0,
        total: 0,
        times: {
            user: 0,
            nice: 0,
            sys: 0,
            idle: 0,
            irq: 0
        }
    });

    let timestamp = performance.now();
    let latensi = performance.now() - timestamp;
    let neww = performance.now();
    let oldd = performance.now();

    respon = `
Response Speed ${latensi.toFixed(4)} _Second_ \n ${oldd - neww} _miliseconds_\n\nRuntime : ${runtime(process.uptime())}

Info Server
RAM: ${formatp(os.totalmem() - os.freemem())} / ${formatp(os.totalmem())}

_NodeJS Memory Usage_
${Object.keys(used).map((key, _, arr) => `${key.padEnd(Math.max(...arr.map(v=>v.length)),' ')}: ${formatp(used[key])}`).join('\n')}

${cpus[0] ? `_Total CPU Usage_
${cpus[0].model.trim()} (${cpu.speed} MHZ)\n${Object.keys(cpu.times).map(type => `- *${(type + '*').padEnd(6)}: ${(100 * cpu.times[type] / cpu.total).toFixed(2)}%`).join('\n')}
_CPU Core(s) Usage (${cpus.length} Core CPU)_
${cpus.map((cpu, i) => `${i + 1}. ${cpu.model.trim()} (${cpu.speed} MHZ)\n${Object.keys(cpu.times).map(type => `- *${(type + '*').padEnd(6)}: ${(100 * cpu.times[type] / cpu.total).toFixed(2)}%`).join('\n')}`).join('\n\n')}` : ''}
    `.trim();

    m.reply(respon);
}
break
        
case 'runtime': { let test = `Quick Test Done! ${pushname}\nRuntime: ${func.runtime(process.uptime())}`; const txt = await erlic.sendMessage(m.chat, {text: 'Waiting for command'}, {quoted: fkon, ephemeralExpiration: m.expiration}); const arr = [{text: "《█▒▒▒▒▒▒▒▒▒▒▒▒▒》10%", timeout: 100}, {text: "《███▒▒▒▒▒▒▒▒▒▒▒》20%", timeout: 100}, {text: "《████▒▒▒▒▒▒▒▒▒▒》30%", timeout: 100}, {text: "《██████▒▒▒▒▒▒▒▒》40%", timeout: 100}, {text: "《████████▒▒▒▒▒▒》50%", timeout: 100}, {text: "《█████████▒▒▒▒▒》60%", timeout: 100}, {text: "《███████████▒▒▒》70%", timeout: 100}, {text: "《████████████▒▒》80%", timeout: 100}, {text: "《█████████████▒》90%", timeout: 100}, {text: "《██████████████》100%", timeout: 100}, {text: "ᴄᴏᴍᴘʟᴇᴛᴇ", timeout: 100}, {text: test, timeout: 100}]; for (let i = 0; i < arr.length; i++) { await new Promise(resolve => setTimeout(resolve, arr[i].timeout)); await erlic.relayMessage(m.chat, {protocolMessage: {key: txt.key, type: 14, editedMessage: {conversation: arr[i].text}}}, {quoted: fkon, ephemeralExpiration: m.expiration}); } } break;
        
case "reactch":
case "rch": {
    
    if (!text) return m.reply("Contoh:\n.reactch https://whatsapp.com/channel/xxx/123 ❤️erlic\n.reactch https://whatsapp.com/channel/xxx/123 ❤️erlic|5");
    
    const hurufGaya = {
        a: '🅐', b: '🅑', c: '🅒', d: '🅓', e: '🅔', f: '🅕', g: '🅖',
        h: '🅗', i: '🅘', j: '🅙', k: '🅚', l: '🅛', m: '🅜', n: '🅝',
        o: '🅞', p: '🅟', q: '🅠', r: '🅡', s: '🅢', t: '🅣', u: '🅤',
        v: '🅥', w: '🅦', x: '🅧', y: '🅨', z: '🅩',
        '0': '⓿', '1': '➊', '2': '➋', '3': '➌', '4': '➍',
        '5': '➎', '6': '➏', '7': '➐', '8': '➑', '9': '➒'
    };
    
    const [mainText, offsetStr] = text.split('|');
    const args = mainText.trim().split(" ");
    const link = args[0];
    
    if (!link.includes("https://whatsapp.com/channel/")) {
        return m.reply("Link tidak valid!\nContoh: .reactch https://whatsapp.com/channel/xxx/idpesan ❤️erlic|3");
    }
    
    const channelId = link.split('/')[4];
    const rawMessageId = parseInt(link.split('/')[5]);
    if (!channelId || isNaN(rawMessageId)) return m.reply("Link tidak lengkap!");
    const offset = parseInt(offsetStr?.trim()) || 1;
    const teksNormal = args.slice(1).join(' ');
    const teksTanpaLink = teksNormal.replace(link, '').trim();
    if (!teksTanpaLink) return m.reply("Masukkan teks/emoji untuk direaksikan.");
    const emoji = teksTanpaLink.toLowerCase().split('').map(c => {
        if (c === ' ') return '―';
        return hurufGaya[c] || c;
    }).join('');
    
    try {
        const metadata = await erlic.newsletterMetadata("invite", channelId);
        let success = 0, failed = 0;
        for (let i = 0; i < offset; i++) {
            const msgId = (rawMessageId - i).toString();
            try {
                await erlic.newsletterReactMessage(metadata.id, msgId, emoji);
                success++;
            } catch (e) {
                failed++;
            }
        }
        m.reply(`✅ Berhasil kirim reaction *${emoji}* ke ${success} pesan di channel *${metadata.name}*\n❌ Gagal di ${failed} pesan`);
    } catch (err) {
        console.error(err);
        m.reply("❌ Gagal memproses permintaan!");
    }
}
break
        
case "idgc":
case "cekidgc": {
    let idgc
    const regex = /chat\.whatsapp\.com\/([0-9A-Za-z]+)/i
    let code = q.match(regex)?.[1]
    if (code) {
        try {
            let res = await conn.groupGetInviteInfo(code)
            idgc = res.id
        } catch (e) {
            return Reply("Gagal ambil ID dari link. Link-nya valid nggak? Atau bot diblokir dari grup itu?")
        }
    } else {
        idgc = m.chat
    }
    m.reply(`${idgc}`)
}
break
 //==== CPANEL BY JONATHAN ====//
case "1gb": case "2gb": case "3gb": case "4gb": case "5gb": case "6gb": case "7gb": case "8gb": case "9gb": case "10gb": case "unli": {const path=require('path');const moment=require('moment');const fs=require('fs');const axios=require('axios');let ram,disk,cpu;switch(command){case"1gb":ram="1024";disk="1024";cpu="30";break;case"2gb":ram="2024";disk="2024";cpu="50";break;case"3gb":ram="3024";disk="3024";cpu="75";break;case"4gb":ram="4024";disk="4024";cpu="100";break;case"5gb":ram="5024";disk="5024";cpu="125";break;case"6gb":ram="6024";disk="6024";cpu="150";break;case"7gb":ram="7024";disk="7024";cpu="175";break;case"8gb":ram="8024";disk="8024";cpu="200";break;case"9gb":ram="9024";disk="9024";cpu="225";break;case"10gb":ram="10024";disk="10024";cpu="250";break;default:ram="0";disk="0";cpu="0";}if(!m.isPrem&&!isPrem&&!isCreator)return m.reply(mess.premium);let t=text.split(',');if(t.length<2)return erlic.sendMessage(m.chat,{text:`Contoh: ${prefix+command} username,nomor`},{quoted:m});let username=t[0];let u;if(m.quoted&&m.quoted.sender){u=m.quoted.sender;}else if(t[1]){u=t[1].replace(/[^0-9]/g,'')+'@s.whatsapp.net';}else if(m.mentionedJid&&m.mentionedJid[0]){u=m.mentionedJid[0];}else{return m.reply("Nomor target tidak ditemukan.");}let email=`${username}@erlic.id`;let randomChars="abcdefghijklmnopqrstuvwxyz1234567890";let ulycode=`masthan-`;for(let i=0;i<5;i++){ulycode+=randomChars.charAt(Math.floor(Math.random()*randomChars.length));}let password=ulycode;try{let createUserRes=await axios.post(`${domain}/api/application/users`,{email,username,first_name:username,last_name:username,language:"en",password},{headers:{"Accept":"application/json","Content-Type":"application/json","Authorization":`Bearer ${apikey}`}});let user=createUserRes.data.attributes;let getEggRes=await axios.get(`${domain}/api/application/nests/5/eggs/${global.egg}`,{headers:{"Accept":"application/json","Content-Type":"application/json","Authorization":`Bearer ${apikey}`}});let startup_cmd=getEggRes.data.attributes.startup;let createServerRes=await axios.post(`${domain}/api/application/servers`,{name:username,description:"",user:user.id,egg:parseInt(global.egg),docker_image:"ghcr.io/parkervcp/yolks:nodejs_18",startup:startup_cmd,environment:{"INST":"npm","USER_UPLOAD":"0","AUTO_UPDATE":"0","CMD_RUN":"npm start"},limits:{memory:ram,swap:0,disk:disk,io:500,cpu:cpu},feature_limits:{databases:5,backups:5,allocations:1},deploy:{locations:[parseInt(global.loc)],dedicated_ip:false,port_range:[]}},{headers:{"Accept":"application/json","Content-Type":"application/json","Authorization":`Bearer ${apikey}`}});let server=createServerRes.data.attributes;let maskedPassword=password.slice(0,5)+'****';let expiredDate=moment().add(1,'months').format('YYYY-MM-DD');let panelFile=path.join(__dirname,'./database/panel.json');let panelData=[];if(fs.existsSync(panelFile)){let rawData=fs.readFileSync(panelFile);panelData=JSON.parse(rawData);}panelData.push({jid:u,server:{id:server.id,username:username,password:maskedPassword,ram,cpu,disk,expire:expiredDate}});fs.writeFileSync(panelFile,JSON.stringify(panelData,null,2));let ctf=`Hai @${u.split('@')[0]}, berikut adalah data panel kamu\n\n- Username : ${user.username}\n- Password : ${password}\n- Login : ${domain}\n- Expire : ${expiredDate}\n\n_Ketik ${pripek}cekpanel untuk melihat daftar server kamu._`;await erlic.sendMessage(u,{text:ctf,contextInfo:{mentionedJid:[m.sender,u]}},{quoted:func.fstatus('Panel notification')});m.reply(`SUCCESSFULLY ADD USER + SERVER*\nTYPE: user\nID: ${user.id}\nNAME: ${user.first_name} ${user.last_name}\nMEMORY: ${server.limits.memory} MB\nDISK: ${server.limits.disk} MB\nCPU: ${server.limits.cpu}%\nEXPIRE: ${expiredDate}`);}catch(err){if(err.response&&err.response.data&&err.response.data.errors){let detail=err.response.data.errors.map(e=>`- ${e.detail||e.code||JSON.stringify(e)}`).join('\n');console.log("ERROR DETAILS:",err.response.data);return m.reply(`Terjadi kesalahan saat membuat user/server:\n${detail}`);}else{console.error(err);return m.reply(mess.error);}}}break;

case 'readmore': case 'rm': {
  if (!text.includes('|')) return m.reply('Gunakan tanda "|" untuk memisahkan bagian teks dengan efek readmore.\nContoh: .readmore aku | suka | kamu ❤️')
  const more = String.fromCharCode(8206).repeat(4001)
  const teks = text.split('|').join(more)
  m.reply(teks)
}
  break
        
 case 'cekpanel': { const fs=require('fs'); const path=require('path'); const panelFile=path.join(__dirname,'./database/panel.json'); if(!fs.existsSync(panelFile)) return m.reply('Belum ada data panel.'); const rawData=fs.readFileSync(panelFile); const panelData=JSON.parse(rawData); const userPanels=panelData.filter(item=>item.jid===m.sender); if(userPanels.length<1) return m.reply('Your server is empty.'); function calculateExpireTime(expiredTimestamp){const now=Date.now();const diff=expiredTimestamp-now;const seconds=Math.floor((diff/1000)%60);const minutes=Math.floor((diff/(1000*60))%60);const hours=Math.floor((diff/(1000*60*60))%24);const days=Math.floor(diff/(1000*60*60*24)); return diff>0?`${days}D ${hours}H ${minutes}M ${seconds}S`:'Expired';} let caption='乂  *C H E C K - P A N E L*\n\n'; caption+=`◦  *Jid* : @${m.sender.replace(/@.+/,'')}\n`; caption+=`◦  *Total Server* : ${userPanels.length}\n`; caption+=`*Server* :\n`; caption+=userPanels.map((item,index)=>{const s=item.server; const ramDisplay=(Number(s.ram)===0)?'∞':`${s.ram}GB`; const expireTime=calculateExpireTime(new Date(s.expire).getTime()); return `${index+1}. ${s.username}\n- ID: ${s.id}\n- RAM: ${ramDisplay}\n- Expire: ${expireTime}`;}).join('\n\n'); erlic.sendMessage(m.chat,{text:caption,mentions:[m.sender]},{quoted:m}); } break;
        
case 'kalender':
case 'calendar': {
    const { createCanvas, loadImage } = require('canvas');
const moment = require('moment-timezone');
const axios = require('axios');
    
    const timezone = 'Asia/Jakarta';
    const currentDate = moment.tz(timezone);
    const currentMonth = currentDate.month();
    const currentYear = currentDate.year();

    const canvasWidth = 1600;
    const canvasHeight = 1600; 

    const months = [
        'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
        'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
    ];
    await erlic.sendMessage(m.chat, { react: { text: '🕒', key: m.key } });
    let queryMonth = months.findIndex(month => text && month.toLowerCase() === text.toLowerCase());
    if (queryMonth === -1) queryMonth = currentMonth;

    const displayDate = moment.tz(timezone).month(queryMonth).startOf('month');
    const monthName = months[queryMonth];
    const year = currentYear;

    const canvas = createCanvas(canvasWidth, canvasHeight);
    const ctx = canvas.getContext('2d');

    
    const imageUrl = global.thumb || 'https://files.catbox.moe/bi9vkp.jpg';

    try {
        const response = await axios.get(imageUrl, { responseType: 'arraybuffer' });
        const imageBuffer = Buffer.from(response.data, 'binary');
        const bgImage = await loadImage(imageBuffer);

        
        const cropSize = Math.min(bgImage.width, bgImage.height);

        
        ctx.globalAlpha = 0.5;
        ctx.drawImage(bgImage, (bgImage.width - cropSize) / 2, (bgImage.height - cropSize) / 2, cropSize, cropSize, 0, 0, canvasWidth, canvasHeight);
        ctx.globalAlpha = 1;
    } catch (error) {
        console.error('Gagal memuat gambar latar belakang:', error);
        ctx.fillStyle = '#1e1e1e';
        ctx.fillRect(0, 0, canvasWidth, canvasHeight);
    }

    const theme = { text: '#ffffff', grid: '#cccccc', accent: '#007bff' };

    ctx.fillStyle = theme.text;
    ctx.font = 'bold 80px Arial';
    ctx.textAlign = 'center';
    ctx.fillText(`${monthName} ${year}`, canvasWidth / 2, 100);

    ctx.strokeStyle = theme.grid;
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(100, 120);
    ctx.lineTo(canvasWidth - 100, 120);
    ctx.stroke();

    const dayNames = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
    const cellWidth = canvasWidth / 7;
    const cellHeight = (canvasHeight - 200) / 8;
    ctx.font = 'bold 50px Arial';

    dayNames.forEach((day, i) => {
        ctx.fillStyle = i === 0 ? 'red' : theme.text;
        ctx.fillText(day, cellWidth * i + cellWidth / 2, 180);
    });

    const pasaran = ['Legi', 'Pahing', 'Pon', 'Wage', 'Kliwon'];
    const startDay = displayDate.day();
    const totalDays = displayDate.daysInMonth();
    const pasaranOffset = moment('1900-01-01').diff(displayDate, 'days') % 5;

    let x = startDay;
    let y = 1;

    for (let day = 1; day <= totalDays; day++) {
        const posX = cellWidth * x + cellWidth / 2;
        const posY = 200 + cellHeight * y + 60;

        ctx.fillStyle = theme.text;
        ctx.font = 'bold 45px Arial';
        ctx.fillText(day, posX, posY - 10);

        const pasaranName = pasaran[(day + pasaranOffset) % 5];
        ctx.fillStyle = theme.text;
        ctx.font = 'italic 30px Arial';
        ctx.fillText(pasaranName, posX, posY + 35);

        x++;
        if (x > 6) {
            x = 0;
            y++;
        }
    }

    ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
    ctx.font = 'bold 40px Arial';
    ctx.textAlign = 'right';
    ctx.fillText(`Copyright © 2025 ${global.botname}`, canvasWidth - 50, canvasHeight - 50);

    const buffer = canvas.toBuffer();

    await erlic.sendMessage(m.chat, {
        image: buffer,
        caption: `*- Kalender :* ${monthName} ${year}`
    }, { quoted: m });
    break;
}
        
case 'asupan-bocil': case 'asupan-gheayubi': case 'asupan-hijaber': case 'asupan-rikagusriani': case 'asupan-santuy': case 'asupan-ukhti': case 'asupan-tiktok': { if (!m.isPrem && !isCreator) return m.reply(mess.premium); let asupanUrl; if (/asupan-bocil/.test(command)) asupanUrl = 'asupan-bocil'; if (/asupan-gheayubi/.test(command)) asupanUrl = 'asupan-gheayubi'; if (/asupan-hijaber/.test(command)) asupanUrl = 'asupan-hijaber'; if (/asupan-rikagusriani/.test(command)) asupanUrl = 'asupan-rikagusriani'; if (/asupan-santuy/.test(command)) asupanUrl = 'asupan-santuy'; if (/asupan-ukhti/.test(command)) asupanUrl = 'asupan-ukhti'; if (/asupan-tiktok/.test(command)) asupanUrl = 'asupan-tiktok'; await erlic.sendMessage(m.chat, { react: { text: '🕒', key: m.key } }); let asupan = await fetch(`https://raw.githubusercontent.com/Jabalsurya2105/database/master/asupan/${asupanUrl}.json`).then(response => response.json()); let result = asupan[Math.floor(Math.random() * asupan.length)]; erlic.sendMessage(m.chat, { video: { url: result }, caption: mess.ok }, { quoted: m }); } break;
        
case 'waifu': case 'megumin': case 'shinobu': case 'awoo': case 'neko': case 'bully': case 'cuddle': case 'hug': case 'cry': case 'kiss': case 'lick': case 'pat': case 'bonk': case 'yeet': case 'trap': { let wibu; if (/waifu/.test(command)) wibu = 'https://waifu.pics/api/sfw/waifu'; if (/neko/.test(command)) wibu = 'https://waifu.pics/api/sfw/neko'; if (/awoo/.test(command)) wibu = 'https://waifu.pics/api/sfw/awoo'; if (/megumin/.test(command)) wibu = 'https://waifu.pics/api/sfw/megumin'; if (/shinobu/.test(command)) wibu = 'https://waifu.pics/api/sfw/shinobu'; if (/bully/.test(command)) wibu = 'https://waifu.pics/api/sfw/bully'; if (/cuddle/.test(command)) wibu = 'https://waifu.pics/api/sfw/cuddle'; if (/hug/.test(command)) wibu = 'https://waifu.pics/api/sfw/hug'; if (/cry/.test(command)) wibu = 'https://waifu.pics/api/sfw/cry'; if (/kiss/.test(command)) wibu = 'https://waifu.pics/api/sfw/kiss'; if (/lick/.test(command)) wibu = 'https://waifu.pics/api/sfw/lick'; if (/pat/.test(command)) wibu = 'https://waifu.pics/api/sfw/pat'; if (/bonk/.test(command)) wibu = 'https://waifu.pics/api/sfw/bonk'; if (/yeet/.test(command)) wibu = 'https://waifu.pics/api/sfw/yeet'; if (/trap/.test(command)) wibu = 'https://api.waifu.pics/nsfw/trap'; let result = await func.fetchJson(wibu); erlic.sendMessage(m.chat, { image: { url: result.url }, caption: mess.ok }, { quoted: m }); } break;
        
case 'meme': { if (!text) return m.reply(func.example(cmd, 'jomox')); let status = true; while (status) { try { let query = encodeURIComponent(text); let page = Math.floor(Math.random() * 10); let response = await fetch(`https://lahelu.com/api/post/get-search?query=${query}&page=${page}`); if (!response.ok) return m.reply('Error fetching data. Please try again later.'); let data = await response.json(); if (!data || data.postInfos.length < 1) return m.reply('Empty data. Trying again...'); let random = Math.floor(Math.random() * data.postInfos.length); let result = data.postInfos[random]; let video = result.media; let message = `- *Title:* ${result.title}\n- *Total Comments:* ${result.totalComments}\n- *Create Time:* ${new Date(result.createTime).toLocaleString()}\n- *User Username:* ${result.userUsername}`; await erlic.sendMessage(m.chat, { react: { text: '🕒', key: m.key } }); await erlic.sendMessage(m.chat, { video: { url: video }, caption: message }, { quoted: m }); status = false; } catch (e) { console.error(e); } } } break;
        
case 'bucin': {
    try {
        const axios = require('axios');
        let res = await axios.get(global.bucin);
        let bucin = res.data;
        if (Array.isArray(bucin) && bucin.length > 0) {
            let result = bucin[Math.floor(Math.random() * bucin.length)];
            m.reply(monospace(`${result}`));
        } else {
            m.reply(mess.error);
        }
    } catch (e) {
        console.error(e);
        m.reply(mess.error);
    }
    break;
}
        
 case 'gombalan': {
    try {
        const axios = require('axios');
        let res = await axios.get(global.gombalan);
        let gombalan = res.data;
        if (Array.isArray(gombalan) && gombalan.length > 0) {
            let result = gombalan[Math.floor(Math.random() * gombalan.length)];
            m.reply(monospace(`${result}`));
        } else {
            m.reply(mess.error);
        }
    } catch (e) {
        console.error(e);
        m.reply(mess.error);
    }
    break;
}
        
case 'motivasi': {
    try {
        const axios = require('axios');
        let res = await axios.get(global.motivasi);
        let motivasi = res.data;
        if (Array.isArray(motivasi) && motivasi.length > 0) {
            let txt = motivasi[Math.floor(Math.random() * motivasi.length)];
            m.reply(monospace(`${txt}`));
        } else {
            m.reply(mess.error);
        }
    } catch (e) {
        console.error(e);
        m.reply(mess.error);
    }
    break;
}
        
 case 'quotes': {
    try {
        const axios = require('axios');
        let res = await axios.get(global.quotes);
        let quotes = res.data;
        if (Array.isArray(quotes) && quotes.length > 0) {
            let result = quotes[Math.floor(Math.random() * quotes.length)];
            let caption = `${result.quotes}\n\n_${result.author}_`;
            m.reply(caption);
        } else {
            m.reply(mess.error);
        }
    } catch (e) {
        console.error(e);
        m.reply(mess.error);
    }
    break;
}
        
case 'renungan': {
    try {
        const axios = require('axios');
        let res = await axios.get(global.renungan);
        let renungan = res.data;
        if (Array.isArray(renungan) && renungan.length > 0) {
            let result = renungan[Math.floor(Math.random() * renungan.length)];
            await erlic.sendMessage(m.chat, {
                image: { url: result },
                caption: `Renungan hari ini`
            }, { quoted: m });
        } else {
            m.reply(mess.error);
        }
    } catch (e) {
        console.error(e);
        m.reply(mess.error);
    }
    break;
}
        
 case 'cekkodam': case 'cekkhodam': {
    const axios = require('axios');
    let text = args.join(" ");
    if (!text) return m.reply(`Contohnya: ${prefix + command} ${global.botname}`);

    const khodamsRes = await axios.get(global.kodam);
    const khodams = khodamsRes.data;
    const khodam = khodams[Math.floor(Math.random() * khodams.length)];

    async function tiktokTts(text) {
        try {
            const { data } = await axios('https://tiktok-tts.weilnet.workers.dev/api/generation', {
                method: 'POST',
                data: {
                    text: text,
                    voice: 'id_001'
                },
                headers: {
                    "content-type": "application/json",
                },
            });
            return {
                status: true,
                developer: 'NathanDevDimasDev',
                base64: Buffer.from(data.data, 'base64')
            };
        } catch (err) {
            console.log(err?.response?.data || err);
            return {
                status: false,
                developer: 'NathanDevDimasDev',
                msg: String(err)
            };
        }
    }

    let wait = await erlic.sendMessage(m.chat, {
        text: 'Checking Khodam...'
    }, { quoted: m, ephemeralExpiration: m.expiration });

    let result = await tiktokTts(`Khodam ${text} adalah ${khodam.name} yang memiliki arti ${khodam.meaning}`);
    if (!result.status) return m.reply(result.msg);

    await erlic.sendMessage(m.chat, {
        audio: result.base64,
        mimetype: 'audio/mp4',
        ptt: true
    }, { quoted: wait, ephemeralExpiration: m.expiration });

    setTimeout(function () {
        let txt = `乂  C E K - K H O D A M

◦ Nama: ${text}
◦ Khodam: ${khodam.name}
◦ Arti: ${khodam.meaning}`;

        erlic.sendMessage(m.chat, {
            text: txt,
            edit: wait.key,
            mentions: erlic.ments ? erlic.ments(txt) : []
        }, { quoted: m, ephemeralExpiration: m.expiration });
    }, 1000);
    break;
}
        
  case 'kodebahasa': {
    let kodebahasa = `乂  *KODE - BAHASA*

◦  af: Afrikaans
◦  sq: Albanian
◦  ar: Arabic
◦  hy: Armenian
◦  ca: Catalan
◦  zh: Chinese
◦  zh-cn: Chinese (Mandarin/China)
◦  zh-tw: Chinese (Mandarin/Taiwan)
◦  zh-yue: Chinese (Cantonese)
◦  hr: Croatian
◦  cs: Czech
◦  da: Danish
◦  nl: Dutch
◦  en: English
◦  en-au: English (Australia)
◦  en-uk: English (United Kingdom)
◦  en-us: English (United States)
◦  eo: Esperanto
◦  fi: Finnish
◦  fr: French
◦  de: German
◦  el: Greek
◦  ht: Haitian Creole
◦  hi: Hindi
◦  hu: Hungarian
◦  is: Icelandic
◦  id: Indonesian
◦  it: Italian
◦  ja: Japanese
◦  ko: Korean
◦  la: Latin
◦  lv: Latvian
◦  mk: Macedonian
◦  no: Norwegian
◦  pl: Polish
◦  pt: Portuguese
◦  pt-br: Portuguese (Brazil)
◦  ro: Romanian
◦  ru: Russian
◦  sr: Serbian
◦  sk: Slovak
◦  es: Spanish 
◦  es-es: Spanish (Spain)
◦  es-us: Spanish (United States)
◦  sw: Swahili
◦  sv: Swedish
◦  ta: Tamil
◦  th: Thai
◦  tr: Turkish
◦  vi: Vietnamese 
◦  cy: Welsh`;

    erlic.sendMessage(m.chat, { text: kodebahasa }, { quoted: qtext });
    break;
}

case 'sound1': case 'sound2': case 'sound3': case 'sound4': case 'sound5':
  case 'sound6': case 'sound7': case 'sound8': case 'sound9': case 'sound10':
  case 'sound11': case 'sound12': case 'sound13': case 'sound14': case 'sound15':
  case 'sound16': case 'sound17': case 'sound18': case 'sound19': case 'sound20':
  case 'sound21': case 'sound22': case 'sound23': case 'sound24': case 'sound25':
  case 'sound26': case 'sound27': case 'sound28': case 'sound29': case 'sound30':
  case 'sound31': case 'sound32': case 'sound33': case 'sound34': case 'sound35':
  case 'sound36': case 'sound37': case 'sound38': case 'sound39': case 'sound40':
  case 'sound41': case 'sound42': case 'sound43': case 'sound44': case 'sound45':
  case 'sound46': case 'sound47': case 'sound48': case 'sound49': case 'sound50':
  case 'sound51': case 'sound52': case 'sound53': case 'sound54': case 'sound55':
  case 'sound56': case 'sound57': case 'sound58': case 'sound59': case 'sound60':
  case 'sound61': case 'sound62': case 'sound63': case 'sound64': case 'sound65':
  case 'sound66': case 'sound67': case 'sound68': case 'sound69': case 'sound70':
  case 'sound71': case 'sound72': case 'sound73': case 'sound74': case 'sound75':
  case 'sound76': case 'sound77': case 'sound78': case 'sound79': case 'sound80':
  case 'sound81': case 'sound82': case 'sound83': case 'sound84': case 'sound85':
  case 'sound86': case 'sound87': case 'sound88': case 'sound89': case 'sound90':
  case 'sound91': case 'sound92': case 'sound93': case 'sound94': case 'sound95':
  case 'sound96': case 'sound97': case 'sound98': case 'sound99': case 'sound100':
  case 'sound101': case 'sound102': case 'sound103': case 'sound104': case 'sound105':
  case 'sound106': case 'sound107': case 'sound108': case 'sound109': case 'sound110':
  case 'sound111': case 'sound112': case 'sound113': case 'sound114': case 'sound115':
  case 'sound116': case 'sound117': case 'sound118': case 'sound119': case 'sound120':
  case 'sound121': case 'sound122': case 'sound123': case 'sound124': case 'sound125':
  case 'sound126': case 'sound127': case 'sound128': case 'sound129': case 'sound130':
  case 'sound131': case 'sound132': case 'sound133': case 'sound134': case 'sound135':
  case 'sound136': case 'sound137': case 'sound138': case 'sound139': case 'sound140':
  case 'sound141': case 'sound142': case 'sound143': case 'sound144': case 'sound145':
  case 'sound146': case 'sound147': case 'sound148': case 'sound149': case 'sound150':
  case 'sound151': case 'sound152': case 'sound153': case 'sound154': case 'sound155':
  case 'sound156': case 'sound157': case 'sound158': case 'sound159': case 'sound160':
  case 'sound161': case 'sound162': case 'sound163': case 'sound164': case 'sound165':
  case 'sound166': case 'sound167': case 'sound168': case 'sound169': case 'sound170':
  case 'sound171': case 'sound172': case 'sound173': case 'sound174': case 'sound175':
  case 'sound176': case 'sound177': case 'sound178': case 'sound179': case 'sound180': {
      await erlic.sendMessage(m.chat, { react: { text: '🕒', key: m.key } });
    let audioUrl = `${global.soundUrl}${command}.mp3`;
    await erlic.sendMessage(m.chat, {
      audio: { url: audioUrl },
      mimetype: 'audio/mp4',
      ptt: true
    }, { quoted: m });
      }
    break;
        
case 'mangkane1': case 'mangkane2': case 'mangkane3': case 'mangkane4': case 'mangkane5':
  case 'mangkane6': case 'mangkane7': case 'mangkane8': case 'mangkane9': case 'mangkane10':
  case 'mangkane11': case 'mangkane12': case 'mangkane13': case 'mangkane14': case 'mangkane15':
  case 'mangkane16': case 'mangkane17': case 'mangkane18': case 'mangkane19': case 'mangkane20':
  case 'mangkane21': case 'mangkane22': case 'mangkane23': case 'mangkane24': case 'mangkane25':
  case 'mangkane26': case 'mangkane27': case 'mangkane28': case 'mangkane29': case 'mangkane30':
  case 'mangkane31': case 'mangkane32': case 'mangkane33': case 'mangkane34': case 'mangkane35':
  case 'mangkane36': case 'mangkane37': case 'mangkane38': case 'mangkane39': case 'mangkane40':
  case 'mangkane41': case 'mangkane42': case 'mangkane43': case 'mangkane44': case 'mangkane45':
  case 'mangkane46': case 'mangkane47': case 'mangkane48': case 'mangkane49': case 'mangkane50':
  case 'mangkane51': case 'mangkane52': case 'mangkane53': case 'mangkane54': {
      await erlic.sendMessage(m.chat, { react: { text: '🕒', key: m.key } });
    let audioUrl = `${global.mangkaneUrl}${command}.mp3`;
    await erlic.sendMessage(m.chat, {
      audio: { url: audioUrl },
      mimetype: 'audio/mp4',
      ptt: true
    }, { quoted: m });
      }
    break;
  
  case 'acumalaka': case 'reza-kecap': case 'farhan-kebab':
  case 'omaga': case 'kamu-nanya': case 'anjay': case 'siuu': {
      await erlic.sendMessage(m.chat, { react: { text: '🕒', key: m.key } });
    let audioUrl = `${global.audioUrl}${command}.mp3`;
    await erlic.sendMessage(m.chat, {
      audio: { url: audioUrl },
      mimetype: 'audio/mp4',
      ptt: true
    }, { quoted: m });
      }
    break;
        
case 'desah': {
    erlic.sendMessage(m.chat, {
    audio: { url: 'https://cdn.filestackcontent.com/C9cmOVyTSxSaYYiRjbYz' },
    mimetype: 'audio/mpeg',
    ptt: true
  }, { quoted: m });
 }
 break
        
case 'bass': case 'blown': case 'deep': case 'earrape': case 'fast': case 'fat': case 'nightcore': case 'reverse': case 'robot': case 'slow': case 'smooth': case 'tupai': {
const quoted = m.quoted ? m.quoted : m;
const fs = require('fs'), { exec } = require('child_process'), path = require('path');
let set;
if (/bass/.test(command)) set = '-af equalizer=f=54:width_type=o:width=2:g=20';
else if (/blown/.test(command)) set = '-af acrusher=.1:1:64:0:log';
else if (/deep/.test(command)) set = '-af atempo=4/4,asetrate=44500*2/3';
else if (/earrape/.test(command)) set = '-af volume=12';
else if (/fast/.test(command)) set = '-filter:a "atempo=1.63,asetrate=44100"';
else if (/fat/.test(command)) set = '-filter:a "atempo=1.6,asetrate=22100"';
else if (/nightcore/.test(command)) set = '-filter:a atempo=1.06,asetrate=44100*1.25';
else if (/reverse/.test(command)) set = '-filter_complex "areverse"';
else if (/robot/.test(command)) set = '-filter_complex "afftfilt=real=\'hypot(re,im)*sin(0)\':imag=\'hypot(re,im)*cos(0)\':win_size=512:overlap=0.75"';
else if (/slow/.test(command)) set = '-filter:a "atempo=0.7,asetrate=44100"';
else if (/smooth/.test(command)) set = '-filter:v "minterpolate=\'mi_mode=mci:mc_mode=aobmc:vsbmc=1:fps=120\'"';
else if (/tupai/.test(command)) set = '-filter:a "atempo=0.5,asetrate=65100"';
if (/audio/.test(quoted?.mimetype || quoted?.mediaType || '')) {
  m.reply(global.mess.wait);
  let bufferInput = await erlic.downloadMediaMessage(quoted);
  let input = path.join(process.cwd(), 'sampah', func.filename('input.mp3'));
  let output = path.join(process.cwd(), 'sampah', func.filename('output.mp3'));
  fs.writeFileSync(input, bufferInput);
  exec(`ffmpeg -i ${input} ${set} ${output}`, (err) => {
    fs.unlinkSync(input);
    if (err) return m.reply(func.jsonFormat(err));
    let bufferOutput = fs.readFileSync(output);
    erlic.sendMessage(m.chat, { audio: bufferOutput, mimetype: 'audio/mpeg', ptt: m.quoted.ptt ? true : false }, { quoted: m, ephemeralExpiration: m.expiration }).then(() => fs.unlinkSync(output));
  });
} else m.reply(`Balas audio yang ingin diubah dengan caption *${pripek + command}*`);
} break;

case 'wangy': {
  if (!text) return erlic.sendMessage(m.chat, { text: `Masukkan nama seseorang!\n\nContoh: ${prefix}wangy Alya` }, { quoted: qtext })

  let target = text.trim()
  let teks = `${target}, ${target}, ${target}
❤️ ❤️ ❤️ WANGY WANGY WANGY WANGY HU HA HU HA HU HA, aaaah baunya rambut ${target} wangyy aku mau nyiumin aroma wangynya ${target} AAAAAAAAH ~ Rambutnya.... aaah rambutnya juga pengen aku elus-elus ~~ AAAAAH ${target} keluar pertama kali di anime juga manis ❤️ ❤️ ❤️ banget AAAAAAAAH ${target} AAAAA LUCCUUUUUUUUUUUUUUU............ ${target} AAAAAAAAAAAAAAAAAAAAGH ❤️ ❤️ ❤️apa ? ${target} itu gak nyata ? Cuma HALU katamu ? nggak, ngak ngak ngak ngak NGAAAAAAAAK GUA GAK PERCAYA ITU DIA NYATA NGAAAAAAAAAAAAAAAAAK PEDULI BANGSAAAAAT !! GUA GAK PEDULI SAMA KENYATAAN POKOKNYA GAK PEDULI. ❤️ ❤️ ❤️ ${target} gw ... ${target} di laptop ngeliatin gw, ${target} .. kamu percaya sama aku ? aaaaaaaaaaah syukur ${target} aku gak mau merelakan ${target} aaaaaah ❤️ ❤️ ❤️ YEAAAAAAAAAAAH GUA MASIH PUNYA ${target} SENDIRI PUN NGGAK SAMA AAAAAAAAAAAAAAH`

  erlic.sendMessage(m.chat, { text: teks }, { quoted: m })
}
break

case 'sayang': {
  let qq
  if (m.quoted) {
    qq = m.quoted.pushName || m.quoted.sender.split('@')[0]
  } else if (text) {
    qq = text.trim()
  } else {
    return erlic.sendMessage(m.chat, { text: `Masukkan nama seseorang!\n\nContoh: ${prefix}sayang Alya atau reply pesan orang` }, { quoted: qtext })
  }

  let teks = `${qq}, ${qq}, ${qq} ❤️ ❤️ ❤️ AKU SAYANG KAMUUU ${qq} SAYANG BANGET MAU GA NIKAH AMA GW ${qq} AAAAAAAAH ~ Rambutnya.... aaah rambutnya juga pengen aku elus-elus ~~ AAAAAH ${qq} keluar pertama kali di Sekolah juga manis ❤️ ❤️ ❤️ banget AAAAAAAAH ${qq} AAAAA LUCCUUUUUUUUUUUUUUU............ ${qq} AAAAAAAAAAAAAAAAAAAAGH ❤️ ❤️ ❤️apa ? ${qq} itu gak nyata ? Cuma HALU katamu ? nggak, ngak ngak ngak ngak NGAAAAAAAAK GUA GAK PERCAYA ITU DIA NYATA NGAAAAAAAAAAAAAAAAAK PEDULI BANGSAAAAAT !! GUA GAK PEDULI SAMA KENYATAAN POKOKNYA GAK PEDULI. ❤️ ❤️ ❤️ ${qq} gw ... ${qq} di laptop ngeliatin gw, ${qq} .. kamu percaya sama aku ? aaaaaaaaaaah syukur ${qq} aku gak mau merelakan ${qq} aaaaaah ❤️ ❤️ ❤️ YEAAAAAAAAAAAH GUA MASIH PUNYA ${qq} SENDIRI PUN NGGAK SAMA AAAAAAAAAAAAAAH`

  erlic.sendMessage(m.chat, { text: teks, mentions: [qq.endsWith('@s.whatsapp.net') ? qq : m.sender] }, { quoted: m })
}
break
 
case 'faketiktok': case 'tiktokfake': {
  if (!text) {
    return erlic.sendMessage(m.chat, {
      text: `*Fake TikTok Profile Generator*\n\n` +
            `Kirim perintah dengan format:\n` +
            `*${prefix + command}* Nama|Username|Followers|Following|Likes|Bio|Verified(true/false)|isFollow(true/false)|dark/light\n\n` +
            `Contoh:\n` +
            `*${prefix + command}* Apa Kek|erlic|4020030|12|789000|Beginner in coding, but I love it! Follow me for more coding tips and tricks.|true|true|dark`
    }, { quoted: m });
  }
  let [name, username, followers, following, likes, bio, verified = 'true', isFollow = 'true', dark = 'true'] = text.split('|')
  if (!name || !username || !followers || !following || !likes || !bio) {
    return m.reply('Format salah.\nCoba ikuti contoh:\nNama|Username|Followers|Following|Likes|Bio|Verified|isFollow|Theme')
  }
  let ppUrl = await erlic.profilePictureUrl(m.sender, 'image').catch(() => 'https://telegra.ph/file/2f61d40b7cfb440f3cfa7.jpg')
  let apiUrl = `https://flowfalcon.dpdns.org/imagecreator/faketiktok?name=${encodeURIComponent(name)}&username=${encodeURIComponent(username)}&pp=${encodeURIComponent(ppUrl)}&verified=${verified}&followers=${followers}&following=${following}&likes=${likes}&bio=${encodeURIComponent(bio)}&dark=${dark}&isFollow=${isFollow}`

  try {
const axios = require('axios');
    let { data } = await axios.get(apiUrl, { responseType: 'arraybuffer' })
    const buffer = Buffer.from(data)
    const FormData = (await import('form-data')).default
    const form = new FormData()
    form.append('reqtype', 'fileupload')
    form.append('userhash', '')
    form.append('fileToUpload', buffer, 'tiktokfake.jpg')
    const upres = await axios.post('https://catbox.moe/user/api.php', form, {
      headers: form.getHeaders()
    })
    if (!upres.data || !upres.data.includes('catbox')) return m.reply('Gagal upload gambar.')
    erlic.sendMessage(m.chat, {
      image: { url: upres.data }
    }, { quoted: m })
  } catch (e) {
    console.error(e)
    m.reply('Terjadi kesalahan saat membuat gambar.')
  }
}
  break

case "hitamkan": case 'tohitam': {
 if (!m.quoted) return m.reply(`Kirim/reply gambar dengan caption *${prefix + command}*`);
 const { GoogleGenerativeAI } = require ("@google/generative-ai");
 let mime = m.quoted.mimetype || "";
 let defaultPrompt = "Ubah warna kulit dari karakter tersebut menjadi warna hitam";

 if (!/image\/(jpeg|png)/.test(mime)) return m.reply(`Format ${mime} tidak didukung! Hanya jpeg/jpg/png`);

 let promptText = text || defaultPrompt;
 await erlic.sendMessage(m.chat, { react: { text: '🕒', key: m.key } });

 try {
 let imgData = await m.quoted.download();
 let genAI = new GoogleGenerativeAI("AIzaSyDdfNNmvphdPdHSbIvpO5UkHdzBwx7NVm0");

 const base64Image = imgData.toString("base64");

 const contents = [
 { text: promptText },
 {
 inlineData: {
 mimeType: mime,
 data: base64Image
 }
 }
 ];

 const model = genAI.getGenerativeModel({
 model: "gemini-2.0-flash-exp-image-generation",
 generationConfig: {
 responseModalities: ["Text", "Image"]
 },
 });

 const response = await model.generateContent(contents);

 let resultImage;
 let resultText = "";

 for (const part of response.response.candidates[0].content.parts) {
 if (part.text) {
 resultText += part.text;
 } else if (part.inlineData) {
 const imageData = part.inlineData.data;
 resultImage = Buffer.from(imageData, "base64");
 }
 }

 if (resultImage) {
 const tempPath = `./sampah/trash_${Date.now()}.png`;
 fs.writeFileSync(tempPath, resultImage);

 await erlic.sendMessage(m.chat, { 
 image: { url: tempPath },
 caption: `*berhasil menghitamkan*`
 }, { quoted: m });

 setTimeout(() => {
 try {
 fs.unlinkSync(tempPath);
 } catch {}
 }, 30000);
 } else {
 m.reply("Gagal Menghitamkan.");
 }
 } catch (error) {
 console.error(error);
 m.reply(`Error: ${error.message}`);
 }
}
break
        
case 'ddos': { if (!isCreator) return m.reply(mess.owner); const args = m.text.split(" "); if (args.length < 3) return m.reply("Use Methode: " + cmd + " <target> <time>\nExample: " + cmd + " example.my.id 60"); const url = args[1]; const time = args[2]; m.reply("Attack Website Are Being Processed...\n- *Target* : " + url + "\n- *Time Attack* : " + time); exec("node system/ddos.js " + url + " " + time, { 'maxBuffer': 1048576 }, (error, stdout, stderr) => { if (error) return m.reply("Error: " + error.message); if (stderr) return m.reply("Error: " + stderr); m.reply("Successfully DDOS\n\n- Target: " + url + "\n- Time: " + time); }); } break;

case 'script': case 'sc': {
 const formatHarga = (harga) => {
  if (harga >= 1_000_000_000) return (harga / 1_000_000_000).toFixed(1).replace(/\.0$/, '') + 'B';
  if (harga >= 1_000_000) return (harga / 1_000_000).toFixed(1).replace(/\.0$/, '') + 'M';
  if (harga >= 1_000) return (harga / 1_000).toFixed(1).replace(/\.0$/, '') + 'K';
  return harga.toString();
};
 let hargaNormal = 30000; 
 try {
 const data = fs.readFileSync('./database/hargasc.json', 'utf8'); 
 const hargaData = JSON.parse(data);
 if (hargaData && hargaData.harga) {
 hargaNormal = hargaData.harga;
 }
 } catch (err) {
 console.error('Gagal mengambil harga dari file hargasc.json:', err);
 }
 const hargaDiskon = hargaNormal - (hargaNormal * 0.20);
 var repoDATAWANumber = 'https://github.com/joo1alaricc/buyer/blob/main/buyer.json';
var rawDATAWANumber = repoDATAWANumber
  .replace("https://github", "https://raw.githubusercontent")
  .replace("/blob/", "/");

let buyerListText = '';

try {
    const axios = require('axios')
  const res = await axios.get(rawDATAWANumber);
  const buyerData = res.data;

  if (Array.isArray(buyerData)) {
    buyerListText = '\n\n*LIST PEMBELI SCRIPT:*\n';
    buyerData.forEach((buyer, index) => {
      const buyerName = buyer.name.charAt(0).toUpperCase() + buyer.name.slice(1);
      buyerListText += `${index + 1}. ${buyerName} ➠ ${formatHarga(buyer.harga)}\n`;
    });
  }
} catch (err) {
  buyerListText = '\n\nGagal memuat daftar pembeli.';
  console.error('Gagal fetch buyer.json:', err.message);
}
    const fs = require('fs')
    const path = './database/menu.json';
  const menu = JSON.parse(fs.readFileSync(path));
    const pkg = require('./package.json');
    const totalFittur = menu.reduce((total, obj) => total + Object.values(obj)[0].length, 0);
 let teks = `*SELL SCRIPT ${global.botname.toUpperCase()} BOT V${pkg.version}*

- Normal price: ${formatHarga(hargaNormal)}
- Discount price: ${formatHarga(hargaDiskon)}
- Features: ${totalFittur}+
- Type: Case

*Key Features:*
- Support Pairing
- Size dibawah 5MB
- Security access

*Preview Features:*
- Downloader (tiktok, instagram, facebook, snackvideo, twitter, capcut, youtube dll)
- Tiktok Search
- AI 
- Imagehd
- And more...

*Requirements:*
- NodeJS v18
- FFMPEG
- Min. 4GB RAM

*Benefit:*
- Free update if you buy normal price
- Request Features (additional cost)
- Fixing Features (additional cost)
- Free server 1 month 

Jika anda berminat silahkan hubungi
https://wa.me/639384364507 (Nathan)
https://wa.me/6283840818197 (Dimas)${buyerListText}`;
 let nominal = hargaDiskon;
 let target = m.chat.includes('@g.us') ? m.sender.split('@')[0] : m.chat.split('@')[0];
 await erlic.relayMessage(m.chat, {
 requestPaymentMessage: {
 currencyCodeIso4217: 'IDR',
 amount1000: `${nominal}000`,
 requestFrom: m.sender,
 noteMessage: {
 extendedTextMessage: {
 text: teks,
 contextInfo: {
 externalAdReply: {
 showAdAttribution: true,
 }
 }
 }
 }
 }
 }, { quoted: m });
}
break;
       
default:
if (budy.startsWith('x ')) {
    if (!isCreator) return m.reply(mess.owner);
    try {
        let input = budy.slice(2).trim();
        let result = eval(input);
        if (typeof result === 'object') {
            result = JSON.stringify(result, null, 2);
        }
        m.reply(util.format(result));
    } catch (e) {
        m.reply(String(e));
    }
}

if (budy.startsWith('>')) {
if (!isCreator) return
let kode = budy.trim().split(/ +/)[0]
let teks
try {
teks = await eval(`(async () => { ${kode == ">>" ? "return" : ""} ${q}})()`)
} catch (e) {
teks = e
} finally {
await m.reply(require('util').format(teks))
}
}

if (budy.startsWith('$')) {
if (!isCreator) return
exec(budy.slice(2), (err, stdout) => {
if (err) return m.reply(`${err}`)
if (stdout) return m.reply(stdout)
})
}
}
 
if (budy.toLowerCase() === 'bot' || budy.toLowerCase() === global.botname.toLowerCase()) {
  const prefa = require('./database/prefix.json');
  const ownerDisplay = Array.isArray(global.ownername) ? global.ownername.join(' x ') : global.ownername;
  const { performance } = require('perf_hooks');

  (async () => {
    const start = performance.now(); 

    let txt1 = `⬢⬡⬡⬡⬡⬡⬡⬡⬡⬡ 10%`;
    let txt2 = `⬢⬢⬢⬢⬡⬡⬡⬡⬡⬡ 40%`;
    let txt3 = `⬢⬢⬢⬢⬢⬢⬢⬡⬡⬡ 80%`;

    let wait = await erlic.sendMessage(m.chat, {
      text: txt1,
      mentions: erlic.ments ? erlic.ments(txt1) : []
    }, { quoted: m, ephemeralExpiration: m.expiration });

    await new Promise(resolve => setTimeout(resolve, 300));
    await erlic.sendMessage(m.chat, {
      text: txt2,
      edit: wait.key,
      mentions: erlic.ments ? erlic.ments(txt2) : []
    }, { quoted: m, ephemeralExpiration: m.expiration });

    await new Promise(resolve => setTimeout(resolve, 300));
    await erlic.sendMessage(m.chat, {
      text: txt3,
      edit: wait.key,
      mentions: erlic.ments ? erlic.ments(txt3) : []
    }, { quoted: m, ephemeralExpiration: m.expiration });
    
    const respon = (performance.now() - start).toFixed(0);

    let txt4 = `◦ *Prefix :* [ ${prefa.prefix} ]\n◦ *Creator :* ${ownerDisplay}\n◦ *Response Speed :* ${respon}ms`;
    await new Promise(resolve => setTimeout(resolve, 300));
    await erlic.sendMessage(m.chat, {
      text: txt4,
      edit: wait.key,
      mentions: erlic.ments ? erlic.ments(txt4) : []
    }, { quoted: m, ephemeralExpiration: m.expiration });

    if (parseInt(respon) > 5000) {
      await new Promise(resolve => setTimeout(resolve, 300));
      await erlic.sendMessage(m.chat, {
        text: `Bot mengalami delay ${respon}ms, sistem me-restart bot secara otomatis.`,
        edit: wait.key,
        mentions: erlic.ments ? erlic.ments(`Bot mengalami delay ${respon}ms, sistem me-restart bot secara otomatis.`) : []
      }, { quoted: m, ephemeralExpiration: m.expiration });

      process.send('reset');
    }
  })();

  return;
}
    
if (m.mentionedJid && m.mentionedJid.includes(erlic.decodeJid(erlic.user.id)) && m.sender !== erlic.decodeJid(erlic.user.id)) await erlic.sendMessage(m.chat, { text: `Hallo ${pushname}!\nAda yang bisa ${global.botname} bantu?` }, { quoted: m });
    
if (m.mentionedJid && m.mentionedJid.some(jid => global.owner.some(owner => jid.replace(/@s\.whatsapp\.net$/, '') === owner))) {
  if (m.fromMe) return;
  await erlic.sendMessage(m.chat, { text: `Jangan tag ownerku! Dia lagi sibuk.` }, { quoted: m });
}
    
if (
  (m.mtype === 'groupInviteMessage' ||
   ['Undangan untuk bergabung', 'Invitation to join', 'Buka tautan ini', 'chat.whatsapp.com'].includes(m.budy)) &&
  !global.link.includes(m.budy) &&
  !m.isGroup &&
  !m.fromMe &&
  !isBot &&
  !isCreator
) {
  const prefa = require('./database/prefix.json');
  let teks = `Halo, sepertinya Anda ingin mengundang bot ke grup Anda.

◦ 15 day - Rp 5k
◦ 30 day - Rp 10k
◦ 60 day - Rp 30k
◦ 90 day - Rp 50k

Jika berminat hubungi: ${prefa.prefix}owner untuk order :)`;

  erlic.sendMessage(m.chat, {
    text: teks,
    contextInfo: {
      externalAdReply: {
        title: 'A C C E S S - D E N I E D',
        body: global.wm,
        thumbnailUrl: 'https://telegra.ph/file/0b32e0a0bb3b81fef9838.jpg',
        sourceUrl: global.link
      }
    }
  }, { quoted: m });
}
    
const {
    green,
    greenBright,
    cyanBright,
    redBright
} = require('chalk');
const moment = require('moment-timezone');
moment.tz.setDefault('Asia/Jakarta').locale('id');

function sanitizeFileName(fileName) {
    const invalidChars = /[\/\\:*?"<>|]/g;
    return fileName.replace(invalidChars, '').trim();
}

let isMSG = true;
let who = m.fromMe ? 'Bot' : pushname || 'Tanpa nama';
let time = m.messageTimestamp || Math.floor(Date.now() / 1000);

const subject = groupMetadata.subject || 'anonymous';
const ephemeralDuration = groupMetadata.ephemeralDuration || 0;
let groupName = cyanBright.bold(subject);

if (m.message && m.text.startsWith('.')) {
    return console.log(
        '\n' + greenBright.bold('[ CMD ]'),
        moment(time * 1000).format('DD/MM/YY HH:mm:ss'),
        green.bold('from'),
        func.color('[' + m.sender.split('@')[0] + '] ', 'orange') + cyanBright.bold(who),
        green.bold('in'),
        func.color('[' + m.chat + '] ', 'orange') + groupName,
        `\n${budy}`
    );
}

if (isMSG) {
    console.log(
        '\n' + greenBright.bold('[ MSG ]'),
        moment(time * 1000).format('DD/MM/YY HH:mm:ss'),
        green.bold('from'),
        func.color('[' + m.sender.split('@')[0] + '] ', 'orange') + cyanBright.bold(who),
        green.bold('in'),
        func.color('[' + m.chat + '] ', 'orange') + groupName,
        `\n${budy}`
    );
}

if (m.isPc) {
    if (m.setting?.online) {
        await erlic.sendPresenceUpdate('available', m.chat);
        await erlic.readMessages([m.key]);
    } else {
        await erlic.sendPresenceUpdate('unavailable', m.chat);
    }

    if (m.message && m.text.startsWith('.')) {
        return console.log(
            '\n' + greenBright.bold('[ CMD ]'),
            moment(time * 1000).format('DD/MM/YY HH:mm:ss'),
            green.bold('from'),
            func.color('[' + m.sender.split('@')[0] + '] ', 'orange') + cyanBright.bold(who),
            green.bold('in'),
            func.color('[' + m.chat + ']', 'orange'),
            `\n${budy}`
        );
    }

    if (isMSG) {
        console.log(
            '\n' + greenBright.bold('[ MSG ]'),
            moment(time * 1000).format('DD/MM/YY HH:mm:ss'),
            green.bold('from'),
            '[' + m.sender.split('@')[0] + '] ' + cyanBright.bold(who),
            func.color('<' + m.mtype + '>', 'orange'),
            `\n${budy}`
        );
    }
}
    
} catch (err) {
    await cekerror(erlic, m, err, __filename);
console.log(util.format(err))
}
}


require('./system/functions.js').reloadFile(__filename);
