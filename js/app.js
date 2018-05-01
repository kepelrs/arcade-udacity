/**
* @description Enemies to avoid
* @constructor
* @param {integer} speedMultiplier - An integer which will determined the enemy's speed
*/
var Enemy = function(speedMultiplier) {
    // start outside the canvas
    this.x = -100;
    this.y = getRandomInt(1,5) * 83;
    // Random speed (in pixels per second) times provided multiplier (to support game getting harder)
    this.speed = speedMultiplier ? speedMultiplier * getRandomInt(25,50) : getRandomInt(25,50);
    this.sprite = 'images/enemy-bug.png';
    this.spirteSizeX = 101;
    // store how many enemies spawned in the player
    player.defeatedEnemies += 1;
};

// Update the enemy's position based on delta time
Enemy.prototype.update = function(dt) {
    this.x += dt * this.speed;
};

// Draw the enemy on the screen
Enemy.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};


/*
 * Player class
 */
var Player = function() {
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
    // total enemies spawned
    this.defeatedEnemies = 0;

};

// Check and update player state
Player.prototype.update = function() {
    var wasHit = this.checkIfHit();
    this.checkGameState(wasHit);
};

// Draw player to canvas
Player.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.positionX, this.positionY);
};

// Turn keyboard inputs into player movement, but restrict to canvas size
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

// Returns true if touching enemy, otherwhise false
Player.prototype.checkIfHit = function () {
    for (var i of allEnemies) {
        // skip enemies who are not in the same line as the player
        if (player.positionY !== i.y) {
            continue;
        }

         // skip if player position is completely outside of current enemy
        if (player.positionX + player.spirteSizeX + player.offsetRight < i.x ||
            player.positionX + player.offsetLeft > i.x + i.spirteSizeX) {
            continue;
        }

        // if above conditions are not true, return true (player is touching enemy)
        return true;
    }
    return false;
};

// Check if player was hit or reached the river
Player.prototype.checkGameState = function (wasHit) {
    // If player touched an enemy:
    if (wasHit) {
        gameOverMessage();

    // If player reached the river
    } else if (this.positionY === 0) {
        // prevent multiple level ups during game loop
        this.positionY = 1;

        // level up player
        this.levelUp();
    }
};

// Level up the player upon reaching river
Player.prototype.levelUp = function () {
    // store this player for later use
    var thisPlayer = this;

    thisPlayer.level += 1;

    // Allow player to see himself reaching the river
    setTimeout(function() {
        // reset position to the bottom-center
        thisPlayer.positionX = 2 * 101;
        thisPlayer.positionY = 5 * 83;
    }, 100);
};


/*
 * allEnemies: Enemies array.
 * Player object: player.
 */
var [allEnemies, player] = resetGame();



/*
 * Helper event listener for Player.handleInput() method.
 */
document.addEventListener('keyup', function(e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };

    player.handleInput(allowedKeys[e.keyCode]);
});

/*
 * Random integer function
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/random
 */
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
var modalPostgame = document.querySelector('.postgame');
var starScore = modalPostgame.querySelector('.star-score');
var moveScore = modalPostgame.querySelector('.move-score');
var enemyScore = modalPostgame.querySelector('.enemy-score');

function gameOverMessage() {
    modalPostgame.style.display = 'flex';
    starScore.innerHTML = `<li><i class="fa fa-star"></i></li>`.repeat(player.level - 1);
    moveScore.innerHTML = `You managed to reach the river ${player.level - 1} times.`;
    enemyScore.innerHTML = `You have also outsmarted ${player.defeatedEnemies} enemy bugs.`;
}

/*
 * Modal buttons behavior
 * Dismiss modal and restart game variables.
 */

var modalButtons = document.querySelectorAll('.modal-dismiss');

function resetGame() {
    player = new Player();
    allEnemies = [new Enemy(), new Enemy()];
    return [allEnemies, player];
}

// add event listener to all modal buttons
for (var btn of modalButtons) {

    btn.addEventListener('click', function(evt) {
        // dismiss modal
        var modal = evt.target.parentElement.parentElement;
        modal.style.display = 'none';

        // reset game
        resetGame();
    });
}
