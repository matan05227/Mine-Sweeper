'use strict'
var gBoard
var gLevel = {
	SIZE: 4,
	MINES: 4
}

var mine = '💣'
var MARKED = '🏴'
var smiley_win = '😄'
var smiley_3_lives = '😊'
var smiley_2_lives = '😐'
var smiley_1_lives = '😕'
var smiley_lose = '😔'

var gGame = {
	isOn: false,
	isFirstClick: true,
	revealedCount: 0,
	markedCount: 0,
	secsPassed: 0,
	livesCount: 3,
}

function onInit(diff = 1) {
	setLevel(diff)
	gBoard = buildBoard()
	placeMines()
	setMinesNegsCount()
	renderBoard()
	renderLives()
	renderSmileys()
	gGame.isOn = true
}

function buildBoard() {
	const board = []

	for (var i = 0; i < gLevel.SIZE; i++) {
		board.push([])

		for (var j = 0; j < gLevel.SIZE; j++) {
			board[i][j] = {
				minesAroundCount: 0,
				isRevealed: false,
				isMine: false,
				isMarked: false

			}
		}
	}

	return board
}

function renderBoard() {
	var strHTML = '<table><tbody>'
	for (var i = 0; i < gBoard.length; i++) {
		strHTML += '<tr>'
		for (var j = 0; j < gBoard.length; j++) {
			const cell = gBoard[i][j]
			var className = `cell cell-${i}-${j}`
			var content = ''
			if (cell.isRevealed) {
				if (cell.isMine) content = mine
				else content = cell.minesAroundCount

				className += ' revealed'
			}
			if (cell.isMarked) content = MARKED
			strHTML += `<td class="${className}" onclick="onCellClicked(this,${i}, ${j})"  oncontextmenu="onCellMarked(this,${i}, ${j}, event)">${content}</td>`
		}
		strHTML += '</tr>'
	}
	strHTML += '</tbody></table>'
	var elContainer = document.querySelector('.game-container')
	elContainer.innerHTML = strHTML

}

function setLevel(diff) {
	if (diff === 1) {
		gLevel = { SIZE: 4, MINES: 4 }
		gGame.livesCount = 3
	}
	else if (diff === 2) {
		gLevel = { SIZE: 7, MINES: 6 }
		gGame.livesCount = 4
	}
	else if (diff === 3) {
		gLevel = { SIZE: 10, MINES: 8 }
		gGame.livesCount = 5
	}
}

function setMinesNegsCount() {
	for (var i = 0; i < gBoard.length; i++) {
		for (var j = 0; j < gBoard[0].length; j++) {
			gBoard[i][j].minesAroundCount = minesAroundCount(i, j)
		}
	}
}

function minesAroundCount(cellI, cellJ) {
	var count = 0
	for (var i = cellI - 1; i <= cellI + 1; i++) {
		if (i < 0 || i >= gBoard.length) continue
		for (var j = cellJ - 1; j <= cellJ + 1; j++) {
			if (j < 0 || j >= gBoard[i].length) continue
			if (i === cellI && j === cellJ) continue
			if (gBoard[i][j].isMine) count++
		}
	}
	return count
}

function onCellClicked(elCell, i, j) {
	if (!gGame.isOn) return
	if (gBoard[i][j].isMine) {
		gGame.livesCount--
		renderLives()
		renderSmileys()
		checkGameOver()
	}

	gBoard[i][j].isRevealed = true
	gGame.revealedCount++
	showNegsAruond({ i, j })
	renderBoard()
	checkGameWin()
}

function onCellMarked(elCell, i, j, ev) {
	ev.preventDefault()
	var cell = gBoard[i][j]

	cell.isMarked = !cell.isMarked
	gGame.markedCount += cell.isMarked ? 1 : -1
	renderBoard()
	checkGameWin()
}

function placeMines() {
	for (let i = 0; i < gLevel.MINES; i++) {
		var cell = getRandomEmptyCell()
		if (!cell) return
		gBoard[cell.i][cell.j].isMine = true

	}
}

function getEmptyCells() {
	var emptyCells = []

	for (var i = 0; i < gBoard.length; i++) {
		for (var j = 0; j < gBoard[0].length; j++) {
			if (!gBoard[i][j].isMine) {
				emptyCells.push({ i, j })
			}
		}
	}

	return emptyCells
}

function checkGameWin() {
	var elModal = document.querySelector('.modal')
	if (gGame.revealedCount + gGame.markedCount === gLevel.SIZE ** 2 && gGame.markedCount === gLevel.MINES) {
		var win = document.querySelector('.smiley')
		win.innerText = smiley_win
		elModal.innerHTML = "Win"
		elModal.showModal()
	}

}

function checkGameOver() {
	if (gGame.livesCount > 0) return
	var elModal = document.querySelector('.modal')
	gGame.isOn = false
	elModal.innerHTML = "Lose"
	elModal.showModal()
	renderSmileys()
}

function getRandomEmptyCell() {
	const emptyCells = getEmptyCells()
	if (emptyCells.length === 0) return null

	const idx = getRandomInt(0, emptyCells.length)
	return emptyCells[idx]
}

function getRandomInt(min, max) {
	const minCeiled = Math.ceil(min);
	const maxFloored = Math.floor(max);
	return Math.floor(Math.random() * (maxFloored - minCeiled) + minCeiled); // The maximum is exclusive and the minimum is inclusive
}

function showNegsAruond(pos) {
	for (var i = pos.i - 1; i <= pos.i + 1; i++) {
		if (i < 0 || i >= gBoard.length) continue
		for (var j = pos.j - 1; j <= pos.j + 1; j++) {
			if (j < 0 || j >= gBoard[i].length) continue
			if (i === pos.i && j === pos.j) continue
			if (gBoard[i][j].isMine) continue
			if (!gBoard[i][j].isRevealed) {
				gBoard[i][j].isRevealed = true
				gGame.revealedCount++
			}
		}
	}
}


function renderLives() {
	var elLives = document.querySelector('.lives')
	elLives.innerText = '❤️'.repeat(gGame.livesCount)
}

function renderSmileys() {
	var elSmiley = document.querySelector('.smiley')
	elSmiley.innerText = smiley_3_lives

	if (gGame.livesCount === 2) elSmiley.innerText = smiley_2_lives
	if (gGame.livesCount === 1) elSmiley.innerText = smiley_1_lives
	if (gGame.livesCount === 0) elSmiley.innerText = smiley_lose

}