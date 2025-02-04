const canvas = document.getElementById('gameCanvas'); // Get the canvas element
const ctx = canvas.getContext('2d'); // Get the 2D context of the canvas

const mapSize = 10000; // Size of the map
const framesPerSecond = 60; // Frames per second

let stars = []; // Array to hold the star objects for the background
let playerList = []; // List of players
let keysPressed = {};// Object to keep track of the keys that are currently pressed

class Player { // Player class
    constructor() { // Constructor
        this.x = window.innerWidth / 2; // X position
        this.y = window.innerHeight / 2; // Y position
        this.pX = 0; // X position on the map
        this.pY = 0; // Y position on the map
        this.size = 10; // Size
        this.color = 'red'; // Color
        playerList.push(this); // Add the player to the list of players
        console.log(playerList); // Log the list of players
    }

    draw() { // Function to draw the player
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
    }
}

const mainPlayer = new Player(); // Create a new player

const baseSpeed = 1.2; // Base speed of the player
var speed = baseSpeed; // Speed of the player
var diagonalSpeed = speed / Math.sqrt(2); // Speed for diagonal movement

// Listen for keydown events to track which keys are pressed
document.addEventListener('keydown', function(event) {
    if (event.key === ' ') { // Check if the spacebar is pressed
        event.preventDefault(); // Prevent default behavior (scrolling)
        keysPressed['Space'] = true; // Mark the spacebar as pressed
    } else {
        keysPressed[event.key] = true; // Mark the key as pressed in the keysPressed object
    }
});

// Listen for keyup events to track which keys are released
document.addEventListener('keyup', function(event) {
    if (event.key === ' ') { // Check if the spacebar is released
        keysPressed['Space'] = false; // Mark the spacebar as released
    } else {
        delete keysPressed[event.key]; // Remove the key from the keysPressed object
    }
});

function isUp() {
    return keysPressed['w'] && mainPlayer.pY < mapSize;
}
function isDown() {
    return keysPressed['s'] && mainPlayer.pY > -mapSize;
}
function isLeft() {
    return keysPressed['a'] && mainPlayer.pX > -mapSize;
}
function isRight() {
    return keysPressed['d'] && mainPlayer.pX < mapSize;
}
function movePlayer() { // Function to move the player
    if (isUp() && isLeft()) {
        mainPlayer.pY -= diagonalSpeed; // Move up-left diagonally
        mainPlayer.pX -= diagonalSpeed;
    } else 
    if (isUp() && isRight()) {
        mainPlayer.pY -= diagonalSpeed; // Move up-right diagonally
        mainPlayer.pX += diagonalSpeed;
    } else 
    if (isDown() && isLeft()) {
        mainPlayer.pY += diagonalSpeed; // Move down-left diagonally
        mainPlayer.pX -= diagonalSpeed;
    } else 
    if (isDown() && isRight()) {
        mainPlayer.pY += diagonalSpeed; // Move down-right diagonally
        mainPlayer.pX += diagonalSpeed;
    } else {
        if (isUp()) {
            mainPlayer.pY -= speed; // Move the player up
        }
        if (isDown()) {
            mainPlayer.pY += speed; // Move the player down
        }
        if (isLeft()) {
            mainPlayer.pX -= speed; // Move the player left
        }
        if (isRight()) {
            mainPlayer.pX += speed; // Move the player right
        }
    }
    if (keysPressed['Space']) {
        speed = baseSpeed * 2; // Speed the player up by two times when Space is pressed
        diagonalSpeed = speed / Math.sqrt(2)
    } else {
        speed = baseSpeed;
        diagonalSpeed = speed / Math.sqrt(2)
    }
}

function drawPlayers() { // Function to draw the players
    for (let i = 0; i < playerList.length; i++) { // Loop through the list of players
        playerList[i].draw(); // Draw the players
    }
}

// Function to generate the stars
function generateStars() { // Function to generate stars
    stars = []; // Clear the stars array
    for (let i = 0; i < 300; i++) { // Loop through 300 times
        stars.push({ // Push a new star object to the stars array
            x: Math.random() * window.innerWidth, // Random x-coordinate
            y: Math.random() * window.innerHeight, // Random y-coordinate
            size: Math.random() * 2 // Random size between 0 and 2
        });
    }
}

// Function to draw the stars on the canvas
function drawStars() {
    ctx.fillStyle = 'white'; // Set star color to white
    stars.forEach(star => {
        // Calculate relative positions, wrapping correctly for negative values
        let starX = (star.x - mainPlayer.pX * star.size) % canvas.width;
        let starY = (star.y - mainPlayer.pY * star.size) % canvas.height;

        // Correct for negative values to ensure proper wrapping
        if (starX < 0) starX += canvas.width;
        if (starY < 0) starY += canvas.height;

        ctx.beginPath(); // Start a new drawing path
        ctx.arc(starX, starY, star.size, 0, 2 * Math.PI); // Draw the star
        ctx.fill(); // Fill the star with white color
    });
}

function onRezisingWindow() { // Function to update the size of the canvas and components
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    mainPlayer.x = window.innerWidth / 2;
    mainPlayer.y = window.innerHeight / 2;
    generateStars(); // Generate new stars
}

function draw() { // Function to draw the content on the canvas
    // Clear the canvas before drawing new content
    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    drawPlayers(); // Draw the player
    drawStars(); // Draw the stars
}

function main() { // Main loop
    // Game loop
    draw(); // Draw the content on the canvas
    movePlayer(); // Move the player
    requestAnimFrame(main); // Call the main loop function again after the frame is drawn to update the animation
}

window.onload = function() { // When the window loads - start the main loop
    main();
    onRezisingWindow(); // Initialize the canvas and components
}

window.requestAnimFrame = (function(callback) {
    return window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame ||
    function(callback) {
      window.setTimeout(callback, 1000 / framesPerSecond);
    };
})();

window.addEventListener('resize', function() { // When the window is resized
    onRezisingWindow(); // /fitting Canvas size and stars to size
});

requestAnimFrame(function() {
    main();
});