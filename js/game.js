'use strict'
var gBoard
var mine = '💣'
var gLevel = {
	SIZE: 4,
	MINES: 2
}

var gGame = {
	isOn: false,
	isFirstClick: true,
	revealedCount: 0,
	markedCount: 0,
	secsPassed: 0
}

function init() {
	gBoard = buildBoard()
	setMinesNegsCount()
	console.table(gBoard)
	renderBoard()
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
			const className = `cell cell-${i}-${j}`
			var content = ''
			if (cell.isRevealed) {
				if (cell.isMine) content = mine
				else content = cell.minesAroundCount
			}


			strHTML += `<td class="${className}" onclick="onCellClicked(this,${i}, ${j})">${content}</td>`
		}
		strHTML += '</tr>'
	}
	strHTML += '</tbody></table>'
	var elContainer = document.querySelector('.game-container')
	elContainer.innerHTML = strHTML

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
	if (gGame.isFirstClick) {
		gGame.isOn = true
		placeMines()
		setMinesNegsCount()
		gGame.isFirstClick = false
	}

	if (!gGame.isOn) return

	gBoard[i][j].isRevealed = true
	renderBoard()
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