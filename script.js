document.addEventListener('DOMContentLoaded', (e) => {

    // Ci-dessous le script JS pour gérer la génération de la grille et le placement du coffre, des rochers et du trésor.
    // async function playMusic() {}
    let myAudio = document.querySelector('audio');
    myAudio.src = '(Music) Shinobi - BGM 2 (Arcade).mp3';
    myAudio.volume = 0.2;
    myAudio.play();
    myAudio.loop = true;
    myAudio.autoplay = true;
    myAudio.controls = true;
    myAudio.preload = 'auto';


    let btnUp = document.querySelector('.btnUp');
    let btnDown = document.querySelector('.btnDown');
    let btnLeft = document.querySelector('.btnLeft');
    let btnRight = document.querySelector('.btnRight');
    let grid = document.querySelector('.grid');


    let existingIndex = [];
    let life = 3;
    let countTreasure = 0;
    let heartArray = Array.from(document.querySelectorAll('i'));

    // Générer une grille de 20x20
    for (let i = 0; i < 400; i++) {
        let cell = document.createElement('div');
        cell.classList.add('cell');
        grid.appendChild(cell);
    }

    // Créer un tableau contenant toutes les cellules
    const cellArray = Array.from(document.querySelectorAll('.cell'));

    // Ajouter le player
    playerIndex = cellArray[0];
    playerIndex.classList.add('player');
    existingIndex.push(0);


    // Ajouter le trésor aléatoirement

    let treasureIndex = randomIndex();
    cellArray[treasureIndex].classList.add('treasure');
    existingIndex.push(treasureIndex);


    // Ajouter le dragon
    // Le dragon ne doit pas se trouver sur le trésor
    let dragonIndex = randomIndex();
    while (dragonIndex == treasureIndex) {
        dragonIndex = randomIndex();
    }
    cellArray[dragonIndex].classList.add('blue-dragon');
    existingIndex.push(dragonIndex);


    // Création d'une boucle pour ajouter des rochers aléatoirement
    let count = 0;
    while (count != 50) {
        let rockIndex = randomIndex();

        if (!existingIndex.includes(rockIndex) && rockIndex != 0) {
            cellArray[rockIndex].classList.add('rock');
            existingIndex.push(rockIndex);
            count++;
        }
    }

    // Fin boucle treasure
    // Faire fonctionner le déplacement du joueur avec les touches directionnelles.
    let player = document.querySelector('.player');
    playerIndex = cellArray.indexOf(player);


    // ----------------------------------- FONCTIONS ------------------------------------ //
    function randomIndex() {
            let randomIndex = Math.floor(Math.random() * cellArray.length);
            return randomIndex;
    }

    function calcRowDiff() {
        let playerRow = Math.floor(playerIndex / 20);
        let dragonRow = Math.floor(dragonIndex / 20);
        let rowDiff = playerRow - dragonRow;

        return rowDiff;
    }

    function calcColDiff() {
        let playerCol = playerIndex % 20;
        let dragonCol = dragonIndex % 20;
        let colDiff = playerCol - dragonCol;

        return colDiff;
    }

    // Stocker les mouvements possibles pour le dragon et faire un choix aléatoire
    function dragonMoves() {
        let moves = [];
    if (calcRowDiff() !== 0) {
        // Déplacement vertical
        moves.push(dragonIndex + (calcRowDiff() > 0 ? 20 : -20));
    }
    if (calcColDiff() !== 0) {
        // Déplacement horizontal
        moves.push(dragonIndex + (calcColDiff() > 0 ? 1 : -1));
    }
    // Choisir aléatoirement une option parmi celles disponibles
    let newDragonIndex = moves[Math.floor(Math.random() * moves.length)];

    return newDragonIndex;
    }

    // Changer l'index du joueur
    function changePlayerIndex() {
        cellArray[playerIndex].classList.remove('player');
        playerIndex = newPlayerIndex;
        cellArray[playerIndex].classList.add('player');
    }
    // Changer l'index du dragon
    function changeDragonIndex() {
        cellArray[dragonIndex].classList.remove('blue-dragon');
        cellArray[newDragonIndex].classList.add('blue-dragon');
        dragonIndex = newDragonIndex;
    }

    function lostLife() {
            heartArray[life - 1].classList.add('lost');
            life--;
            newDragonIndex = randomIndex();
            changeDragonIndex();
        }

    function gameOver() {
        alert('Game Over');
        location.reload();
    }

    function success() {
            grid.classList.toggle('success')
            grid.innerHTML = `<h2>Bravo, vous avez trouvé tous les trésors!</h2>
                                <button class="btn-replay">Rejouer!</button>`;

            const btn = document.querySelector('.btn-replay');
            btn.addEventListener('click', () => {
                location.reload();
                document.querySelector('.grid').classList.remove('.success');
            });
    }

    function refreshTreasure() {
              countTreasure++;
            countTreasure == 3 ? success() : false;
            cellArray[treasureIndex].classList.remove('treasure');
            treasureIndex = randomIndex();

            while (treasureIndex == playerIndex || existingIndex.includes(treasureIndex)) {
                treasureIndex = randomIndex();
            } // Fin de la boucle while
            cellArray[treasureIndex].classList.add('treasure');
            existingIndex.push(treasureIndex);  
    }


    // ------------------------- VERSION DESKTOP ------------------------------ //
    document.addEventListener('keydown', (event) => {
        
        let key = event.key;
        let newPlayerIndex;
        switch (key) {
            case 'ArrowUp':
                newPlayerIndex = playerIndex - 20;
                break;

            case 'ArrowDown':
                newPlayerIndex = playerIndex + 20;
                break;
            case 'ArrowLeft':
                if (playerIndex % 20 != 0) {
                    newPlayerIndex = playerIndex - 1;
                }
                break;
            case 'ArrowRight':
                if (playerIndex % 20 != 19) {
                    newPlayerIndex = playerIndex + 1;
                }
                break;
            default:
                return;
        }

        if (cellArray[newPlayerIndex].classList.contains('rock')) {
            return;
        }
        
        cellArray[playerIndex].classList.remove('player');
        cellArray[newPlayerIndex].classList.add('player');
        playerIndex = newPlayerIndex;

        // Index du joueur divisé par 20, ou modulo 20 on arrondit le résultat si division, et cela donne la ligne et la colonne du joueur 
        newDragonIndex = dragonMoves();
        changeDragonIndex();

    

        // Décrémenter la vie si le joueur se trouve sur le dragon
        
        if (newPlayerIndex == dragonIndex) {
            lostLife();
        } else if (life == 0) {
            gameOver();  
        }

        
        // Gagner si le joueur  trouve les 3 trésors
        if (playerIndex == treasureIndex) {
            // success();
            refreshTreasure();  
        }
    }); // Fin de la gestion des touches


    // ------------------------- VERSION MOBILE ------------------------------ //
    document.querySelector('.gamepad').addEventListener('click', (e) => {

        switch (e.target.className) {
            case 'btnUp':
                newPlayerIndex = playerIndex - 20;
                break;

            case 'btnDown':
                newPlayerIndex = playerIndex + 20;
                break;
            case 'btnLeft':
                if (playerIndex % 20 != 0) {
                    newPlayerIndex = playerIndex - 1;
                }
                break;
            case 'btnRight':
                if (playerIndex % 20 != 19) {
                    newPlayerIndex = playerIndex + 1;
                }
                break;
            default:
                return;

        }
        if (cellArray[newPlayerIndex].classList.contains('rock')) {
            return;
        }
        cellArray[playerIndex].classList.remove('player');
        cellArray[newPlayerIndex].classList.add('player');
        playerIndex = newPlayerIndex;

        newDragonIndex = dragonMoves();
        changeDragonIndex();

        if (newPlayerIndex == dragonIndex) {
            lostLife();
        } else if (life == 0) {
            gameOver();  
        }

        if (playerIndex == treasureIndex) {
            // success();
            refreshTreasure();  
        }
    });

});




