//Initialize the game board
let board = [
  ['', '', ''],
  ['', '', ''],
  ['', '', '']
];

//Create two players. The first player is always the X
let p = ['X', 'O'];
let currentPlayer;
let human_player = p[1];
let AI_player = p[0];

//List of available spots
let available = [];

function setup() {
  createCanvas(400, 400);
  //frameRate(1);
  
 
  //Let AI start first
  currentPlayer = AI_player;
  //Fill the available list with all coordinates [i,j] of all board tiles
  for(let i = 0; i < 3; i++)
    {
      for(let j = 0; j < 3; j++)
        {
          if(board[i][j] == '')
            available.push([i, j]);
        }
    }  
}

function equalTrio(a, b, c)
{
  return a == b && b == c && a != '';
}

/*
Helps find the index of the coordinates to a spot on the grid, since
array.indexOf() would always return -1 (element not found)
*/
function indexHelper(nestedArray, subArray)
{
  for(let i = 0; i < nestedArray.length; i++)
    {
      if(nestedArray[i][0] == subArray[0] && nestedArray[i][1] == subArray[1])
        return i;     
    }
  return -1;
}

function checkWinner(drawVictor)
{
  let winner = null;
  //These offsets will help draw a line across the board whenever there is a winner
  let centerWidth = width/6;
  let centerHeight = height/6;
  strokeWeight(10);
  
  //Check for horizontal wincon
  for(let i = 0; i < 3; i++)
    {
      if(equalTrio(board[i][0], board[i][1], board[i][2]) )
        {
          winner = board[i][0];
          if(drawVictor)
            line(centerWidth, height * (i/3) + centerHeight, width - centerWidth, height * (i/3) + centerHeight);
        }
    }
  
  //Vertical wincon
  for(let j = 0; j < 3; j++)
    {
      if(equalTrio(board[0][j], board[1][j], board[2][j]))
        {
          winner = board[0][j];
          if(drawVictor)
            line(width * (j/3) + centerWidth, centerHeight, width * (j/3) + centerWidth, height - centerHeight);
        }
    }
  
  //Diagonal wincon
  if(equalTrio(board[0][0], board[1][1], board[2][2]))
    {
      winner = board[0][0];
      if(drawVictor)
        line(centerWidth, centerHeight, width - centerWidth, height - centerHeight);
    }
  else if(equalTrio(board[2][0], board[1][1], board [0][2]))
    {
      winner = board[2][0];
      if(drawVictor)
        line(centerWidth, height - centerHeight, width - centerWidth, centerHeight);
    }
  
  if(winner == null && available.length == 0)
  {
    return 'tie';
  }
  else
    {
      return winner;
    }
}

function nextTurn()
{   
  if(currentPlayer == human_player) return;
  
  //AI makes turn
 //Choose a random coordinate from the available list and "pop" it
  let index = floor(random(available.length));
  let coordinate = available.splice(index, 1)[0];
  let i = coordinate[0];
  let j = coordinate[1];
  
  //Fill the empty tile and pass the turn to the human player
  board[i][j] = AI_player;
  currentPlayer = human_player;
}



function mousePressed()
{
  console.log(available);
  //Human makes turn
  let W = width/3;
  let H = height/3;
  if(currentPlayer == human_player)
    {
      let xcoordinate = floor(mouseX/W);
      let ycoordinate = floor(mouseY/W);
      
      //Update the available list and fill the tile with a circle
      if(board[ycoordinate][xcoordinate] == '')
        {
          let index = indexHelper(available, [ycoordinate, xcoordinate]);
          let coordinate = available.splice(index, 1)[0];                   
          board[ycoordinate][xcoordinate] = human_player;
          
          //Pass the turn to the AI
          if(checkWinner() == null)
            currentPlayer = AI_player;       
        }
    }   
}

//Let p5 draw what's in the board at any given moment
function draw() {
  background(220);
  strokeWeight(4); 
  
  //W represents each third of the width of the canvas
  let W = width/3;
  //H represents each third of the height of the canvas
  let H = height/3;
  
  //Draw grid  
  line(W, 0, W, height);
  line(2*W, 0, 2*W, height);
  line(0, H, width, H);
  line(0, 2*H, width, 2*H);
  
  
  
  //Take a turn
  //nextTurn();
  minimaxTurn(board, available, 0, true);
  
  //Visually update board by printing
  for(let i = 0; i < 3; i++)
    {
      for(let j = 0; j < 3; j++)
        {
          let x = W * j + W/2;
          let y = H * i + H/2;          
          let boardTile = board[i][j];          
                   
          if(boardTile == p[0])
            {
              let xsize = W/4;
              
              line(x - xsize, y - xsize, x + xsize, y + xsize);
              line(x + xsize, y - xsize, x - xsize, y + xsize);
            }
          else if(boardTile == p[1])
            {   
              noFill();             
              ellipse(x, y, W/2);
            }
        }
    }
  //Check for winners. If there is any, stop the game and print the winner.
  let result = checkWinner(true);
  if(result != null)
    {
      noLoop();
      let resultMessage = createP('');
      resultMessage.style('font-size', '32pt');
      //console.log(result);
      result == 'tie' ? resultMessage.html('Tie!') : resultMessage.html(`${result} wins!`);
    }
}