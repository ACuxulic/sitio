const cards = document.querySelectorAll('.memory-card');
const turnoTexto = document.getElementById('turno');

// Recuperamos los nombres de los jugadores desde localStorage
const player1 = localStorage.getItem('player1');
const player2 = localStorage.getItem('player2');

// Variables para manejar turnos y puntuaciones
let currentPlayer = player1;
let scores = { [player1]: 0, [player2]: 0 };
let matchedCards = 0;  // Contador de cartas emparejadas
let hasFlippedCard = false;
let lockBoard = false;
let firstCard, secondCard;

// Actualiza el turno en la pantalla
function updateTurn() {
    turnoTexto.textContent = `Turno de: ${currentPlayer}`;
}

// Voltea una carta
function flipCard() {
    if (lockBoard || this === firstCard) return;

    this.classList.add('flip');

    if (!hasFlippedCard) {
        hasFlippedCard = true;
        firstCard = this;
        return;
    }

    secondCard = this;
    checkForMatch();
}

// Verifica si las dos cartas coinciden
function checkForMatch() {
    let isMatch = firstCard.dataset.framework === secondCard.dataset.framework;

    if (isMatch) {
        scores[currentPlayer]++;
        matchedCards += 2;
        markAsMatched();  // Marca las cartas como coincidencia
    } else {
        unflipCards();
        switchPlayer();
    }

    if (matchedCards === cards.length) {
        endGame();
    }
}

// Marca las cartas como coincidentes (y cambia su color)
function markAsMatched() {
    firstCard.classList.add('matched');
    secondCard.classList.add('matched');
    firstCard.removeEventListener('click', flipCard);
    secondCard.removeEventListener('click', flipCard);
    resetBoard();
}

// Voltea las cartas si no coinciden
function unflipCards() {
    lockBoard = true;

    setTimeout(() => {
        firstCard.classList.remove('flip');
        secondCard.classList.remove('flip');
        resetBoard();
    }, 1500);
}

// Cambia al siguiente jugador
function switchPlayer() {
    currentPlayer = currentPlayer === player1 ? player2 : player1;
    updateTurn();
}

// Resetea las variables del tablero
function resetBoard() {
    [hasFlippedCard, lockBoard] = [false, false];
    [firstCard, secondCard] = [null, null];
}

// Mezcla las cartas al inicio
(function shuffle() {
    cards.forEach(card => {
        let randomPos = Math.floor(Math.random() * 12);
        card.style.order = randomPos;
    });
})();

// Finaliza el juego y redirige a la página de puntuaciones
function endGame() {
    localStorage.setItem('score1', scores[player1]);
    localStorage.setItem('score2', scores[player2]);
    window.location.href = 'c.html';
}

// Agrega los eventos de clic a cada tarjeta
cards.forEach(card => card.addEventListener('click', flipCard));

// Inicializa el turno al cargar la página
updateTurn();
