const fs = require('fs');
const chalk = require('chalk');
const ms = require('parse-ms');
const path = require('path');
const util = require('util');
const ytdl = require('ytdl-core');
const axios = require('axios');
const cheerio = require('cheerio');
const fetch = require('node-fetch');
const crypto = require('crypto');
const moment = require('moment-timezone');
const jsobfus = require('javascript-obfuscator');
const archiver = require('archiver');
const speed = require('performance-now');
const FormData = require('form-data');
const {
    read,
    MIME_JPEG,
    RESIZE_BILINEAR,
    AUTO
} = require('jimp');
const {
    fromBuffer
} = require('file-type');
const {
    exec
} = require('child_process');
const func = new Object();

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
    
func.reloadFile = (file) => {
    const fs = require('fs')
    const chalk = require('chalk')
    const moment = require('moment-timezone')
    file = require.resolve(file)
    fs.watchFile(file, () => {
        fs.unwatchFile(file)
        console.log(chalk.greenBright.bold('[ UPDATE ]'), chalk.whiteBright(moment(Date.now()).format('DD/MM/YY HH:mm:ss')), chalk.cyan.bold('➠ ' + path.basename(file)))
        delete require.cache[file]
        require(file)
    })
}
    
func.filename = (ext) => {
    return `${Math.floor(Math.random() * 10000)}.${ext}`
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

func.bgcolor = (text, bgcolor) => {
    const chalk = require('chalk')
    return !bgcolor ? chalk.green(text) : chalk.bgKeyword(bgcolor)(text)}

func.backupSC = async () => {
    let backupName = `backup_${new Date().toISOString().replace(/:/g, '-')}.zip`;
    let cwd = process.cwd();
    await fs.readdirSync(cwd).filter(item => item.startsWith('backup_') && item.endsWith('.zip') && item !== backupName).map(file => fs.unlinkSync(cwd + '/' + file));
    let output = fs.createWriteStream(backupName);
    let archive = archiver('zip', {
        zlib: {
            level: 9
        }
    });
    archive.pipe(output);
    archive.on('warning', function(err) {
        if (err.code === 'ENOENT') {
            console.warn(err);
        } else {
            throw err;
        }
    });
    archive.glob('**/*', {
        cwd: process.cwd(),
        ignore: ['node_modules/**/*', 'sampah/**/*', 'core/**', '.cache/**', '.npm/**', backupName]
    });
    await archive.finalize()
    return {
        name: backupName,
        size: (archive.pointer() / 1024 / 1024).toFixed(2)
    }
}

const _0x3b6e3e=_0xeada;function _0x2120(){const _0x24916d=['low','3796bqXcCk','variable','2920XyfpKY','dpfFc','3175336PUpITw','base64','cNebk','2219592uaTwAh','tedCode','479802xzAYBF','getObfusca','obfuscate','obfus','19261XfPzzI','VVsEK','qCprU','406612YNJgmq','hexadecima','VFAne','NathanDima','WfiNa','iPwBG','489Fxghwt','includes','KXlpX','7ZDSRtu','message','2454485JodLkJ','Mjkii','medium','function','high','9cwRuKF','saOGB'];_0x2120=function(){return _0x24916d;};return _0x2120();}function _0xeada(_0x178467,_0x5aece2){const _0x434596=_0x2120();return _0xeada=function(_0x20ca57,_0x5ad6b0){_0x20ca57=_0x20ca57-(0x5e3+-0x7e2+0x2ef);let _0x50ebea=_0x434596[_0x20ca57];return _0x50ebea;},_0xeada(_0x178467,_0x5aece2);}(function(_0xf0ab96,_0x21fdb0){const _0xf2e171=_0xeada,_0x158a56=_0xf0ab96();while(!![]){try{const _0x4db949=parseInt(_0xf2e171(0xf8))/(0x30*0x55+-0x2122+0x11*0x103)+parseInt(_0xf2e171(0x10b))/(0x13be+-0xa*-0x39b+-0x37ca)*(-parseInt(_0xf2e171(0xfe))/(0xd3d+0x339*-0x3+-0x38f*0x1))+parseInt(_0xf2e171(0x112))/(-0x1800+0xe17*-0x2+0x3432)+-parseInt(_0xf2e171(0x103))/(0xc25+0xc0d*-0x1+-0x13)+parseInt(_0xf2e171(0xf1))/(0x4f*0x79+0x400+-0x2951)*(parseInt(_0xf2e171(0x101))/(-0xf9b+-0x1*-0x15fb+-0x659))+parseInt(_0xf2e171(0x10f))/(0x128b+-0x13e7+0x164)*(-parseInt(_0xf2e171(0x108))/(-0x1317+-0x8b*0x30+0x2d30))+parseInt(_0xf2e171(0x10d))/(0x1347+-0x14ba+0x7f*0x3)*(parseInt(_0xf2e171(0xf5))/(0x9*-0x10b+-0xd21+0xaf*0x21));if(_0x4db949===_0x21fdb0)break;else _0x158a56['push'](_0x158a56['shift']());}catch(_0x26aefc){_0x158a56['push'](_0x158a56['shift']());}}}(_0x2120,0x7f219*-0x1+0x467d5+0x8f741*0x1),func[_0x3b6e3e(0xf4)]=async function(_0xb3bd54,_0x2f8390=_0x3b6e3e(0x10a)){const _0x18fa62=_0x3b6e3e,_0x1fec33={'Mjkii':_0x18fa62(0x10a),'qCprU':_0x18fa62(0x105),'VFAne':_0x18fa62(0x107),'KXlpX':_0x18fa62(0xf9)+'l','saOGB':_0x18fa62(0x10c),'cNebk':_0x18fa62(0x110),'VVsEK':_0x18fa62(0x106),'iPwBG':_0x18fa62(0xfb)+'s.','dpfFc':function(_0x14b38b,_0x3d78cb){return _0x14b38b(_0x3d78cb);},'WfiNa':function(_0x36bf50,_0x4d7ddf){return _0x36bf50(_0x4d7ddf);}};return new Promise((_0x2682a3,_0x2adcba)=>{const _0x4a84a0=_0x18fa62;let _0x8c8099=[_0x1fec33[_0x4a84a0(0x104)],_0x1fec33[_0x4a84a0(0xf7)],_0x1fec33[_0x4a84a0(0xfa)]];_0x8c8099[_0x4a84a0(0xff)](_0x2f8390)?_0x2f8390=_0x2f8390:_0x2f8390=_0x8c8099[-0x5e*-0x43+-0x791+-0x1109];try{const _0x543c77={'low':{'compact':!![],'controlFlowFlattening':!![],'controlFlowFlatteningThreshold':0x1,'numbersToExpressions':!![],'simplify':!![],'stringArrayShuffle':!![],'splitStrings':!![],'stringArrayThreshold':0x1},'medium':{'compact':!![],'controlFlowFlattening':![],'deadCodeInjection':![],'debugProtection':![],'debugProtectionInterval':0x0,'disableConsoleOutput':![],'identifierNamesGenerator':_0x1fec33[_0x4a84a0(0x100)],'log':!![],'numbersToExpressions':![],'renameGlobals':![],'selfDefending':!![],'simplify':!![],'splitStrings':![],'stringArray':!![],'stringArrayCallsTransform':![],'stringArrayEncoding':[],'stringArrayIndexShift':!![],'stringArrayRotate':!![],'stringArrayShuffle':!![],'stringArrayWrappersCount':0x1,'stringArrayWrappersChainedCalls':!![],'stringArrayWrappersParametersMaxCount':0x2,'stringArrayWrappersType':_0x1fec33[_0x4a84a0(0x109)],'stringArrayThreshold':0.75,'unicodeEscapeSequence':![]},'high':{'compact':!![],'controlFlowFlattening':!![],'controlFlowFlatteningThreshold':0.75,'deadCodeInjection':!![],'deadCodeInjectionThreshold':0.4,'debugProtection':![],'debugProtectionInterval':0x0,'disableConsoleOutput':![],'identifierNamesGenerator':_0x1fec33[_0x4a84a0(0x100)],'log':!![],'numbersToExpressions':!![],'renameGlobals':![],'selfDefending':!![],'simplify':!![],'splitStrings':!![],'splitStringsChunkLength':0xa,'stringArray':!![],'stringArrayCallsTransform':!![],'stringArrayCallsTransformThreshold':0.75,'stringArrayEncoding':[_0x1fec33[_0x4a84a0(0x111)]],'stringArrayIndexShift':!![],'stringArrayRotate':!![],'stringArrayShuffle':!![],'stringArrayWrappersCount':0x2,'stringArrayWrappersChainedCalls':!![],'stringArrayWrappersParametersMaxCount':0x4,'stringArrayWrappersType':_0x1fec33[_0x4a84a0(0xf6)],'stringArrayThreshold':0.75,'transformObjectKeys':!![],'unicodeEscapeSequence':![]}},_0x44e98f=jsobfus[_0x4a84a0(0xf3)](_0xb3bd54,_0x543c77[_0x2f8390]),_0x46543d={'status':0xc8,'developer':_0x1fec33[_0x4a84a0(0xfd)],'result':_0x44e98f[_0x4a84a0(0xf2)+_0x4a84a0(0xf0)]()};_0x1fec33[_0x4a84a0(0x10e)](_0x2682a3,_0x46543d);}catch(_0x31bf30){const _0x2b540e={'status':0x190,'developer':_0x1fec33[_0x4a84a0(0xfd)],'message':_0x31bf30[_0x4a84a0(0x102)]};_0x1fec33[_0x4a84a0(0xfc)](_0x2682a3,_0x2b540e);}});});
    
module.exports = func;
