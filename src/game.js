var audio1 = new Audio('src/audio/linedelete.WAV');
var audio3 = new Audio('src/audio/laserShoot.WAV');
var audioHold = new Audio('src/audio/entry2.mp3');
var audio = new Audio('src/audio/rotate.WAV');
export default class Game{
  static points =
  {
    '1':40,
    '2':100,
    '3':300,
    '4':1200,
  }
  
    
    constructor() 
    {
      this.reset();
    }
    get level()
    {
      return Math.floor(this.lines * 0.1);
    }

    getState() 
    {
      const playfield = this.createPlayfield();
      const {y:pieceY ,x: pieceX, blocks} = this.activePiece;

      for (let y = 0; y < this.playfield.length; y++) 
      {
        playfield[y] =[];
        for (let x = 0; x < this.playfield[y].length; x++) 
        {
          playfield[y][x] = this.playfield[y][x];
          
        }
      }
      for (let y = 0; y < blocks.length; y++) 
      {
        for (let x = 0; x < blocks[y].length; x++) 
        {
          if(blocks[y][x])
          {
            playfield[pieceY + y][pieceX + x] = blocks[y][x];
          }
        }
      }

      return {
        score: this.score,
        level: this.level,
        lines: this.lines,
        nextPiece: this.nextPiece,
        playfield,
        isGameOver: this.topOut,
        holdPiece: this.holdPiece,
        yes: this.yes,
        
      };
    };
    reset()
    {
      this.score = 0;
      this.lines = 0;
      this.topOut = false;
      this.holdPiece = '';
      this.canhold = true;
      this.yes = true;
      
  
      this.playfield = this.createPlayfield();
      this.activePiece = this.createPiece();
      
      this.nextPiece = this.createPiece();
    }
    muteGame(){
      let dudu=0;
      if(dudu==0){
        audio.src='';
        audio1.src='';
        audio3.src='';
        audioHold = '';
          dudu=1
      }
      if(dudu==1){
        audio.src='src/audio/linedelete.WAV';
        audio1.src='src/audio/laserShoot.WAV';
        audio3.src='src/audio/rotate.WAV';
        audioHold = 'src/audio/entry2.mp3';
          dudu=0
      }
    
    
    }
    createPlayfield() 
    {
      const playfield = [];
      for (let y = 0; y < 20; y++) 
      {
        playfield[y] =[];
        for (let x = 0; x < 10; x++) 
        {
          playfield[y][x] = 0;
          
        }
      }
      return playfield;
    }

    createPiece()
    {
      const index = Math.floor(Math.random() * 8)
      const type= 'IJLOSTZU'[index];
      const piece = {x:0,y:0};
       switch (type){
        case 'I':
          piece.blocks = [
            [0,0,0,0],
            [1,1,1,1],
            [0,0,0,0],
            [0,0,0,0]
          ];
          break;
        case 'J':
          piece.blocks = [
            [0,0,0],
            [2,2,2],
            [0,0,2]
          ];
          break;
        case 'L':
          piece.blocks = [
            [0,0,0],
            [3,3,3],
            [3,0,0]
          ];
          break;
        case 'O':
          piece.blocks = [
            [0,0,0,0],
            [0,4,4,0],
            [0,4,4,0],
            [0,0,0,0]
          ];
          break;

        case 'S':
          piece.blocks = [
            [0,0,0],
            [0,5,5],
            [5,5,0]
          ];
          break;

        case 'T': 
          piece.blocks = [
            
            [0,0,0],
            [6,6,6],
            [0,6,0]
          ];
          break;

        case 'Z':
          piece.blocks = [
            [0,0,0],
            [7,7,0],
            [0,7,7]
          ];
          break;

        case 'U': 
          piece.blocks = [
            [0,0,0],
            [8,0,8],
            [8,8,8]  // zmien
          
          ];
          break;

        default:
          throw new Error('undefined piece');
       }
       piece.x = Math.floor((10 - piece.blocks[0].length)/2);
       piece.y = 0;
      return piece;
    }

    movePieceLeft()
    {
      this.activePiece.x -=1;
      if(this.hasCollision(this.activePiece)) {
        this.activePiece.x +=1;
      }
    }

    movePieceRight()
    {
      this.activePiece.x +=1;
      if(this.hasCollision(this.activePiece)) {
        this.activePiece.x -=1;
      }
    }

    movePieceDown()
    {
      if(this.topOut) return
      this.activePiece.y +=1;
      this.score += 1;
      if(this.hasCollision(this.activePiece)) {
        this.activePiece.y -=1;
        this.lockPiece();
        const  clearedLines = this.clearLines();
        this.updateScore(clearedLines);
        this.updatePieces()
        this.canhold = true;
        
      }
      if(this.hasCollision(this.activePiece)){
        this.topOut = true
      }
    }
    hardDrop()
    {
      for(let y = this.activePiece.y;y < this.playfield.length;y++){
        if(this.topOut) return
      this.activePiece.y +=1;
      if(this.hasCollision(this.activePiece)) {
        this.activePiece.y -=1;
        this.lockPiece();
        const  clearedLines = this.clearLines();
        this.updateScore(clearedLines);
        this.updatePieces()
        this.score += y*2;
        this.canhold = true;
        audio3.play();
        break;
      }
      if(this.hasCollision(this.activePiece)){
        this.topOut = true
        break;
      }
     
      }
    }
    
    playerHold() {
    if(this.holdPiece === '' && this.canhold){
        audioHold.play();
        this.holdPiece = this.activePiece;
        this.yes = false;
        this.updatePieces();
        this.canhold = false;
        this.holdPiece.y = 0;
        this.holdPiece.x = Math.floor((10 - this.holdPiece.blocks[0].length)/2);
    }
    else if(this.canhold){
      audioHold.play();
      this.holdPiece.y = 0;
      this.holdPiece.x = Math.floor((10 - this.holdPiece.blocks[0].length)/2);
        this.temp = this.activePiece;
        this.activePiece = this.holdPiece
       
       
        this.holdPiece = this.temp;
        this.canhold = false;
    }
    
  

}
    rotatePiece()
    {
      this.rotateBlocks() 
    
      if(this.hasCollision(this.activePiece))
      {
        this.rotateBlocks(false);
      }
      else{
        // var audio = new Audio('src/audio/rotate.WAV');
        audio.play();
      }
      // const temp = [];
      // for (let i = 0; i < length; i++) {
      //   temp[i] = new Array(length).fill(0);
      // }
      // for (let y = 0; y < length; y++) {
      //   for (let x = 0; x < length; x++) {
      //     temp[x][y] = blocks[length -1 -y][x];
          
      //   }
      // }
      // this.activePiece.blocks = temp;
      // if(this.hasCollision()){
      //   this.activePiece.blocks = blocks;
      // }
    }
    
    rotateBlocks( clockwise = true)
    {
      const blocks = this.activePiece.blocks;
      const length = blocks.length;
      const y = length-1;
      const x = Math.floor(length/2);

      for (let i = 0; i < x; i++) 
      {
        for (let j = i; j < y-i; j++) 
        {
          const temp = blocks[i][j];
          
          if(clockwise)
          {
            blocks[i][j] = blocks[y-j][i];
            blocks[y-j][i] = blocks[y-i][y-j];
            blocks[y-i][y-j] = blocks[j][y-i];
            blocks[j][y-i] = temp;
          }
          else{
            blocks[i][j] = blocks[j][y-i];
            blocks[j][y-i] = blocks[y-i][y-j];
            blocks[y-i][y-j] = blocks[y-j][i];
            blocks[y-j][i] = temp;
          }
        }
    
        
      }
    } 

    hasCollision(tab)
    {
      const {y:pieceY ,x: pieceX, blocks} = tab;
      for (let y = 0; y < blocks.length; y++) {
        for (let x = 0; x < blocks[y].length; x++) {
         if(blocks[y][x] != 0 && ((this.playfield[pieceY + y] === undefined || this.playfield[pieceY + y][pieceX + x] === undefined) || this.playfield[pieceY + y][pieceX + x] )){
          audio3.play();
          return true;
         }
        }
        
      }
      return false;
      
    }
    // ustawia

    lockPiece()
    {
      const {y:pieceY ,x: pieceX, blocks} = this.activePiece;
     
      for(let y = 0; y < blocks.length; y++)
      {
         for(let x = 0; x < blocks[y].length; x++) 
        {
          if (blocks[y][x])
          {
            this.playfield[pieceY + y][pieceX + x ] = blocks[y][x];
          }
        }
      }
    }
    clearLines()
    {
      const rows = 20;
      const columns = 10;
      let lines = [];
      for (let y = rows - 1; y >= 0; y--) {
        let numberOfBlocks = 0;
        for (let x = 0; x < columns; x++) {
          if(this.playfield[y][x])
          {
            numberOfBlocks += 1;
          }
          
        }
        if (numberOfBlocks === 0)
        {
          break;
        }
        else if(numberOfBlocks < columns){continue;}
        else if(numberOfBlocks === columns){
          lines.unshift(y);
          
          audio1.play();
        }
        
      }
      for (let index of lines) {
       this.playfield.splice(index,1);
       this.playfield.unshift(new Array(columns).fill(0));
        
      }
      return lines.length;
    }
    updateScore(clearedLines)
    {
      if(clearedLines>0)
      {
        this.score+= Game.points[clearedLines] * (this.level +1)
        this.lines += clearedLines;
     
      }
    }
    
    updatePieces()
    {
      this.activePiece = this.nextPiece;
      this.nextPiece = this.createPiece();
    }
};
