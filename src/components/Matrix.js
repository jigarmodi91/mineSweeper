import React from 'react';
import './matrix.css';
function createRandomNumber(val){
    return Math.floor(Math.random() * val);
}

export class Matrix extends React.Component{
    constructor(props){
        super(props);
        this.rowCount = 0;
        this.columnCount = 0;
        this.mineCount = 0;
        this.safeAreaClicked = 0;
        this.state = {
            rows:[],
            mineArr : []
        }
        this.handleChange = this.handleChange.bind(this);
        this.createMatrix = this.createMatrix.bind(this);
        this.onCellClick = this.onCellClick.bind(this);
    }

    handleChange(event){
        console.log(event);
        let dataAttr = event.currentTarget.getAttribute('data-attr');
        let val = Number(event.target.value);
        if(dataAttr === "rowCount"){
            this.rowCount = val;
        } else if(dataAttr === "columnCount"){
            this.columnCount = val;
        } else if(dataAttr === "mineCount"){
            this.mineCount = val;
        }
    }

    createMatrix(){
        let rows = [];
        for(var i=0; i< this.rowCount; i++){
            rows[i] = [];
            for(var j=0; j< this.columnCount; j++){
                let obj = {
                    mine:false,
                    isVisible:false,
                    value:'',
                    xCord:j,
                    yCord:i
                }
                rows[i][j] = obj;
            }
        }
        this.setState({
            rows:rows
        },()=>{
            this.createMines();
        })
    }

    createMines(){
        let mineArr = [];
        for(var i=0; i<this.mineCount;i++){
            let xCord = createRandomNumber(this.rowCount);
            let yCord = createRandomNumber(this.columnCount);
            let mineRepeated = false;
            mineArr.forEach((item)=>{
                if(item.x === xCord && item.y === xCord){
                    i = i-1;
                    mineRepeated = true;
                } 
            })
            if(!mineRepeated){
                let rowObj = this.state.rows[xCord][yCord];
                rowObj.mine = true;
                mineArr.push({
                    x:xCord,
                    y:yCord
                })
            }
        }
        console.log(mineArr);
        this.setState({mineArr})
    }

    onCellClick(event){
        let cellObj = JSON.parse(event.target.getAttribute('data-attr'));
        let xCord = cellObj && cellObj.xCord;
        let yCord = cellObj && cellObj.yCord;
        let rows = this.state.rows;
        let gameOver = false;
        if(xCord >=0 && xCord !== null && yCord >=0 && yCord !== null){
            if(cellObj && cellObj.mine){
                rows[yCord][xCord] = {
                    ...cellObj,
                    value :"X",
                    isVisible : true,
                    className: 'error'
                }
                gameOver = true;
            } else {
                let numberOfMines = this.getNumberOfMinesAround(xCord,yCord);
                rows[yCord][xCord] = {
                    ...cellObj,
                    value :numberOfMines,
                    isVisible : true,
                    className: 'success'
                }
                this.safeAreaClicked = this.safeAreaClicked + 1;
            }
            this.setState({rows:[...rows]},()=>{
                if(gameOver){
                    let userValue = window.confirm("You have blown the field away :( Play again?");
                    if(userValue){
                        this.resetGame();
                    }
                    return;
                }
                let matrixCount = this.rowCount * this.columnCount
                if(this.safeAreaClicked >= matrixCount - this.mineCount ){
                    let userValue =  window.confirm("Congratulations!! Play again?");
                    if(userValue){
                        this.resetGame();
                    }
                }
            })
        }
    }

    resetGame() {
        this.safeAreaClicked = 0; 
        this.setState({
            rows : [],
            mineArr : []
        });
    }

    getNumberOfMinesAround(xCord,yCord){
        let x,y;
        let rows = this.state.rows;
        let numberOfMines = 0;
        x=xCord-1;
        y=yCord-1;
        if(rows[y] && rows[y][x] && rows[y][x].mine){
            numberOfMines++
        }
        x=xCord;
        y=yCord-1;
        if(rows[y] && rows[y][x] && rows[y][x].mine){
            numberOfMines++
        }
        x=xCord+1;
        y=yCord-1;
        if(rows[y] && rows[y][x] && rows[y][x].mine){
            numberOfMines++
        }
        x=xCord-1;
        y=yCord;
        if(rows[y] && rows[y][x] && rows[y][x].mine){
            numberOfMines++
        }
        x=xCord+1;
        y=yCord;
        if(rows[y] && rows[y][x] && rows[y][x].mine){
            numberOfMines++
        }
        x=xCord-1;
        y=yCord+1;
        if(rows[y] && rows[y][x] && rows[y][x].mine){
            numberOfMines++
        }
        x=xCord;
        y=yCord+1;
        if(rows[y] && rows[y][x] && rows[y][x].mine){
            numberOfMines++
        }
        x=xCord+1;
        y=yCord+1;
        if(rows[y] && rows[y][x] && rows[y][x].mine){
            numberOfMines++
        }
        return numberOfMines;
    }

    render(){
        return <div>
            <h1>Minesweeper!</h1>
            <p>Enter Matrix complexity</p>
            <input type="text" data-attr="rowCount" onChange={this.handleChange}/>
            <span className="separator"> X </span>
            <input type="text" data-attr="columnCount" onChange={this.handleChange} />
            <p>Enter Mine Count</p>
            <input type="text" data-attr="mineCount" onChange={this.handleChange} />
            <input type="button" value="PLAY" onClick={this.createMatrix}/>
            <div className="wrapper" onClick={this.onCellClick}>
                {
                    this.state.rows.map((row, rowKey)=>{
                        return <div className="rowWrap" key = {rowKey}>
                            {
                                row.map((item, key)=>{
                                    let objString = JSON.stringify(item);
                                    let colorClass = item.className;
                                    let cellKey = rowKey.toString() + key.toString();
                                    return <span className={`cell ${colorClass}`} key={cellKey} data-attr={objString}>{item.value}</span>
                                })
                            }
                        </div>
                    })
                }
            </div>
        </div>
    }
}