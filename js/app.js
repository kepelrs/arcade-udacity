// Enemies our player must avoid
var Enemy = function(startRow, speedMultiplier) {
    this.x = -100;  // start off canvas
    this.y = startRow;
    // Random speed (in pixels per second) times provided multiplier (to support game getting harder)
    this.speed = speedMultiplier ? speedMultiplier * getRandomInt(25,50) : getRandomInt(25,50);
    this.sprite = 'images/enemy-bug.png';
    this.spirteSizeX = 101;
};

// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function(dt) {
    // You should multiply any movement by the dt parameter
    // which will ensure the game runs at the same speed for
    // all computers.
    this.x += dt * this.speed;
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
    this.spirteSizeX = 101;
    // start at the bottom-center
    this.positionX = 2 * 101;
    this.positionY = 5 * 83;
    // prevent player from leaving canvas
    this.maxX = 4 * 101;
    this.maxY = 5 * 83;
    // sprite hit box
    this.offsetLeft = +24;
    this.offsetRight = -23;

};

Player.prototype.update = function() {
    var wasHit = this.checkIfHit();
    this.checkGameOver(wasHit);
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

// returns true if touching enemy, otherwhise false
Player.prototype.checkIfHit = function () {
    for (let i of allEnemies) {
        // skip enemies who are not in the same line as the player
        if (player.positionY !== i.y) {
            continue;
        }

         // player if player position is completely outside of current enemy
        if (player.positionX + player.spirteSizeX + player.offsetRight < i.x ||
            player.positionX + player.offsetLeft > i.x + i.spirteSizeX) {
            continue;
        }

        // if above conditions are not true, return true (player is touching enemy)
        return true;
    }
    return false;
};

// check if player was hit or reached the river
Player.prototype.checkGameOver = function (wasHit) {
    if (wasHit || this.positionY === 0) {
        gameOverMessage();
    }
};

// Now instantiate your objects.
// Place all enemy objects in an array called allEnemies
var allEnemies = [new Enemy(83), new Enemy(83*4)];
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

/*
 * Game over message
 * This function opens the game over modal (class='postgame').
 * It also handles displaying the final score
*/
const modalPostgame = document.querySelector('.postgame');
const starScore = modalPostgame.querySelector('.star-score');
const moveScore = modalPostgame.querySelector('.move-score');
const timerScore = modalPostgame.querySelector('.timer-score');

function gameOverMessage() {
    modalPostgame.style.display = 'flex';
    starScore.innerHTML = `<li><i class="fa fa-star"></i></li>`.repeat(2);
    moveScore.innerHTML = `You finished the game in just ${undefined} moves.`;
    timerScore.innerHTML = `Your total time was ${undefined}.`;
}

// Modal buttons behavior
// dismiss modal button behavior
const dismissBtns = document.querySelectorAll('.modal-dismiss');

for (let btn of dismissBtns) {

    btn.addEventListener('click', function(evt) {
        let modal = evt.target.parentElement.parentElement;

        modal.style.display = 'none';
    });
}
