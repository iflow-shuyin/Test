document.addEventListener('DOMContentLoaded', () => {
    const boardSize = 15;
    const board = [];
    let currentPlayer = 'black'; // 黑棋先手
    let gameOver = false;
    let gameBoardElement = document.getElementById('game-board');
    let currentPlayerElement = document.getElementById('current-player');
    let gameResultElement = document.getElementById('game-result');
    let resetButton = document.getElementById('reset-btn');

    // 初始化棋盘数据和界面
    function initBoard() {
        // 创建二维数组表示棋盘
        for (let i = 0; i < boardSize; i++) {
            board[i] = new Array(boardSize).fill(null);
        }

        // 设置棋盘大小
        gameBoardElement.style.width = `${boardSize * 30}px`;
        gameBoardElement.style.height = `${boardSize * 30}px`;

        // 为每个交叉点添加点击事件
        gameBoardElement.addEventListener('click', handleCellClick);
        
        // 重置游戏状态
        currentPlayer = 'black';
        gameOver = false;
        updateCurrentPlayerDisplay();
        gameResultElement.textContent = '';
    }

    // 处理点击事件
    function handleCellClick(event) {
        if (gameOver) return;

        // 计算点击位置对应的棋盘坐标
        const rect = gameBoardElement.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;

        // 找到最近的交叉点
        const col = Math.round(x / 30);
        const row = Math.round(y / 30);

        // 检查是否在棋盘范围内且该位置没有棋子
        if (row >= 0 && row < boardSize && col >= 0 && col < boardSize && board[row][col] === null) {
            // 放置棋子
            placeStone(row, col, currentPlayer);
            
            // 检查胜负
            if (checkWin(row, col, currentPlayer)) {
                gameOver = true;
                gameResultElement.textContent = `${currentPlayer === 'black' ? '黑棋' : '白棋'} 获胜！`;
            } else {
                // 切换玩家
                currentPlayer = currentPlayer === 'black' ? 'white' : 'black';
                updateCurrentPlayerDisplay();
            }
        }
    }

    // 放置棋子
    function placeStone(row, col, player) {
        board[row][col] = player;
        
        // 创建棋子元素
        const stone = document.createElement('div');
        stone.classList.add('stone', `${player}-stone`);
        stone.style.left = `${col * 30 + 2}px`;
        stone.style.top = `${row * 30 + 2}px`;
        gameBoardElement.appendChild(stone);
    }

    // 检查胜负
    function checkWin(row, col, player) {
        // 检查四个方向：水平、垂直、两个对角线
        const directions = [
            [0, 1],   // 水平
            [1, 0],   // 垂直
            [1, 1],   // 对角线(右下)
            [1, -1]   // 对角线(左下)
        ];

        for (let [dx, dy] of directions) {
            let count = 1; // 当前棋子本身算一个
            
            // 正向计数
            for (let i = 1; i <= 4; i++) {
                const newRow = row + i * dx;
                const newCol = col + i * dy;
                
                if (
                    newRow >= 0 && newRow < boardSize &&
                    newCol >= 0 && newCol < boardSize &&
                    board[newRow][newCol] === player
                ) {
                    count++;
                } else {
                    break;
                }
            }
            
            // 反向计数
            for (let i = 1; i <= 4; i++) {
                const newRow = row - i * dx;
                const newCol = col - i * dy;
                
                if (
                    newRow >= 0 && newRow < boardSize &&
                    newCol >= 0 && newCol < boardSize &&
                    board[newRow][newCol] === player
                ) {
                    count++;
                } else {
                    break;
                }
            }
            
            // 如果连成5个或以上，获胜
            if (count >= 5) {
                return true;
            }
        }
        
        return false;
    }

    // 更新当前玩家显示
    function updateCurrentPlayerDisplay() {
        currentPlayerElement.textContent = currentPlayer === 'black' ? '黑棋' : '白棋';
    }

    // 重置游戏
    function resetGame() {
        // 清空棋盘界面
        while (gameBoardElement.firstChild) {
            if (gameBoardElement.firstChild.classList.contains('stone')) {
                gameBoardElement.removeChild(gameBoardElement.firstChild);
            } else {
                break;
            }
        }
        
        // 重新初始化
        initBoard();
    }

    // 为重置按钮添加事件
    resetButton.addEventListener('click', resetGame);

    // 初始化游戏
    initBoard();
});