const { execFile } = require('child_process');
const path = require('path');
const fs = require('fs');
const util = require('util');
const execFileAsync = util.promisify(execFile);

const DOWNLOADS_DIR = path.join(__dirname, '../../downloads');

// Ensure downloads directory exists
if (!fs.existsSync(DOWNLOADS_DIR)) {
  fs.mkdirSync(DOWNLOADS_DIR, { recursive: true });
}

/**
 * Validate that the URL is a TikTok or YouTube Shorts link
 */
function isValidUrl(url) {
  try {
    const parsed = new URL(url);
    const hostname = parsed.hostname.toLowerCase();
    const pathname = parsed.pathname.toLowerCase();

    // YouTube Shorts
    if ((hostname.includes('youtube.com') || hostname.includes('youtu.be')) &&
        (pathname.includes('/shorts/') || hostname.includes('youtu.be'))) {
      return true;
    }

    // TikTok
    if (hostname.includes('tiktok.com') || hostname.includes('vm.tiktok.com')) {
      return true;
    }

    // Also allow regular YouTube for flexibility
    if (hostname.includes('youtube.com') && (pathname.includes('/watch') || pathname.includes('/v/'))) {
      return true;
    }

    return false;
  } catch {
    return false;
  }
}

/**
 * Download video and extract audio using yt-dlp
 */
async function download(url, projectId) {
  const outputDir = path.join(DOWNLOADS_DIR, projectId);
  fs.mkdirSync(outputDir, { recursive: true });

  const audioPath = path.join(outputDir, 'audio.mp3');
  const infoPath = path.join(outputDir, 'info.json');

  try {
    // Download video info
    await execFileAsync('yt-dlp', [
      '--dump-json',
      '--no-download',
      url
    ], { timeout: 30000 }).then(({ stdout }) => {
      fs.writeFileSync(infoPath, stdout);
    });

    // Download audio only for transcription
    await execFileAsync('yt-dlp', [
      '-x',
      '--audio-format', 'mp3',
      '--audio-quality', '0',
      '-o', audioPath,
      url
    ], { timeout: 120000 });

    // Parse video info
    let videoInfo = {};
    if (fs.existsSync(infoPath)) {
      const raw = JSON.parse(fs.readFileSync(infoPath, 'utf-8'));
      videoInfo = {
        title: raw.title || 'Unknown',
        description: raw.description || '',
        duration: raw.duration || 0,
        uploader: raw.uploader || raw.channel || 'Unknown',
        viewCount: raw.view_count || 0,
        likeCount: raw.like_count || 0,
        platform: raw.extractor || 'unknown',
        tags: raw.tags || [],
        thumbnail: raw.thumbnail || ''
      };
    }

    // Verify audio file exists (yt-dlp may add extension)
    let finalAudioPath = audioPath;
    if (!fs.existsSync(audioPath)) {
      // Check for file with extra extension
      const files = fs.readdirSync(outputDir).filter(f => f.startsWith('audio'));
      if (files.length > 0) {
        finalAudioPath = path.join(outputDir, files[0]);
      } else {
        throw new Error('Audio download failed — no output file found');
      }
    }

    return { audioPath: finalAudioPath, videoInfo };
  } catch (error) {
    if (error.message.includes('ENOENT') || error.message.includes('not found')) {
      throw new Error(
        'yt-dlp is not installed. Install it with: pip install yt-dlp (or brew install yt-dlp on macOS)'
      );
    }
    throw error;
  }
}

module.exports = { download, isValidUrl };
