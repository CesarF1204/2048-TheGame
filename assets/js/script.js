let board;
let score       = 0;
let rows        = 4;
let columns     = 4;
let is2048Exist = false;
let is4096Exist = false;
let is8192Exist = false;

let start_x = 0;
let start_y = 0;

/* Function to set the game board. */
setGame = () => {
    board = [
        [0,0,0,0],
        [0,0,0,0],
        [0,0,0,0],
        [0,0,0,0]
    ];

    for(let row_index = 0; row_index < rows; row_index++){
        for(let column_index = 0; column_index < columns; column_index++){
            
            /* Creating a div element representing tile */
            let tile = document.createElement("div");

            /* Set a unique identifier */
            tile.id = row_index.toString() + "-" + column_index.toString();

            /* Board is currently set to 0 */
            let num = board[row_index][column_index];

            /* Update the tile's appearance based on the num value */
            updateTile(tile, num);

            /* Append the tile to the gameboard container */
            document.getElementById("board").append(tile);
        }
    }

    /* Random tile */
    setTwo();
    setTwo();
};

/* Function to update the tile */
updateTile = (tile, num) => {
    /* Clear the tile content */
    tile.innerText = "";

    /* Clear the classList to avoid multiple classes */
    tile.classList.value = "";

    /* Add a class named "tile" */
    tile.classList.add("tile");

    /* This will check for the "num" parameter and will apply specific styling based on the number value. If num is positive, the number is converted to a string and placed inside the tile as text. */
    if(num > 0) {
        /* Set the tile's text to the number based on the num value. */
        tile.innerText = num.toString();
        /* If num is less than or equal to 4096, a class based on the number is added to the tile's classlist. */
        if(num <= 4096){
            tile.classList.add("x"+num.toString());
        }
        else{
            /* If num is greater than 4096, a special  class "x8192" is added. */
            tile.classList.add("x8192");
        }
    }
}

/* Call setGame function on windows onload */
window.onload = function(){
    setGame();
}

/* Create function for event listeners */
handleSlide = (e) => {
    let keystrokes = ["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown"];

    if(keystrokes.includes(e.code)){
        e.preventDefault();
        
        if(e.code === "ArrowLeft"){
            slideLeft();
            setTwo();
        }
        else if(e.code === "ArrowRight"){
            slideRight();
            setTwo();
        }
        else if(e.code === "ArrowUp"){
            slideUp();
            setTwo();;
        }
        else if(e.code === "ArrowDown"){
            slideDown();
            setTwo();
        }
        else {
            throw Error;
        }
    }

    document.getElementById("score").innerText = score;

    checkWin();

    if(hasLost()){
        // Use setTimeout to delay the alert
        setTimeout(() => {
            alert("Game Over! You have lost the game. Game will restart");
            restartGame();
            alert("Click any arrow key to restart");
            // You may want to reset the game or perform other actions when the user loses.
        }, 100); // Adjust the delay time (in milliseconds) as needed
    }

}

/* Add an evenlistener on handleSlide function  */
document.addEventListener("keydown", handleSlide);

/* Function to filter the zeroes on tile */
filterZero = (row) => {
    /* Removing of empty tiles */
    return row.filter(num => num != 0);
}

/* Core function for sliding and merging of tiles(adjacent tile) in a row. */
slide = (row) => {
    /* Get rid of zero tiles */
    row = filterZero(row);

    /* Check for adjacent equal numbers */
    for(let index = 0; index < row.length - 1; index++){
        if(row[index] === row[index+1]){
            /* Double the first element */
            row[index] *= 2;

            /* Set the second one to 0 */
            row[index+1] = 0;

            /* Logic for scoring */
            score += row[index];
        }
    }

    /* Get rid again of zero tiles */
    row = filterZero(row);

    /* Add zeroes back */
    while(row.length < columns){
        row.push(0);
    }

    return row;
}

/* Function to merge tile when left key is pressed. */
slideLeft = () => {
    /* Iterate through each row */
    for(let row_index = 0; row_index < rows; row_index++){
        let row = board[row_index];
        let original_row = row.slice();

        /* Call the slide function to merge similar tiles */
        row = slide(row);

        /* Updated value in the board */
        board[row_index] = row;

        for(let column_index = 0; column_index < columns; column_index++){
            let tile = document.getElementById(row_index.toString() + "-" + column_index.toString())
            let num = board[row_index][column_index];

            /* Logic for animation */
            if((original_row[column_index] !== num) && (num !== 0)){
                tile.style.animation = "slide-from-right 0.3s";

                setTimeout(() => {
                    tile.style.animation = "";
                }, 300);
            }
            
            updateTile(tile, num);
        }
    }
}

/* Function to merge tile when right key is pressed. */
slideRight = () => {
    /* Iterate through each row */
    for(let row_index = 0; row_index < rows; row_index++){
        let row = board[row_index];
        let original_row = row.slice();

        /* Reverse the order of the row, mirrored version of slideLeft */
        row.reverse();
        
        /* Call the slide function to merge similar tiles */
        row = slide(row);

        /* Reverse the order of the row, mirrored version of slideLeft */
        row.reverse();

        /* Updated value in the board */
        board[row_index] = row;

        for(let column_index = 0; column_index < columns; column_index++){
            let tile = document.getElementById(row_index.toString() + "-" + column_index.toString())
            let num = board[row_index][column_index];

            /* Logic for animation */
            if((original_row[column_index] !== num) && (num !== 0)){
                tile.style.animation = "slide-from-left 0.3s";

                setTimeout(() => {
                    tile.style.animation = "";
                }, 300);
            }
            
            updateTile(tile, num);
        }
    }
}

/* Function to merge tile when up key is pressed. */
slideUp = () => {
    /* Iterate through each row */
    for(let column_index = 0; column_index < columns; column_index++){

        /* Create a temporary array call row that represents a column from top to bottom */
        let row = [ board[0][column_index], board[1][column_index], board[2][column_index], board[3][column_index] ];
        let original_row = row.slice();

        /* Call the slide function to merge similar tiles */
        row = slide(row);

        /* Check which tiles have changed in column */
        let changed_indeces = [];

        // for(let row_index = 0; row_index < rows; row_index++){
            
        //     /* This will record the current position of tiles that have changed. */
        //     if(original_row[row_index] !== row[row_index]){
        //         changed_indeces.push(row_index);
        //     }
        // }

        for(let row_index = 0; row_index < rows; row_index++){
            
            /* This will record the current position of tiles that have changed. */
            if(original_row[row_index] !== row[row_index]){
                changed_indeces.push(row_index);
            }

            board[row_index][column_index] = row[row_index];

            let tile = document.getElementById(row_index.toString() + "-" + column_index.toString())
            let num = board[row_index][column_index];

            /* Logic for animation */
            if((changed_indeces.includes(row_index)) && (num !== 0)){
                tile.style.animation = "slide-from-bottom 0.3s";

                setTimeout(() => {
                    tile.style.animation = "";
                }, 300);
            }
            
            updateTile(tile, num);
        }
    }
}

/* Function to merge tile when down key is pressed. */
slideDown = () => {
    /* Iterate through each row */
    for(let column_index = 0; column_index < columns; column_index++){

        /* Create a temporary array call row that represents a column from top to bottom */
        let row = [ board[0][column_index], board[1][column_index], board[2][column_index], board[3][column_index] ];
        let original_row = row.slice();
        
        row.reverse();

        /* Call the slide function to merge similar tiles */
        row = slide(row);

        row.reverse();

        let changed_indeces = [];

        for(let row_index = 0; row_index < rows; row_index++){
            /* This will record the current position of tiles that have changed. */
            if(original_row[row_index] !== row[row_index]){
                changed_indeces.push(row_index);
            }

            board[row_index][column_index] = row[row_index];

            let tile = document.getElementById(row_index.toString() + "-" + column_index.toString())
            let num = board[row_index][column_index];

            /* Logic for animation */
            if((changed_indeces.includes(row_index)) && (num !== 0)){
                tile.style.animation = "slide-from-top 0.3s";

                setTimeout(() => {
                    tile.style.animation = "";
                }, 300);
            }
            
            updateTile(tile, num);
        }
    }
}

/* Function that will check if tile is empty */
hasEmptyTile = () => {
    for(let row_index = 0; row_index < rows; row_index++){
        for(let column_index = 0; column_index < columns; column_index++){
            
            /* Check if current tile is 0 */
            if(board[row_index][column_index] === 0){
                return true;
            }
        }
    }
    /* There is no tile with 0 value */
    return false;
}

/* Function that will add a new random 2 tiles in the game board */
setTwo = () => {
    /* Check if hasEmptyTile is false */
    if(!hasEmptyTile()){
        return;
    }

    /* Declare found_tile current value to false */
    let found_tile = false;

    while(!found_tile){
        let random_row = Math.floor(Math.random() * rows);
        let random_column = Math.floor(Math.random() * columns);

        /* Check if the position (row_index, column_index) in the game board is empty */
        if(board[random_row][random_column] === 0){
            board[random_row][random_column] = 2;

            let tile = document.getElementById(random_row.toString() + "-" + random_column.toString())
            tile.innerText = "2";
            tile.classList.add("x2");

            /* Empty tile found, then it will skip the loop */
            found_tile = true;
        }
    }
}

/* Function to check if the user's score reach the designated score to win. */
checkWin = () => {
    // iterate through the board
    for(let row_index = 0; row_index < rows; row_index++){
        for(let column_index = 0; column_index < columns; column_index++){
            // check if current tile == 2048 and is2048Exist == false
            if(board[row_index][column_index] == 2048 && is2048Exist == false){
                alert('You Win! You got the 2048');  // If true, alert and  
                is2048Exist = true;     // reassigned the value of is2048Exist to true to avoid continuous appearance of alert.
            } else if(board[row_index][column_index] == 4096 && is4096Exist == false) {
                alert("You are unstoppable at 4096! You are fantastically unstoppable!");
                is4096Exist = true;     // reassigned the value of is4096Exist to true to avoid continuous appearance of alert.
            } else if(board[row_index][column_index] == 8192 && is8192Exist == false) {
                alert("Victory!: You have reached 8192! You are incredibly awesome!");
                is8192Exist = true;    // reassigned the value of is8192Exist to true to avoid continuous appearance of alert.
            }
        }
    }
}

/* Function to check if the user's has lost the game. */
hasLost = () => {
    // Check if the board is full
    for (let row_index = 0; row_index < rows; row_index++) {
        for (let column_index = 0; column_index < columns; column_index++) {
            if (board[row_index][column_index] === 0) {
                // Found an empty tile, user has not lost
                return false;
            }

            const currentTile = board[row_index][column_index];

            // Check adjacent cells (up, down, left, right) for possible merge
            if (
                row_index > 0 && board[row_index - 1][column_index] === currentTile ||
                row_index < rows - 1 && board[row_index + 1][column_index] === currentTile ||
                column_index > 0 && board[row_index][column_index - 1] === currentTile ||
                column_index < columns - 1 && board[row_index][column_index + 1] === currentTile
            ) {
                // Found adjacent cells with the same value, user has not lost
                return false;
            }
        }
    }

    // No possible moves left or empty tiles, user has lost
    return true;
}

/* Function to restart the game */
restartGame = () => {
    for(let row_index = 0; row_index < rows; row_index++){
        for(let column_index = 0; column_index < columns; column_index++){
            board[row_index][column_index] = 0;
        }
    }
    score = 0;
    setTwo();
}

/* Mobile Compatibility */
/* Capture the coordinates of the touch input */
document.addEventListener('touchstart', (e) => {
    start_x = e.touches[0].clientX;
    start_y = e.touches[0].clientY;
});

/* Prevents scrolling if touch input is received. */
document.addEventListener('touchmove', (e) => {
    if(!e.target.className.includes("tile")){
        return;
    }

    /* Disable the line scrolling */
    e.preventDefault();
}, {passive: false});

/* Listen for the touchend event in the entire document */
document.addEventListener('touchend', (e) => {

    /* Check if the element tgrigged the event has a classname tile */
    if(!e.target.className.includes("tile")){
        return;
    }

    /* Calculate the horizontal and vertical difference between the initial position and final position. */
    let diff_x = start_x - e.changedTouches[0].clientX;
    let diff_y = start_y - e.changedTouches[0].clientY;

    /* Check if horizontal swipe is greater than magnitude than the vertical swipe. */
    if(Math.abs(diff_x) > Math.abs(diff_y)){
        if(diff_x > 0){
            slideLeft();
            setTwo();
        }
        else{
            slideRight();
            setTwo();
        }
        
    }
    else{
        if(diff_y > 0){
            slideUp();
            setTwo();
        }
        else{
            slideDown();
            setTwo();
        }
    }

    document.getElementById("score").innerText = score;

    checkWin();

    if(hasLost()){
        // Use setTimeout to delay the alert
        setTimeout(() => {
            alert("Game Over! You have lost the game. Game will restart");
            restartGame();
            alert("Click any arrow key to restart");
            // You may want to reset the game or perform other actions when the user loses.
        }, 100); // Adjust the delay time (in milliseconds) as needed
    }
});