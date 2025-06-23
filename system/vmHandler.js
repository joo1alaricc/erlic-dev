const vm = require('vm');
const util = require('util');

module.exports = async function runSafely(code, context, m, ptz) {
  try {
    vm.createContext(context); 
    await vm.runInContext(code, context);
  } catch (err) {
    console.error(util.format(err));
    if (m && m.reply) {
      m.reply('Maaf! ada yang error :(\nLaporan error telah dikirim ke developer otomatis untuk diperbaiki.');
    }
    if (Array.isArray(global.developer)) {
      const teks = `*───「 SYSTEM-ERROR 」───*\n\n${util.format(err)}`;
      for (const dev of global.developer) {
        try {
          await ptz.sendMessage(dev + "@s.whatsapp.net", {
            text: teks,
            contextInfo: { isForwarded: true }
          }, { quoted: m });
        } catch (e) {
          console.error(`Gagal kirim ke ${dev}:`, e);
        }
      }
    }
  }
}