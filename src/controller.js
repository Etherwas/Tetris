
var GameMusic = new Audio('src/audio/schafi.mp3')

export default class Controller {
    constructor(game,view)
    {
        this.game = game;
        this.view = view;
        this.intervalId = null
        this.isPlaying = false;
        

        document.addEventListener('keydown',this.handleKeyDown.bind(this))
        document.addEventListener('keyup',this.handleKeyUp.bind(this))
            
        this.view.renderStartScreen()
       
    }
    mute(a) {
        
        if(a==0){
            GameMusic.pause();
            
        }
        else  if(a==1){
            // if(this.isU)
            // {
            // GameMusic.src='src/audio/schafi.mp3'
            // GameMusic.play();
            // }
            // else {
            GameMusic.play()
            // GameMusic.play();
            // }
            
        }
        
    };
    update()
    {
       this.game.movePieceDown()
       this.updateView()
    }
    start(){
        this.isPlaying = true
        
        this.startTimer()
        this.updateView()
      
        if(!this.isM)
        {
        this.music();
        }
        
    }
    music()
    {
        GameMusic.currentTime = 0;
        GameMusic.volume=0.2;
        GameMusic.loop=true
        this.mute(1);
        GameMusic.play();
    }
    pause(){
        this.isPlaying = false
        this.stopTimer()
        this.updateView()
        GameMusic.pause()
    }
    reset()
    {
        this.game.reset()
        this.start()
    }
    saveScore(score)
    {
        let scoreboard = JSON.parse(localStorage.getItem('scoreboard'))
        if(scoreboard == null)
        {
            scoreboard = new Array()
        }
        let index = this.findIndex(scoreboard,score)
        this.createGap(scoreboard,index)
        scoreboard[index] = score;
        if(scoreboard.length > 10)
        {
            scoreboard.pop()
        }
        localStorage.setItem('scoreboard',JSON.stringify(scoreboard))
        
    }
    createGap(scoreboard,index)
    {
        if(index == scoreboard.length)
            return
        for(let i = scoreboard.length - 1; i >= index; --i)
            scoreboard[i + 1] = scoreboard[i]
    }
    findIndex(scoreboard,score)
    {
       
        for(let i=0; i<scoreboard.length; i++)
        {
            if(score >= scoreboard[i]) return i;
        }
        return scoreboard.length
    }
    updateView()
    {
        const state = this.game.getState()
        if(state.isGameOver)
        {
            this.view.renderEndScreen(state)
            this.saveScore(state.score)
            this.stopTimer()
            this.mute(0);
    
        }
        
        else if(!this.isPlaying)
        {
            this.view.renderPauseScreen()
            
        }
        else 
        {
            this.view.renderMainScreen(state)
        }
    }

    startTimer(){
        const speed = 1000 - this.game.getState().level *100
        if(!this.intervalId)
        {
        this.intervalId = setInterval(() =>{
            this.update()
        },speed > 0 ? speed: 100)
    }

    }
    stopTimer()
    {
        if(this.intervalId){
        clearInterval(this.intervalId);
        this.intervalId = null;
        }

    }
    handleKeyDown(event)
    {
        const state = this.game.getState()
        
        switch (event.keyCode)
            {
                case 13: // ENTER
                if(state.isGameOver)
                {
                    this.reset();
                  
                }
                else if(!this.isPlaying)
                {
                    this.start()
                    }
                    break;
                
                case 80: // P
                if(this.isPlaying)
                {
                    this.pause();
                   
                }
                    break;
                
                case 37: // left arrow
                if(this.isPlaying){
                    this.game.movePieceLeft();
                    this.updateView();
                }
                    break;
                
                case 38: // up arrow
                if(this.isPlaying){
                    this.game.rotatePiece();
                    this.updateView();
            }
                    break;
                
                case 39: // right arrow
                if(this.isPlaying){
                    this.game.movePieceRight();
                    this.updateView();
            }
                    break;
                
                case 40: // down arrow
                if(this.isPlaying){
                    this.stopTimer();
                    this.game.movePieceDown();
                    this.updateView();
            }
                    break;
                case 32:
                    if(this.isPlaying){
                        this.game.hardDrop();
                        this.updateView();
                    }
                    break;
                case 67:
                    if(this.isPlaying){
                        this.game.playerHold();
                        this.updateView();
            }
                    break;
                case 85: // U
                    if(this.isPlaying){
                        this.mute(1);
                        this.isM = false;
                        // this.isU = true;
            }
                    break;
                case 77: // M
                    if(this.isPlaying){
                    this.mute(0);
                    this.isM = true;
                    
            }
                    break;
               
                
            }
    }

handleKeyUp(event)
{
    
    switch (event.keyCode)
        {
            case 40: // down arrow
            if(this.isPlaying){
                this.game.movePieceDown();
                this.updateView();
                this.startTimer();
        }
                break;
            
        }

}
}