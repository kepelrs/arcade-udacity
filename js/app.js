// Enemies our player must avoid
var Enemy = function(startRow, speedMultiplier) {
    this.x = -100;  // start off canvas
    this.y = startRow;
    // Random speed (in pixels per second) times provided multiplier (to support game getting harder)
    this.speed = speedMultiplier ? speedMultiplier * getRandomInt(25,50) : getRandomInt(25,50);
    this.sprite = 'images/enemy-bug.png';
};

// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function(dt) {
    // You should multiply any movement by the dt parameter
    // which will ensure the game runs at the same speed for
    // all computers.
    this.x += dt * this.speed;
    console.log(this.x);
};

// Draw the enemy on the screen, required method for game
Enemy.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

// Now write your own player class
// This class requires an update(), render() and
// a handleInput() method.
var Player = function(name) {
    this.level = 1;
    this.sprite = 'images/char-horn-girl.png';
    this.positionX = 2 * 101; // start at the bottom-center
    this.positionY = 5 * 83;
    this.maxX = 4 * 101;      // prevent player from leaving canvas
    this.maxY = 5 * 83;
};

Player.prototype.update = function() {
    // check if hit
    // check if win
    // delete if outside of canvas
};

Player.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.positionX, this.positionY);
};

Player.prototype.handleInput = function(userInput) {
    switch (userInput) {
        case 'up':
            this.positionY = this.positionY - 83 < 0 ? this.positionY : this.positionY - 83;
            break;
        case 'down':
            this.positionY = this.positionY + 83 > this.maxY ? this.positionY : this.positionY + 83;
            break;
        case 'left':
            this.positionX = this.positionX - 101 < 0 ? this.positionX : this.positionX - 101;
            break;
        case 'right':
            this.positionX = this.positionX + 101 > this.maxX ? this.positionX : this.positionX + 101;
            break;
    }
};


// Now instantiate your objects.
// Place all enemy objects in an array called allEnemies
var allEnemies = [new Enemy(60), new Enemy(300)];
// Place the player object in a variable called player
var player = new Player();



// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.
document.addEventListener('keyup', function(e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };

    player.handleInput(allowedKeys[e.keyCode]);
});

// Random integer function
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/random
function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min; //The maximum is exclusive and the minimum is inclusive
}
