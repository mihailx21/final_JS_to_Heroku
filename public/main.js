//create and appending body function
function createAndAppendOnBody(elementType) {
    let element = document.body.appendChild(document.createElement(elementType))
    return element
}

//create and appending parent function
function createAndAppendOnParent(parent, elementType) {
    let element = parent.appendChild(document.createElement(elementType))
    return element
}

//removing object from vision zone
function removeObject(elem) {
    elem.parentNode.removeChild(elem)
}

//random position in cell
function randomPos() {
    let x = Math.round(Math.random() * (10 - 3) + 3)
    let y = Math.round(Math.random() * (10 - 1) + 1)
    return [x, y]
}
//random position for food
function randomPosFood() {
    let x = Math.round(Math.random() * (10 - 1) + 1)
    let y = Math.round(Math.random() * (10 - 1) + 1)
    let food = document.querySelector('[data-x = "' + x + '"][data-y = "' + y + '"]')
    while (food.classList.contains('snake-body')) {
        x = Math.round(Math.random() * (10 - 1) + 1)
        y = Math.round(Math.random() * (10 - 1) + 1)
        food = document.querySelector('[data-x = "' + x + '"][data-y = "' + y + '"]')
    }
    food.classList.add('food')
    return food
}

//adding classes to head & body of snake
function addClassesToSnake(snake) {
    snake[0].classList.add('snake-head')
    snake.forEach((elem, indx) => {
        if (indx > 0) {
            elem.classList.add('snake-body')
        }
    })
}

//rotating head in case of moving direction
function rotatingHead(directionMove, snakeHead) {
    switch (directionMove) {
        case 'up':
            snakeHead.style.transform = 'rotate(-90deg)'
            break
        case 'down':
            snakeHead.style.transform = 'rotate(-270deg)'
            break
        case 'left':
            snakeHead.style.transform = 'rotate(-180deg)'
            break
        case 'right':
            snakeHead.style.transform = 'rotate(-360deg)'
            break
    }
}

//snake run
function snakeRun(snake, direction) {
    let cord = [snake[0].getAttribute('data-x'), snake[0].getAttribute('data-y')]
    let newHead
    switch (direction) {
        case 'up':
            snake[0].classList.remove('snake-head')
            snake[snake.length - 1].classList.remove('snake-body')
            snake.pop()
            if (cord[1] == 1) cord[1] = 11
            newHead = (document.querySelector('[data-x = "' + cord[0] + '"][data-y = "' + (+cord[1] - 1) + '"]'))
            snake.unshift(newHead)
            addClassesToSnake(snake)
            rotatingHead(direction, snake[0])
            break
        case 'down':
            snake[0].classList.remove('snake-head')
            snake[snake.length - 1].classList.remove('snake-body')
            snake.pop()
            if (cord[1] > 9) cord[1] = 0
            newHead = (document.querySelector('[data-x = "' + cord[0] + '"][data-y = "' + (+cord[1] + 1) + '"]'))
            snake.unshift(newHead)
            addClassesToSnake(snake)
            rotatingHead(direction, snake[0])
            break
        case 'left':
            snake[0].classList.remove('snake-head')
            snake[snake.length - 1].classList.remove('snake-body')
            snake.pop()
            if (cord[0] == 1) cord[0] = 11
            newHead = (document.querySelector('[data-x = "' + (+cord[0] - 1) + '"][data-y = "' + cord[1] + '"]'))
            snake.unshift(newHead)
            addClassesToSnake(snake)
            rotatingHead(direction, snake[0])
            break
        case 'right':
            snake[0].classList.remove('snake-head')
            snake[snake.length - 1].classList.remove('snake-body')
            snake.pop()
            if (cord[0] == 10) cord[0] = 0
            newHead = (document.querySelector('[data-x = "' + (+cord[0] + 1) + '"][data-y = "' + cord[1] + '"]'))
            snake.unshift(newHead)
            addClassesToSnake(snake)
            rotatingHead(direction, snake[0])
            break
    }
    return cord
}

//creating and appending main menu
function mainMenu(score) {
    let nickname = createAndAppendOnParent(container, 'input')
    nickname.classList.add('input-nickname')
    nickname.placeholder = 'Enter your nickname'

    const menuButtonPlay = createAndAppendOnParent(container, 'button')
    menuButtonPlay.innerText = "Play Game"
    menuButtonPlay.classList.add('main-menu-button')

    const menuButtonScore = createAndAppendOnParent(container, 'button')
    menuButtonScore.innerText = "Hight Scores"
    menuButtonScore.classList.add('main-menu-button')
    menuButtonPlay.onclick = () => {
        menuButtonPlay.classList.add('on-click')
        let gamerLoginText = `${nickname.value}`
        if (nickname.value != ''){
            if(confirm('The rules easy)\n - You can move snake by W,S,A,D or arrows\n - One "food" give you 1(one) point'))
                playGame(menuButtonPlay, menuButtonScore, nickname, gamerLoginText)
            else{
                alert('Realy? Are you joking on me?')
            }
        }
        menuButtonPlay.innerText = 'Enter your nickname & then click here!'
    }
    menuButtonScore.onclick = () => {
        removeObject(nickname)
        removeObject(menuButtonPlay)
        removeObject(menuButtonScore)
        showScore()
        if (score > 0) { }
        //gamerLoginText, score need send to server
    }
}
//if gamer failed and lose game
function gameOver(score, player) {
    const gameoverimg = createAndAppendOnParent(container, 'img')
    gameoverimg.src = "src/game-over.jpg"
    gameoverimg.classList.add('game-over')
    const menuButton = createAndAppendOnParent(container, 'button')
    menuButton.classList.add('to-menu', 'main-menu-button')
    menuButton.innerText = 'Go to menu'

    menuButton.onclick = () => {
        removeObject(gameoverimg)
        removeObject(menuButton)
        mainMenu(score)
        fetch('http://localhost:3000/scores', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ nickname: `${player}`, score: `${score}` })
        }).then(response => {
            return response.json()
        })
            .then(data => {
                console.log(data)
            })
    }
}

//main function of the game, drowing field, snake & food
function playGame(menuButtonPlay, menuButtonScore, gamerLogin, gamerLoginText) {
    removeObject(menuButtonPlay)
    removeObject(menuButtonScore)
    removeObject(gamerLogin)
    const snakeField = createAndAppendOnParent(container, 'div')
    snakeField.classList.add('field', 'd-flex', 'wrap')

    //setting cells on field
    const snakeFieldCells = []
    for (let i = 0; i < 100; i++) {
        const cell = createAndAppendOnParent(snakeField, 'div')
        cell.classList.add('cell')
        snakeFieldCells.push(cell)
    }

    //setting coordinates to each cell
    let x = 1, y = 1
    snakeFieldCells.forEach(elem => {
        if (x > 10) {
            x = 1
            y++
        }
        elem.setAttribute('data-x', x)
        elem.setAttribute('data-y', y)
        x++
    })

    //random head position 
    let headXAndY = randomPos()
    console.log(headXAndY)
    let snakeBody = [
        (document.querySelector('[data-x = "' + headXAndY[0] + '"][data-y = "' + headXAndY[1] + '"]')),
        (document.querySelector('[data-x = "' + (headXAndY[0] - 1) + '"][data-y = "' + headXAndY[1] + '"]')),
        (document.querySelector('[data-x = "' + (headXAndY[0] - 2) + '"][data-y = "' + headXAndY[1] + '"]'))
    ]

    addClassesToSnake(snakeBody)

    //random food position
    var food = randomPosFood()

    //moving snake
    let direction = 'right'
    let scorePoints = 0

    //create & appending gamescore
    let score = createAndAppendOnBody('div')
    score.style.position = 'absolute'
    score.style.top = '10vh'
    score.style.left = '80vw'
    score.innerText = `Your score: \n${scorePoints}`
    score.classList.add('score')

    let interval = setInterval(() => {
        document.onkeydown = (event) => {
            if ((event.code == 'KeyW' || event.code == 'ArrowUp') && direction != 'down') direction = 'up'
            else if ((event.code == 'KeyD' || event.code == 'ArrowRight') && direction != 'left') direction = 'right'
            else if ((event.code == 'KeyA' || event.code == 'ArrowLeft') && direction != 'right') direction = 'left'
            else if ((event.code == 'KeyS' || event.code == 'ArrowDown') && direction != 'up') direction = 'down'
        }

        //event snake eats food
        let cord = snakeRun(snakeBody, direction)
        if (snakeBody[0].getAttribute('data-x') == food.getAttribute('data-x')
            && snakeBody[0].getAttribute('data-y') == food.getAttribute('data-y')) {
            scorePoints++;
            score.innerText = `Your score: \n${scorePoints}`
            console.log(scorePoints)
            food.classList.remove('food')
            let a = snakeBody[snakeBody.length - 1].getAttribute('data-x')
            let b = snakeBody[snakeBody.length - 1].getAttribute('data-y')
            snakeBody.push(document.querySelector('[data-x = "' + a + '"][data-y = "' + b + '"]'))
            food = randomPosFood()
        }


        if (snakeBody[0].classList.contains('snake-body')) {
            removeObject(score)
            alert(`Game OVER ${gamerLoginText}!!!\nYou score is ${scorePoints}`)
            clearInterval(interval)
            removeObject(snakeField)
            gameOver(scorePoints, gamerLoginText)
        }



    }, 400)
}

function showScore() {
    let textScore = createAndAppendOnParent(container, 'div')
    textScore.classList.add('text-score')
    let score = {}
    fetch('http://localhost:3000/scores')
        .then(response => response.json())
        .then(data => {
            textScore.innerText = 'Score:\n'
            data.forEach((el) => {
                textScore.innerText += `${el.nickname} : ${el.score}\n`
            })
        })

    let buttonBack = createAndAppendOnParent(container, 'button')
    buttonBack.classList.add("main-menu-button")
    buttonBack.innerText = 'Back to menu'
    buttonBack.onclick = () => {
        mainMenu(0)
        removeObject(textScore)
        removeObject(buttonBack)
    }
}

//--------------------------------------------------------------------------------------------

const container = createAndAppendOnBody('div')
container.classList.add('d-flex', 'container')
container.classList.add('direction-column')
mainMenu(0)