'use strict'
var gBoard
var mine = '💣'
var gLevel = {
	SIZE: 4,
	MINES: 2
}

function init() {
	gBoard = buildBoard()
	console.table(gBoard)
	renderBoard(gBoard)
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

function renderBoard(gBoard) {
	var strHTML = '<table><tbody>'
	for (var i = 0; i < gBoard.length; i++) {
		strHTML += '<tr>'
		for (var j = 0; j < gBoard.length; j++) {
			const cell = gBoard[i][j]
			const className = `cell cell-${i}-${j}`

			if (cell.isMine)
				var content = mine
			else
				var content = cell.minesAroundCount

			strHTML += `<td class="${className}">${content}</td>`
		}
		strHTML += '</tr>'
	}
	strHTML += '</tbody></table>'
	var elContainer = document.querySelector('.game-container')
	elContainer.innerHTML = strHTML

}

function setMinesNegsCount() {

}
function minesAroundCount() { }