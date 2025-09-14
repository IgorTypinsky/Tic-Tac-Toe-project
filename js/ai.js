import { NUMBER_OF_ROWS, NUMBER_OF_TILES, ROW_SIZE, cross, circle } from "./tic-tac-toe.js";
import { fields } from "./tic-tac-toe.js";
import { checkWin } from "./tic-tac-toe.js";

const FIRST_MOVE = 1;

export function countTakenFields(){
    let res = 0;
    fields.forEach(field  => {
        if(field.isTaken === true){
            res++;
        }
    })
    return res;
}

function fillTheField(tileIndex){
    const fieldObj = fields[tileIndex];
    const tileElement = document.querySelector(`.js-tile[data-tile-id="${tileIndex}"]`);

    tileElement.innerHTML = circle;
    fieldObj.isTaken = true;
    fieldObj.value = circle;
}

function continuePlaying(){
    let winningTile = checkWinningMove(circle);
    if(winningTile != null){
        fillTheField(winningTile);
        return;
    }
    winningTile = checkWinningMove(cross);
    if(winningTile != null){
        fillTheField(winningTile);
        return;
    }
    makeRandomMove();
}

function checkWinningMove(figure){

    let winningTile = null;
    let numberOfCrosses = 0;

    //sprawdzenie poziome
    for(let offset = 0; offset < NUMBER_OF_TILES; offset += ROW_SIZE){
        for(let i = offset; i < ROW_SIZE + offset; i++){
            if(fields[i].value === figure){
                numberOfCrosses++;
            }else if(fields[i].value === null){
                winningTile = i;
            }
        }
        if(numberOfCrosses === 2 && winningTile != null){
            return winningTile;
        }
        winningTile = null;
        numberOfCrosses = 0;
    }

    //sprawdzenie pionowe
    for(let offset = 0; offset < NUMBER_OF_ROWS; offset++){
        for(let i = offset; i < NUMBER_OF_TILES + offset; i += ROW_SIZE){
            if(fields[i].value === figure){
                numberOfCrosses++;
            }else if(fields[i].value === null){
                winningTile = i;
            }
        }
        if(numberOfCrosses === 2 && winningTile != null){
            return winningTile;
        }
        winningTile = null;
        numberOfCrosses = 0;
    }

    //sprawdzenie skośne
    for(let i = 2; i <= NUMBER_OF_ROWS * 2; i += 2){
       if(fields[i].value === figure){
                numberOfCrosses++;
            }else if(fields[i].value === null){
                winningTile = i;
            }
        }
        if(numberOfCrosses === 2 && winningTile != null){
            return winningTile;
        }
        winningTile = null;
        numberOfCrosses = 0; 
    
    for(let i = 0; i <= NUMBER_OF_TILES; i += 4){
       if(fields[i].value === figure){
                numberOfCrosses++;
            }else if(fields[i].value === null){
                winningTile = i;
            }
        }
        if(numberOfCrosses === 2 && winningTile != null){
            return winningTile;
        }
        winningTile = null;
        numberOfCrosses = 0; 

    return null;
}

function makeRandomMove(){
    const fieldsCopy = fields.filter((field) => !field.isTaken);
    const randomField = Math.floor(Math.random() * fieldsCopy.length);
    const fillingField = fieldsCopy[randomField].id;
    fillTheField(fillingField);
}

function findBestMove(){
    let bestScore = -Infinity;
    let bestField = null;
        for(let i = 0; i < NUMBER_OF_TILES; i++){
                if(!fields[i].isTaken){
                    fields[i].value = circle;
                    fields[i].isTaken = true;
                    let score = miniMax(fields, false);
                    fields[i].value = null;
                    fields[i].isTaken = false;
                    if(score > bestScore){
                        bestScore = score;
                        bestField = i;
                    }
            }
    }
    return bestField;
}

function miniMax(fields, isMaximizing){
    const res = checkWin();
    if(res === 'X'){
        return -1;
    }else if(res === 'O'){
        return 1;
    }else if(res === 'draw'){
        return 0;
    }

    if(isMaximizing){
        let bestScore = -Infinity;
        for(let i = 0; i < NUMBER_OF_TILES; i++){
                if(!fields[i].isTaken){
                    fields[i].value = circle;
                    fields[i].isTaken = true;
                    let score = miniMax(fields, false);
                    fields[i].value = null;
                    fields[i].isTaken = false;
                    if(score > bestScore){
                        bestScore = score;
                    }
                }
        }
        return bestScore;
    }else{
        let worstScore = Infinity;
        for(let i = 0; i < NUMBER_OF_TILES; i++){
                if(!fields[i].isTaken){
                    fields[i].value = cross;
                    fields[i].isTaken = true;
                    let score = miniMax(fields, true);
                    fields[i].value = null;
                    fields[i].isTaken = false;
                    if(score < worstScore){
                        worstScore = score;
                    } 
            }
        }
        return worstScore;
    }
}

export function makeComputerMove(){
    const decision = countTakenFields();
    const difficulty = document.getElementById("js-difficulty").value;
    switch(difficulty){
       case "Easy":
        makeRandomMove();
        break;
       case "Medium":
        if(decision === FIRST_MOVE)
            makeRandomMove();
        else
            continuePlaying();
        break;
        case "MiniMax":
        const bestField = findBestMove();
        document.querySelectorAll('.js-tile').forEach((field) => {
            if(parseInt(field.dataset.tileId) === bestField){
                field.innerHTML = circle;
                fields[bestField].value = circle;
                fields[bestField].isTaken = true;
            }
        });
        break;
    }
}