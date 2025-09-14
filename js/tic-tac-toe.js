import { makeComputerMove, countTakenFields } from "./ai.js";

export const NUMBER_OF_TILES = 9;
export const NUMBER_OF_ROWS = 3;
export const ROW_SIZE = 3;

export let gameEnded = false;

export let fields = [];

export const cross = '<img src="photos/swords.png" class="swords">';
export const circle = '<img src="photos/shield.png" class="shield">';

let score = JSON.parse(localStorage.getItem('score'));
let enableMove = true;

if(!score){
    score = {
        Wins: 0,
        Ties: 0,
        Loses: 0
    }
}

setupGame();

function updateScore(){
    const Wins = document.querySelector('.js-wins');
    const Ties = document.querySelector('.js-ties');
    const Loses = document.querySelector('.js-loses');

    Wins.innerHTML = score.Wins;
    Ties.innerHTML = score.Ties;
    Loses.innerHTML = score.Loses;
    localStorage.setItem('score', JSON.stringify(score));
}


function setupGame(){
    for(let i = 0; i < NUMBER_OF_TILES; i++){
        fields.push({
            id: i,
            isTaken: false,
            value: null
        })
    }
    document.querySelectorAll('.js-tile').forEach((tile, index) => {
        tile.setAttribute('data-tile-id', `${index}`);
        tile.classList.add(`tile${index}`);
    });

    updateScore();

    document.querySelectorAll('.js-tile').forEach((tile) => {
        let id = tile.dataset.tileId;
        tile.addEventListener("click", () => {
            makeMove(id, tile);
        });
    })

    document.querySelector('.js-restart').addEventListener("click", () => {
        resetGame();
    })
}


function makeMove(id, tile){
    if(!fields[id].isTaken && !gameEnded && enableMove){
        enableMove = false; 
        let figure = countTakenFields()%2 === 0 ? cross : circle;
        fields[id].value = figure;
        fields[id].isTaken = true;
        tile.innerHTML = figure;
        
        let res = checkWin();
        if(res)
            endGame(res);
        if(!gameEnded){
            setTimeout(() => {
                makeComputerMove();
                res = checkWin();
                if(res){
                    endGame(res);
                }
                enableMove = true;
        }, 300);
        }
    }
}

export function checkWin(){
    let res = null;
    let winner = null;
    //sprawdzenie poziome
    for(let offset = 0; offset < NUMBER_OF_TILES; offset += ROW_SIZE){
        if(fields[offset + 0].value === fields[offset + 1].value && fields[offset + 0].value
             === fields[offset + 2].value && fields[offset + 0].value !== null){
            winner = true;
            res = fields[offset + 0].value === cross ? 'X' : 'O';
        }
    }
    //sprawdzenie pionowe
    for(let offset = 0; offset < NUMBER_OF_ROWS; offset++){
        if(fields[offset + 0].value === fields[offset + 3].value && fields[offset + 0].value
             === fields[offset + 6].value && fields[offset + 0].value !== null){
            winner = true;
            res = fields[offset + 0].value === cross ? 'X' : 'O';
        }
    }
    //sprawdzenie skośne
    if(fields[0].value === fields[4].value && fields[0].value === fields[8].value && fields[0].value !== null){
        winner = true;
        res = fields[0].value === cross ? 'X' : 'O';
    }
    if(fields[2].value === fields[4].value && fields[2].value === fields[6].value && fields[2].value !== null){
        winner = true;
        res = fields[2].value === cross ? 'X' : 'O';
    }

    if(checkDraw() && !winner) res = 'draw';
    
    return res;
}

function endGame(res){
    if(!res) return;
    const result = document.querySelector('.js-result');

    result.classList.add("result-visible");
    if(res === 'X'){
        result.innerHTML = "You Win!";
        result.classList.add("win");
        score.Wins++;
        enableMove = true;
    }else if(res === 'O'){
        result.innerHTML = "You Lose!";
        result.classList.add("lose");
        score.Loses++;
    }else if(res === 'draw'){
        result.innerHTML = "Draw!";
        result.classList.add("draw");
        score.Ties++;
        enableMove = true;
    }
    gameEnded = true;
    updateScore();
    
}

export function checkDraw(){
    for(let i = 0; i < NUMBER_OF_TILES; i++){
        if(fields[i].value === null){
            return false;
        }
    }
    return true;
}

function resetGame(){
    if(!enableMove) return;
    
    for(let i = 0; i < NUMBER_OF_TILES; i++){
        fields[i].value = null;
        fields[i].isTaken = false;
    }
    document.querySelectorAll('.js-tile').forEach(tile => {
        tile.innerHTML = '';
    });
    gameEnded = false;
    const result = document.querySelector('.js-result');
    result.innerHTML = "_";
    result.classList.remove('result-visible', 'win', 'draw', 'lose');
    
    enableMove = true;
}