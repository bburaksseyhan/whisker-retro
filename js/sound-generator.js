// Simple retro sound generator using Web Audio API
class SoundGenerator {
    constructor() {
        this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
    }

    async generateHoverSound() {
        const buffer = this.audioContext.createBuffer(1, this.audioContext.sampleRate * 0.1, this.audioContext.sampleRate);
        const channelData = buffer.getChannelData(0);
        
        for (let i = 0; i < buffer.length; i++) {
            // Generate a simple sine wave with increasing frequency
            channelData[i] = Math.sin(i * 0.05) * Math.exp(-4 * i / buffer.length);
        }
        
        return this._exportToWav(buffer, 'hover.wav');
    }

    async generateClickSound() {
        const buffer = this.audioContext.createBuffer(1, this.audioContext.sampleRate * 0.1, this.audioContext.sampleRate);
        const channelData = buffer.getChannelData(0);
        
        for (let i = 0; i < buffer.length; i++) {
            // Generate a more complex waveform for the click sound
            const t = i / buffer.length;
            channelData[i] = (Math.sin(i * 0.1) + Math.sin(i * 0.15)) * Math.exp(-8 * t);
        }
        
        return this._exportToWav(buffer, 'click.wav');
    }

    async generateBGM() {
        const buffer = this.audioContext.createBuffer(2, this.audioContext.sampleRate * 4, this.audioContext.sampleRate);
        const leftChannel = buffer.getChannelData(0);
        const rightChannel = buffer.getChannelData(1);
        
        // Generate a simple retro melody
        for (let i = 0; i < buffer.length; i++) {
            const t = i / this.audioContext.sampleRate;
            const baseFreq = 440; // A4 note
            
            // Create a simple melody pattern
            const melody = Math.sin(2 * Math.PI * baseFreq * t) * 0.3 +
                         Math.sin(2 * Math.PI * (baseFreq * 1.5) * t) * 0.2 +
                         Math.sin(2 * Math.PI * (baseFreq * 2) * t) * 0.1;
                         
            leftChannel[i] = melody * Math.exp(-t / 4);
            rightChannel[i] = melody * Math.exp(-t / 4);
        }
        
        return this._exportToWav(buffer, 'bgm.mp3');
    }

    _exportToWav(buffer, filename) {
        // Convert AudioBuffer to WAV format
        const numOfChan = buffer.numberOfChannels;
        const length = buffer.length * numOfChan * 2;
        const buffer = new ArrayBuffer(44 + length);
        const view = new DataView(buffer);
        
        // Write WAV header
        const writeString = (view, offset, string) => {
            for (let i = 0; i < string.length; i++) {
                view.setUint8(offset + i, string.charCodeAt(i));
            }
        };
        
        writeString(view, 0, 'RIFF');
        view.setUint32(4, 36 + length, true);
        writeString(view, 8, 'WAVE');
        writeString(view, 12, 'fmt ');
        view.setUint32(16, 16, true);
        view.setUint16(20, 1, true);
        view.setUint16(22, numOfChan, true);
        view.setUint32(24, buffer.sampleRate, true);
        view.setUint32(28, buffer.sampleRate * 2 * numOfChan, true);
        view.setUint16(32, numOfChan * 2, true);
        view.setUint16(34, 16, true);
        writeString(view, 36, 'data');
        view.setUint32(40, length, true);
        
        // Write audio data
        const offset = 44;
        for (let i = 0; i < buffer.length; i++) {
            for (let channel = 0; channel < numOfChan; channel++) {
                const sample = buffer.getChannelData(channel)[i];
                const int16 = Math.max(-1, Math.min(1, sample)) * 0x7FFF;
                view.setInt16(offset + (i * numOfChan + channel) * 2, int16, true);
            }
        }
        
        return new Blob([buffer], { type: 'audio/wav' });
    }
}

// Generate and save sound files
async function generateSoundFiles() {
    const generator = new SoundGenerator();
    
    // Generate hover sound
    const hoverSound = await generator.generateHoverSound();
    const hoverUrl = URL.createObjectURL(hoverSound);
    const hoverLink = document.createElement('a');
    hoverLink.href = hoverUrl;
    hoverLink.download = 'hover.wav';
    hoverLink.click();
    
    // Generate click sound
    const clickSound = await generator.generateClickSound();
    const clickUrl = URL.createObjectURL(clickSound);
    const clickLink = document.createElement('a');
    clickLink.href = clickUrl;
    clickLink.download = 'click.wav';
    clickLink.click();
    
    // Generate background music
    const bgm = await generator.generateBGM();
    const bgmUrl = URL.createObjectURL(bgm);
    const bgmLink = document.createElement('a');
    bgmLink.href = bgmUrl;
    bgmLink.download = 'bgm.mp3';
    bgmLink.click();
}

// Generate sound files when the script loads
generateSoundFiles(); 