class AudioManager {
    constructor() {
        this.sounds = {
            hover: new Audio('assets/audio/hover.wav'),
            click: new Audio('assets/audio/click.wav'),
            bgm: new Audio('assets/audio/bgm.mp3')
        };
        
        // Configure background music
        this.sounds.bgm.loop = true;
        this.sounds.bgm.volume = 0.3;
        
        // Configure sound effects
        this.sounds.hover.volume = 0.2;
        this.sounds.click.volume = 0.3;
        
        // Initialize mute state
        this.isMuted = false;
    }
    
    playSound(soundName) {
        if (!this.isMuted && this.sounds[soundName]) {
            // For sound effects, reset and play
            if (soundName !== 'bgm') {
                this.sounds[soundName].currentTime = 0;
            }
            this.sounds[soundName].play().catch(error => {
                console.log("Audio playback failed:", error);
            });
        }
    }
    
    stopSound(soundName) {
        if (this.sounds[soundName]) {
            this.sounds[soundName].pause();
            this.sounds[soundName].currentTime = 0;
        }
    }
    
    startBGM() {
        this.playSound('bgm');
    }
    
    toggleMute() {
        this.isMuted = !this.isMuted;
        Object.values(this.sounds).forEach(sound => {
            sound.muted = this.isMuted;
        });
        return this.isMuted;
    }
}

// Export the audio manager
window.AudioManager = AudioManager; 