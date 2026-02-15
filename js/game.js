'use strict'
var gBoard
var mine = '💣'
var gLevel = {
	SIZE: 4,
	MINES: 2
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
	board[1][1].isMine = true
	board[3][3].isMine = true
	return board
}

function renderBoard() {
	var strHTML = '<table><tbody>'
	for (var i = 0; i < gBoard.length; i++) {
		strHTML += '<tr>'
		for (var j = 0; j < gBoard.length; j++) {
			const cell = gBoard[i][j]
			const className = `cell cell-${i}-${j}`
			var content=''
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
	gBoard[i][j].isRevealed=true
	renderBoard()

}