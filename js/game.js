// Game configuration
const gameConfig = {
    width: Math.min(800, window.innerWidth),
    height: Math.min(600, window.innerHeight),
    backgroundColor: 0x87CEEB,
    resolution: window.devicePixelRatio || 1,
    antialias: false,
    powerPreference: 'high-performance'
};

// Global constants
const PIXEL_SIZE = 4;
const GRASS_COLORS = [0x90EE90, 0x98FB98, 0x32CD32];

// Calculate responsive dimensions
function getResponsiveDimensions() {
    const screenWidth = window.innerWidth;
    const screenHeight = window.innerHeight;
    
    // Calculate scale factors
    const scaleX = Math.min(1, screenWidth / 800);
    const scaleY = Math.min(1, screenHeight / 600);
    const scale = Math.min(scaleX, scaleY);
    
    return {
        width: 800 * scale,
        height: 600 * scale,
        scale: scale
    };
}

// Initialize PixiJS Application with pixel art settings
const app = new PIXI.Application(gameConfig);
document.getElementById('game-container').appendChild(app.view);

// Handle window resize
window.addEventListener('resize', () => {
    const dimensions = getResponsiveDimensions();
    
    // Update game config
    gameConfig.width = dimensions.width;
    gameConfig.height = dimensions.height;
    
    // Resize renderer
    app.renderer.resize(dimensions.width, dimensions.height);
    
    // Scale stage
    app.stage.scale.set(dimensions.scale);
    
    // Update background
    background.clear();
    background.beginFill(0x87CEEB);
    background.drawRect(0, 0, dimensions.width, dimensions.height);
    background.beginFill(0x6CA6CD);
    background.drawRect(0, dimensions.height / 2, dimensions.width, dimensions.height / 2);
    
    // Update grass
    grass.clear();
    for (let x = 0; x < dimensions.width / PIXEL_SIZE; x++) {
        const height = 10 + Math.sin(x * 0.5) * 5;
        for (let y = 0; y < height; y++) {
            const colorIndex = Math.floor(Math.random() * GRASS_COLORS.length);
            grass.beginFill(GRASS_COLORS[colorIndex]);
            grass.drawRect(x * PIXEL_SIZE, dimensions.height - y * PIXEL_SIZE, PIXEL_SIZE, PIXEL_SIZE);
        }
    }
    
    // Update title position
    title.position.set(dimensions.width / 2, 120 * dimensions.scale);
    title.style.fontSize = Math.min(48, dimensions.height * 0.08);
    
    // Update subtitle position
    subtitle.position.set(dimensions.width / 2, 200 * dimensions.scale);
    subtitle.style.fontSize = Math.min(16, dimensions.height * 0.03);
    
    // Update buttons positions
    const buttonSpacing = 60 * dimensions.scale;
    const startY = 300 * dimensions.scale;
    
    startButton.position.set(dimensions.width / 2 - startButton.width / 2, startY);
    mptionsButton.position.set(dimensions.width / 2 - mptionsButton.width / 2, startY + buttonSpacing);
    optionsButton.position.set(dimensions.width / 2 - optionsButton.width / 2, startY + buttonSpacing * 2);
    exitButton.position.set(dimensions.width / 2 - exitButton.width / 2, startY + buttonSpacing * 3);
    
    // Update cat position
    if (cat) {
        cat.position.set(dimensions.width - 150 * dimensions.scale, dimensions.height - 120 * dimensions.scale);
    }
    
    // Update trees positions
    trees.forEach((tree, index) => {
        const x = (150 + index * 200) * dimensions.scale;
        const y = dimensions.height - 180 * dimensions.scale;
        tree.position.set(x, y);
    });
    
    // Update fences positions
    fences.forEach((fence, index) => {
        const x = index * 100 * dimensions.scale;
        const y = dimensions.height - 80 * dimensions.scale;
        fence.position.set(x, y);
    });
});

// Create retro background with gradient
const background = new PIXI.Graphics();
background.beginFill(0x87CEEB);
background.drawRect(0, 0, gameConfig.width, gameConfig.height);
background.beginFill(0x6CA6CD);
background.drawRect(0, gameConfig.height / 2, gameConfig.width, gameConfig.height / 2);
app.stage.addChild(background);

// Add floating particles
function createParticles() {
    const particles = new PIXI.Container();
    for (let i = 0; i < 50; i++) {
        const particle = new PIXI.Graphics();
        particle.beginFill(0xFFFFFF);
        particle.drawRect(0, 0, 2, 2);
        particle.alpha = Math.random() * 0.5;
        particle.x = Math.random() * gameConfig.width;
        particle.y = Math.random() * gameConfig.height;
        particle.velocity = Math.random() * 0.5 + 0.1;
        particles.addChild(particle);
    }
    return particles;
}

const particles = createParticles();
app.stage.addChild(particles);

// Initialize audio manager
const audioManager = new AudioManager();

// Start background music when the game loads
window.addEventListener('click', () => {
    audioManager.startBGM();
}, { once: true });

// Setup sound control button
const soundControl = document.getElementById('sound-control');
soundControl.addEventListener('click', () => {
    const isMuted = audioManager.toggleMute();
    soundControl.classList.toggle('muted', isMuted);
});

// Button style with retro look
const buttonStyle = {
    fontFamily: 'Press Start 2P',
    fontSize: 20,
    fill: ['#FFFFFF'],
    stroke: '#000000',
    strokeThickness: 4,
    dropShadow: true,
    dropShadowColor: '#000000',
    dropShadowBlur: 0,
    dropShadowAngle: Math.PI / 6,
    dropShadowDistance: 4,
    padding: 10
};

// Create title with glowing effect
const title = new PIXI.Text('WHISKER QUEST', {
    fontFamily: 'Press Start 2P',
    fontSize: 48,
    fill: ['#FFD700', '#FFA500'],
    align: 'center',
    stroke: '#000000',
    strokeThickness: 6,
    dropShadow: true,
    dropShadowColor: '#000000',
    dropShadowBlur: 0,
    dropShadowAngle: Math.PI / 6,
    dropShadowDistance: 6
});
title.anchor.set(0.5);
title.position.set(gameConfig.width / 2, 120);
app.stage.addChild(title);

// Subtitle with retro effect
const subtitle = new PIXI.Text('A NEIGHBORHOOD GARDENS', {
    fontFamily: 'Press Start 2P',
    fontSize: 16,
    fill: ['#FFFFFF'],
    align: 'center',
    stroke: '#000000',
    strokeThickness: 4
});
subtitle.anchor.set(0.5);
subtitle.position.set(gameConfig.width / 2, 200);
app.stage.addChild(subtitle);

// Create modern retro button
function createButton(text, y) {
    const button = new PIXI.Container();
    const dimensions = getResponsiveDimensions();
    
    // Button background with gradient
    const buttonWidth = Math.min(250, dimensions.width * 0.8);
    const buttonHeight = Math.min(40, dimensions.height * 0.08);
    
    // Main button background
    const background = new PIXI.Graphics();
    background.lineStyle(2, 0x000000, 1);
    background.beginFill(0x4169E1);
    background.drawRect(0, 0, buttonWidth, buttonHeight);
    
    // Button shine effect
    const shine = new PIXI.Graphics();
    shine.beginFill(0xFFFFFF, 0.2);
    shine.drawRect(0, 0, buttonWidth, buttonHeight / 2);
    shine.alpha = 0.3;
    
    // Button text with responsive font size
    const buttonText = new PIXI.Text(text, {
        ...buttonStyle,
        fontSize: Math.min(20, dimensions.height * 0.04)
    });
    buttonText.anchor.set(0.5);
    buttonText.position.set(buttonWidth / 2, buttonHeight / 2);
    
    button.addChild(background);
    button.addChild(shine);
    button.addChild(buttonText);
    
    // Position the button
    button.position.set(dimensions.width / 2 - buttonWidth / 2, y);
    
    // Store button dimensions
    button.width = buttonWidth;
    button.height = buttonHeight;
    
    // Interactive properties
    button.eventMode = 'static';
    button.cursor = 'pointer';
    
    // Modern hover effects with sound
    button.on('pointerover', () => {
        background.tint = 0x5179F1;
        shine.alpha = 0.4;
        button.scale.set(1.02);
        buttonText.style.fill = '#FFFF00';
        audioManager.playSound('hover');
    });
    
    button.on('pointerout', () => {
        background.tint = 0xFFFFFF;
        shine.alpha = 0.3;
        button.scale.set(1);
        buttonText.style.fill = '#FFFFFF';
    });
    
    // Add click sound and handle both mouse and touch events
    const handleClick = () => {
        audioManager.playSound('click');
    };
    
    button.on('pointerdown', handleClick);
    button.on('pointerup', handleClick);
    button.on('pointerupoutside', handleClick);
    
    return button;
}

// Create menu buttons with better spacing
const startButton = createButton('START GAME', 300);
const mptionsButton = createButton('MPTIONS', 360);
const optionsButton = createButton('OPTIONS', 420);
const exitButton = createButton('EXIT', 480);

// Add buttons to stage
[startButton, mptionsButton, optionsButton, exitButton].forEach(button => {
    app.stage.addChild(button);
});

// Add background elements
const backgroundElements = new PIXI.Container();

// Add trees with improved design
function createTree(x, y) {
    const tree = new PIXI.Container();
    const pixelSize = 4;
    
    // Tree leaves with multiple shades
    const leaves = new PIXI.Graphics();
    const leafColors = [0x2E8B57, 0x228B22, 0x006400];
    
    const leafPattern = [
        [0,0,0,1,1,0,0,0],
        [0,0,1,2,2,1,0,0],
        [0,1,2,2,2,2,1,0],
        [1,2,2,2,2,2,2,1],
        [0,0,1,2,2,1,0,0],
        [0,1,2,2,2,2,1,0],
        [1,2,2,2,2,2,2,1],
    ];
    
    leafPattern.forEach((row, i) => {
        row.forEach((pixel, j) => {
            if (pixel > 0) {
                leaves.beginFill(leafColors[pixel - 1]);
                leaves.drawRect(j * pixelSize, i * pixelSize, pixelSize, pixelSize);
            }
        });
    });
    
    // Improved trunk with shading
    const trunk = new PIXI.Graphics();
    trunk.beginFill(0x8B4513);
    trunk.drawRect(3 * pixelSize, 7 * pixelSize, 2 * pixelSize, 4 * pixelSize);
    trunk.beginFill(0x654321);
    trunk.drawRect(4 * pixelSize, 7 * pixelSize, pixelSize, 4 * pixelSize);
    
    tree.addChild(trunk);
    tree.addChild(leaves);
    tree.position.set(x, y);
    return tree;
}

// Create improved fence
function createFence(x, y) {
    const fence = new PIXI.Graphics();
    const pixelSize = 4;
    
    // Main fence color
    fence.beginFill(0xDEB887);
    
    // Create fence posts with shading
    for (let i = 0; i < 4; i++) {
        // Vertical post with shading
        fence.drawRect(i * 6 * pixelSize, 0, pixelSize, 6 * pixelSize);
        fence.beginFill(0xD2B48C);
        fence.drawRect(i * 6 * pixelSize + pixelSize, 0, pixelSize/2, 6 * pixelSize);
        fence.beginFill(0xDEB887);
        
        // Top horizontal plank with shading
        fence.drawRect(i * 6 * pixelSize, pixelSize, 6 * pixelSize, pixelSize);
        fence.beginFill(0xD2B48C);
        fence.drawRect(i * 6 * pixelSize, pixelSize + pixelSize/2, 6 * pixelSize, pixelSize/2);
        fence.beginFill(0xDEB887);
        
        // Bottom horizontal plank with shading
        fence.drawRect(i * 6 * pixelSize, 4 * pixelSize, 6 * pixelSize, pixelSize);
        fence.beginFill(0xD2B48C);
        fence.drawRect(i * 6 * pixelSize, 4 * pixelSize + pixelSize/2, 6 * pixelSize, pixelSize/2);
    }
    
    fence.position.set(x, y);
    return fence;
}

// Add trees and fences
const trees = [
    createTree(150, gameConfig.height - 180),
    createTree(400, gameConfig.height - 200),
    createTree(600, gameConfig.height - 190),
    createTree(750, gameConfig.height - 185)
];

trees.forEach(tree => backgroundElements.addChild(tree));

// Add fences
const fences = [];
for (let x = 0; x < gameConfig.width; x += 100) {
    const fence = createFence(x, gameConfig.height - 80);
    fences.push(fence);
    backgroundElements.addChild(fence);
}

app.stage.addChild(backgroundElements);

// Create improved grass
function createGrass() {
    const grass = new PIXI.Graphics();
    
    // Multiple grass colors for better depth
    for (let x = 0; x < gameConfig.width / PIXEL_SIZE; x++) {
        const height = 10 + Math.sin(x * 0.5) * 5;
        for (let y = 0; y < height; y++) {
            const colorIndex = Math.floor(Math.random() * GRASS_COLORS.length);
            grass.beginFill(GRASS_COLORS[colorIndex]);
            grass.drawRect(x * PIXEL_SIZE, gameConfig.height - y * PIXEL_SIZE, PIXEL_SIZE, PIXEL_SIZE);
        }
    }
    
    return grass;
}

const grass = createGrass();
app.stage.addChild(grass);

// Create pixel art cat
function createCat() {
    const cat = new PIXI.Container();
    
    // Body
    const body = new PIXI.Graphics();
    
    // Main body (orange)
    body.beginFill(0xFFA500);
    const bodyPattern = [
        [0,0,1,1,1,1,0,0],
        [0,1,1,1,1,1,1,0],
        [1,1,1,1,1,1,1,1],
        [1,1,1,1,1,1,1,1],
        [1,1,1,1,1,1,1,1],
        [0,1,1,1,1,1,1,0],
        [0,0,1,1,1,1,0,0]
    ];
    
    bodyPattern.forEach((row, i) => {
        row.forEach((pixel, j) => {
            if (pixel) {
                body.drawRect(j * PIXEL_SIZE, i * PIXEL_SIZE, PIXEL_SIZE, PIXEL_SIZE);
            }
        });
    });
    
    // White chest patch
    body.beginFill(0xFFFFFF);
    body.drawRect(2 * PIXEL_SIZE, 3 * PIXEL_SIZE, 4 * PIXEL_SIZE, 3 * PIXEL_SIZE);
    
    // Face details
    const face = new PIXI.Graphics();
    
    // Eyes (white background)
    face.beginFill(0xFFFFFF);
    face.drawRect(1 * PIXEL_SIZE, 1 * PIXEL_SIZE, 2 * PIXEL_SIZE, 2 * PIXEL_SIZE);
    face.drawRect(5 * PIXEL_SIZE, 1 * PIXEL_SIZE, 2 * PIXEL_SIZE, 2 * PIXEL_SIZE);
    
    // Pupils (black)
    face.beginFill(0x000000);
    face.drawRect(2 * PIXEL_SIZE, 2 * PIXEL_SIZE, PIXEL_SIZE, PIXEL_SIZE);
    face.drawRect(6 * PIXEL_SIZE, 2 * PIXEL_SIZE, PIXEL_SIZE, PIXEL_SIZE);
    
    // Pink nose
    face.beginFill(0xFFC0CB);
    face.drawRect(3.5 * PIXEL_SIZE, 3 * PIXEL_SIZE, PIXEL_SIZE, PIXEL_SIZE);
    
    // Whiskers (white)
    face.lineStyle(1, 0xFFFFFF);
    // Left whiskers
    face.moveTo(2 * PIXEL_SIZE, 3.5 * PIXEL_SIZE);
    face.lineTo(0, 3 * PIXEL_SIZE);
    face.moveTo(2 * PIXEL_SIZE, 3.5 * PIXEL_SIZE);
    face.lineTo(0, 3.5 * PIXEL_SIZE);
    face.moveTo(2 * PIXEL_SIZE, 3.5 * PIXEL_SIZE);
    face.lineTo(0, 4 * PIXEL_SIZE);
    // Right whiskers
    face.moveTo(6 * PIXEL_SIZE, 3.5 * PIXEL_SIZE);
    face.lineTo(8 * PIXEL_SIZE, 3 * PIXEL_SIZE);
    face.moveTo(6 * PIXEL_SIZE, 3.5 * PIXEL_SIZE);
    face.lineTo(8 * PIXEL_SIZE, 3.5 * PIXEL_SIZE);
    face.moveTo(6 * PIXEL_SIZE, 3.5 * PIXEL_SIZE);
    face.lineTo(8 * PIXEL_SIZE, 4 * PIXEL_SIZE);
    
    // Ears
    const ears = new PIXI.Graphics();
    ears.beginFill(0xFFA500);
    // Left ear
    ears.drawRect(1 * PIXEL_SIZE, 0, 2 * PIXEL_SIZE, PIXEL_SIZE);
    ears.drawRect(0, -1 * PIXEL_SIZE, 2 * PIXEL_SIZE, PIXEL_SIZE);
    // Right ear
    ears.drawRect(5 * PIXEL_SIZE, 0, 2 * PIXEL_SIZE, PIXEL_SIZE);
    ears.drawRect(6 * PIXEL_SIZE, -1 * PIXEL_SIZE, 2 * PIXEL_SIZE, PIXEL_SIZE);
    
    // Inner ears (pink)
    ears.beginFill(0xFFC0CB);
    ears.drawRect(1 * PIXEL_SIZE, -0.5 * PIXEL_SIZE, PIXEL_SIZE, PIXEL_SIZE);
    ears.drawRect(6 * PIXEL_SIZE, -0.5 * PIXEL_SIZE, PIXEL_SIZE, PIXEL_SIZE);
    
    // Tail
    const tail = new PIXI.Graphics();
    tail.beginFill(0xFFA500);
    const tailPattern = [
        [1,1],
        [1,1],
        [1,1],
        [1,1],
        [1,0]
    ];
    
    tailPattern.forEach((row, i) => {
        row.forEach((pixel, j) => {
            if (pixel) {
                tail.drawRect(j * PIXEL_SIZE, i * PIXEL_SIZE, PIXEL_SIZE, PIXEL_SIZE);
            }
        });
    });
    
    // Add all parts to the cat container
    cat.addChild(body);
    cat.addChild(face);
    cat.addChild(ears);
    cat.addChild(tail);
    
    // Position the cat
    cat.position.set(gameConfig.width - 150, gameConfig.height - 120);
    
    // Add properties for animation
    cat.tailAngle = 0;
    cat.blinkTimer = 0;
    cat.isBlinking = false;
    cat.earWiggleTimer = 0;
    cat.isWigglingEars = false;
    cat.meowTimer = 0;
    cat.isMeowing = false;
    cat.isHappy = false;
    
    // Make cat interactive
    cat.eventMode = 'static';
    cat.cursor = 'pointer';
    
    // Add interaction handlers
    cat.on('pointerover', () => {
        cat.isHappy = true;
        if (audioManager) {
            audioManager.playSound('hover');
        }
    });
    
    cat.on('pointerout', () => {
        cat.isHappy = false;
    });
    
    cat.on('pointerdown', () => {
        cat.isMeowing = true;
        cat.meowTimer = 0;
        if (audioManager) {
            audioManager.playSound('click');
        }
    });
    
    return cat;
}

// Create and add cat to stage
const cat = createCat();
app.stage.addChild(cat);

// Animation loop with improved effects
app.ticker.add((delta) => {
    // Animate particles
    particles.children.forEach(particle => {
        particle.y -= particle.velocity;
        if (particle.y < 0) {
            particle.y = gameConfig.height;
            particle.x = Math.random() * gameConfig.width;
        }
    });
    
    // Title glow effect
    title.alpha = 0.8 + Math.sin(app.ticker.lastTime / 500) * 0.2;
    
    // Animate trees with improved movement
    trees.forEach((tree, index) => {
        tree.rotation = Math.sin(app.ticker.lastTime / 2000 + index) * 0.02;
    });
    
    // Button hover pulse effect
    [startButton, mptionsButton, optionsButton, exitButton].forEach(button => {
        if (button.isOver) {
            button.scale.x = 1.02 + Math.sin(app.ticker.lastTime / 200) * 0.01;
            button.scale.y = button.scale.x;
        }
    });
    
    // Animate cat
    if (cat) {
        // Gentle floating motion
        cat.y = gameConfig.height - 120 + Math.sin(app.ticker.lastTime / 1000) * 5;
        
        // Tail wagging (more energetic when happy)
        if (cat.children[3]) { // tail is the fourth child
            const tailSpeed = cat.isHappy ? 300 : 500;
            const tailAmplitude = cat.isHappy ? 0.4 : 0.2;
            cat.children[3].rotation = Math.sin(app.ticker.lastTime / tailSpeed) * tailAmplitude;
        }
        
        // Ear wiggling
        cat.earWiggleTimer += delta;
        if (cat.earWiggleTimer > 180 && !cat.isWigglingEars) { // Wiggle ears every 3 seconds
            cat.isWigglingEars = true;
            if (cat.children[2]) { // ears are the third child
                cat.children[2].rotation = 0.2;
            }
        } else if (cat.earWiggleTimer > 186) { // Reset ears after 6 frames
            cat.isWigglingEars = false;
            cat.earWiggleTimer = 0;
            if (cat.children[2]) {
                cat.children[2].rotation = 0;
            }
        }
        
        // Meowing animation
        if (cat.isMeowing) {
            cat.meowTimer += delta;
            if (cat.meowTimer < 10) { // Open mouth
                const face = cat.children[1];
                face.clear();
                // Redraw face with open mouth
                face.beginFill(0xFFFFFF);
                face.drawRect(1 * PIXEL_SIZE, 1 * PIXEL_SIZE, 2 * PIXEL_SIZE, 2 * PIXEL_SIZE);
                face.drawRect(5 * PIXEL_SIZE, 1 * PIXEL_SIZE, 2 * PIXEL_SIZE, 2 * PIXEL_SIZE);
                face.beginFill(0x000000);
                face.drawRect(2 * PIXEL_SIZE, 2 * PIXEL_SIZE, PIXEL_SIZE, PIXEL_SIZE);
                face.drawRect(6 * PIXEL_SIZE, 2 * PIXEL_SIZE, PIXEL_SIZE, PIXEL_SIZE);
                // Open mouth
                face.beginFill(0xFF69B4);
                face.drawRect(3 * PIXEL_SIZE, 4 * PIXEL_SIZE, 2 * PIXEL_SIZE, PIXEL_SIZE);
            } else if (cat.meowTimer > 20) { // Reset mouth
                cat.isMeowing = false;
                const face = cat.children[1];
                face.clear();
                // Redraw normal face
                face.beginFill(0xFFFFFF);
                face.drawRect(1 * PIXEL_SIZE, 1 * PIXEL_SIZE, 2 * PIXEL_SIZE, 2 * PIXEL_SIZE);
                face.drawRect(5 * PIXEL_SIZE, 1 * PIXEL_SIZE, 2 * PIXEL_SIZE, 2 * PIXEL_SIZE);
                face.beginFill(0x000000);
                face.drawRect(2 * PIXEL_SIZE, 2 * PIXEL_SIZE, PIXEL_SIZE, PIXEL_SIZE);
                face.drawRect(6 * PIXEL_SIZE, 2 * PIXEL_SIZE, PIXEL_SIZE, PIXEL_SIZE);
                face.beginFill(0xFFC0CB);
                face.drawRect(3.5 * PIXEL_SIZE, 3 * PIXEL_SIZE, PIXEL_SIZE, PIXEL_SIZE);
            }
        }
        
        // Blinking animation (modified to work with other animations)
        if (!cat.isMeowing) {
            cat.blinkTimer += delta;
            if (cat.blinkTimer > 120 && !cat.isBlinking) {
                cat.isBlinking = true;
                const face = cat.children[1];
                face.clear();
                // Redraw face with closed eyes
                face.beginFill(0x000000);
                face.drawRect(1 * PIXEL_SIZE, 2 * PIXEL_SIZE, 2 * PIXEL_SIZE, 1);
                face.drawRect(5 * PIXEL_SIZE, 2 * PIXEL_SIZE, 2 * PIXEL_SIZE, 1);
                // Keep nose
                face.beginFill(0xFFC0CB);
                face.drawRect(3.5 * PIXEL_SIZE, 3 * PIXEL_SIZE, PIXEL_SIZE, PIXEL_SIZE);
            } else if (cat.blinkTimer > 126) {
                cat.isBlinking = false;
                cat.blinkTimer = 0;
                const face = cat.children[1];
                face.clear();
                // Redraw normal face
                face.beginFill(0xFFFFFF);
                face.drawRect(1 * PIXEL_SIZE, 1 * PIXEL_SIZE, 2 * PIXEL_SIZE, 2 * PIXEL_SIZE);
                face.drawRect(5 * PIXEL_SIZE, 1 * PIXEL_SIZE, 2 * PIXEL_SIZE, 2 * PIXEL_SIZE);
                face.beginFill(0x000000);
                face.drawRect(2 * PIXEL_SIZE, 2 * PIXEL_SIZE, PIXEL_SIZE, PIXEL_SIZE);
                face.drawRect(6 * PIXEL_SIZE, 2 * PIXEL_SIZE, PIXEL_SIZE, PIXEL_SIZE);
                face.beginFill(0xFFC0CB);
                face.drawRect(3.5 * PIXEL_SIZE, 3 * PIXEL_SIZE, PIXEL_SIZE, PIXEL_SIZE);
            }
        }
        
        // Happy expression when hovered
        if (cat.isHappy && !cat.isBlinking && !cat.isMeowing) {
            const face = cat.children[1];
            face.clear();
            // Redraw happy face
            face.beginFill(0xFFFFFF);
            face.drawRect(1 * PIXEL_SIZE, 1 * PIXEL_SIZE, 2 * PIXEL_SIZE, 2 * PIXEL_SIZE);
            face.drawRect(5 * PIXEL_SIZE, 1 * PIXEL_SIZE, 2 * PIXEL_SIZE, 2 * PIXEL_SIZE);
            face.beginFill(0x000000);
            // Happy eyes (^ ^)
            face.drawRect(1 * PIXEL_SIZE, 2 * PIXEL_SIZE, 2 * PIXEL_SIZE, 1);
            face.drawRect(5 * PIXEL_SIZE, 2 * PIXEL_SIZE, 2 * PIXEL_SIZE, 1);
            // Pink nose
            face.beginFill(0xFFC0CB);
            face.drawRect(3.5 * PIXEL_SIZE, 3 * PIXEL_SIZE, PIXEL_SIZE, PIXEL_SIZE);
        }
    }
}); 