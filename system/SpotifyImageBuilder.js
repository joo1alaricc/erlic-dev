const { createCanvas, loadImage, registerFont } = require('canvas');
const path = require('path');

class SpotifyImageBuilder {
  constructor(width = 1000, height = 300) {
    this.canvas = createCanvas(width, height);
    this.ctx = this.canvas.getContext('2d');
    this.data = {
      author: '',
      album: '',
      title: '',
      image: '',
      duration: 0,
      start: 0,
      blur: 0,
      overlayOpacity: 0.4,
    };
  }

  setAuthor(author) {
    this.data.author = author;
    return this;
  }

  setAlbum(album) {
    this.data.album = album;
    return this;
  }

  setTitle(title) {
    this.data.title = title;
    return this;
  }

  setImage(image) {
    this.data.image = image;
    return this;
  }

  setTimestamp(start, duration) {
    this.data.start = start;
    this.data.duration = duration;
    return this;
  }

  setBlur(blur) {
    this.data.blur = blur;
    return this;
  }

  setOverlayOpacity(opacity) {
    this.data.overlayOpacity = opacity;
    return this;
  }

  formatTime(seconds) {
    const m = Math.floor(seconds / 60).toString().padStart(2, '0');
    const s = Math.floor(seconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  }

  async build() {
    const { ctx, canvas, data } = this;

    // Background
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Load background image and dark overlay
    if (data.image) {
      try {
        const img = await loadImage(data.image);
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        ctx.fillStyle = `rgba(0,0,0,${data.overlayOpacity})`;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      } catch (e) {
        console.error('Image load error:', e);
      }
    }

    // Draw Spotify Logo (gunakan logo putih PNG)
    try {
      const logo = await loadImage('https://files.catbox.moe/o2jolf.jpeg'); // ganti dengan nama file yang kamu upload
      const logoSize = 36;
      ctx.drawImage(logo, canvas.width / 2 - logoSize / 2, 30, logoSize, logoSize);
    } catch (e) {
      console.error('Logo load error:', e);
    }

    // Author
    ctx.font = '20px sans-serif';
    ctx.fillStyle = '#ccc';
    ctx.textAlign = 'center';
    ctx.fillText(data.author, canvas.width / 2, 90);

    // Title
    ctx.font = 'bold 34px sans-serif';
    ctx.fillStyle = '#fff';
    ctx.fillText(data.title, canvas.width / 2, 135);

    // Album
    ctx.font = '20px sans-serif';
    ctx.fillStyle = '#aaa';
    ctx.fillText(data.album, canvas.width / 2, 170);

    // Progress bar
    const barWidth = canvas.width - 180;
    const barX = 90;
    const barY = canvas.height - 60;
    const progress = (data.start / data.duration) * barWidth;

    ctx.fillStyle = '#fff';
    ctx.fillRect(barX, barY, progress, 4);
    ctx.fillStyle = '#888';
    ctx.fillRect(barX + progress, barY, barWidth - progress, 4);

    // Timestamp
    ctx.font = '18px monospace';
    ctx.fillStyle = '#fff';
    ctx.textAlign = 'left';
    ctx.fillText(this.formatTime(data.start), barX, barY + 25);
    ctx.textAlign = 'right';
    ctx.fillText(this.formatTime(data.duration), barX + barWidth, barY + 25);

    return this.canvas.toBuffer('image/png');
  }
}

module.exports = SpotifyImageBuilder;