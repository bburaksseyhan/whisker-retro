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
        const bufferData = new ArrayBuffer(44 + length);
        const view = new DataView(bufferData);
        
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
        
        return new Blob([bufferData], { type: 'audio/wav' });
    }
}

// Generate and save sound files
async function generateSoundFiles() {
    try {
        const generator = new SoundGenerator();
        
        // Create download container
        const downloadContainer = document.createElement('div');
        downloadContainer.style.position = 'fixed';
        downloadContainer.style.top = '10px';
        downloadContainer.style.left = '10px';
        downloadContainer.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
        downloadContainer.style.padding = '20px';
        downloadContainer.style.borderRadius = '10px';
        downloadContainer.style.color = 'white';
        downloadContainer.style.fontFamily = 'Press Start 2P, cursive';
        downloadContainer.style.fontSize = '12px';
        downloadContainer.style.zIndex = '1000';
        
        // Add instructions
        const instructions = document.createElement('div');
        instructions.innerHTML = 'Ses dosyalarını indirin ve assets/audio klasörüne taşıyın:<br>';
        downloadContainer.appendChild(instructions);
        
        // Generate hover sound
        const hoverSound = await generator.generateHoverSound();
        const hoverUrl = URL.createObjectURL(hoverSound);
        const hoverLink = document.createElement('a');
        hoverLink.href = hoverUrl;
        hoverLink.download = 'hover.wav';
        hoverLink.innerHTML = 'hover.wav<br>';
        hoverLink.style.color = '#FFFF00';
        hoverLink.style.textDecoration = 'none';
        hoverLink.style.marginBottom = '10px';
        hoverLink.style.display = 'block';
        downloadContainer.appendChild(hoverLink);
        
        // Generate click sound
        const clickSound = await generator.generateClickSound();
        const clickUrl = URL.createObjectURL(clickSound);
        const clickLink = document.createElement('a');
        clickLink.href = clickUrl;
        clickLink.download = 'click.wav';
        clickLink.innerHTML = 'click.wav<br>';
        clickLink.style.color = '#FFFF00';
        clickLink.style.textDecoration = 'none';
        clickLink.style.marginBottom = '10px';
        clickLink.style.display = 'block';
        downloadContainer.appendChild(clickLink);
        
        // Generate background music
        const bgm = await generator.generateBGM();
        const bgmUrl = URL.createObjectURL(bgm);
        const bgmLink = document.createElement('a');
        bgmLink.href = bgmUrl;
        bgmLink.download = 'bgm.mp3';
        bgmLink.innerHTML = 'bgm.mp3<br>';
        bgmLink.style.color = '#FFFF00';
        bgmLink.style.textDecoration = 'none';
        bgmLink.style.marginBottom = '10px';
        bgmLink.style.display = 'block';
        downloadContainer.appendChild(bgmLink);
        
        // Add close button
        const closeButton = document.createElement('button');
        closeButton.innerHTML = 'Kapat';
        closeButton.style.backgroundColor = '#FF4444';
        closeButton.style.border = 'none';
        closeButton.style.color = 'white';
        closeButton.style.padding = '5px 10px';
        closeButton.style.cursor = 'pointer';
        closeButton.style.marginTop = '10px';
        closeButton.onclick = () => downloadContainer.remove();
        downloadContainer.appendChild(closeButton);
        
        // Add to document
        document.body.appendChild(downloadContainer);
        
    } catch (error) {
        console.log('Error generating sound files:', error);
    }
}

// Generate sound files when the script loads
generateSoundFiles(); 