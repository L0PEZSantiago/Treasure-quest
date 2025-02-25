document.addEventListener('DOMContentLoaded', (e) => {
    // Ci-dessous le script JS pour gérer la génération de la grille et le placement du coffre, des rochers et du trésor.
    async function playMusic() {
    let myAudio = document.querySelector('audio');
    myAudio.src = '(Music) Shinobi - BGM 2 (Arcade).mp3';
    myAudio.volume = 0.2;
    await myAudio.play();
    myAudio.loop = true;
    myAudio.autoplay = true;
    myAudio.controls = true;
    myAudio.preload = 'auto';
};

    playMusic();


    let btnUp = document.querySelector('.btnUp');
    let btnDown = document.querySelector('.btnDown');
    let btnLeft = document.querySelector('.btnLeft');
    let btnRight = document.querySelector('.btnRight');
    let grid = document.querySelector('.grid');

    let dragons = [];
    let existingIndex = [];
    let life = 3;
    let countTreasure = 0;
    let heartArray = Array.from(document.querySelectorAll('i'));


    // Je fais ma classe dragon, quand je crée un dragon, il est push dans le tableau dragons ci-dessus
    class Dragon {
    constructor(index, type, className) {
        this.index = index;
        this.type = type;
        this.className = className;
        
        dragons.push(this);
    }
    };


    // Générer une grille de 20x20
    for (let i = 0; i < 400; i++) {
        let cell = document.createElement('div');
        cell.classList.add('cell');
        grid.appendChild(cell);
    }

    // Créer un tableau contenant toutes les cellules
    const cellArray = Array.from(document.querySelectorAll('.cell'));
    const treasuresImgArray = Array.from(document.querySelectorAll('.treasures img'));

   
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

    let blueDragonIndex = randomIndex();
    while (blueDragonIndex == treasureIndex) {
        blueDragonIndex = randomIndex();
    }
    cellArray[blueDragonIndex].classList.add('blue-dragoon');
    existingIndex.push(blueDragonIndex);


// Ma fonction qui me permet de créer plusieurs dragons, je leur donne un index random au départ
function createDragon (index, type, className) {
    return new Dragon(index, type, className);
}

// Ma fonction qui me permet de donner un index non existant au dragon, et on l'insère dans le tableau cellArray, il prendra la place de son indice-même
// Et biensur, lorsqu'il sera inséré, il sera push dans le tableau existingIndex
function insertDragon(dragonIndex, className) {
        while (dragonIndex == treasureIndex || dragonIndex == playerIndex) {
            dragonIndex = randomIndex();
        }
        console.log(dragonIndex)
        cellArray[dragonIndex].classList.add(className);
        existingIndex.push(dragonIndex);
        return dragonIndex; // Je retourne l'index du dragon au cas où je voudrais le manipuler
    }


createDragon(randomIndex(), 'Dragon', 'blue-dragoon');
createDragon(randomIndex(), 'Dragon', 'purple-dragoon');
createDragon(randomIndex(), 'Dragon', 'green-dragoon');
createDragon(randomIndex(), 'Dragon', 'orange-dragoon');
createDragon(randomIndex(), 'Dragon', 'yellow-dragoon');
createDragon(randomIndex(), 'Boss', 'red-dragoon');


    


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
        let dragonRow = Math.floor(blueDragonIndex / 20);
        let rowDiff = playerRow - dragonRow;

        return rowDiff;
    }

    function calcColDiff() {
        let playerCol = playerIndex % 20;
        let dragonCol = blueDragonIndex % 20;
        let colDiff = playerCol - dragonCol;

        return colDiff;
    }

    // Stocker les mouvements possibles pour le dragon et faire un choix aléatoire
    function dragonMoves() {
        let moves = [];
    if (calcRowDiff() !== 0) {
        // Déplacement vertical
        moves.push(blueDragonIndex + (calcRowDiff() > 0 ? 20 : -20));
    }
    if (calcColDiff() !== 0) {
        // Déplacement horizontal
        moves.push(blueDragonIndex + (calcColDiff() > 0 ? 1 : -1));
    }
    if (moves.length ===0) {
        return blueDragonIndex;
    }
    // Choisir aléatoirement une option parmi celles disponibles
    let newblueDragonIndex = moves[Math.floor(Math.random() * moves.length)];

    return newblueDragonIndex;
    }

    // Changer l'index du joueur
    
    
    // Changer l'index du dragon
    function changeblueDragonIndex() {
        cellArray[blueDragonIndex].classList.remove('blue-dragoon');
        cellArray[newblueDragonIndex].classList.add('blue-dragoon');
        blueDragonIndex = newblueDragonIndex;
        return blueDragonIndex;
    }

    function changePlayerIndex() {
        cellArray[playerIndex].classList.remove('player');
        cellArray[newPlayerIndex].classList.add('player');
        playerIndex = newPlayerIndex;
        return newPlayerIndex;
        }
    

    function lostLife() {
            heartArray[life - 1].classList.add('lost');
            life--;
            newblueDragonIndex = randomIndex();
            life == 1 ? heartArray[0].classList.add('last') : false;
            changeblueDragonIndex();
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
            treasuresImgArray[countTreasure - 1].classList.add('finded');
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

        // A voir pour changer de place la fonction... Répétition en haut sinon bug sur version mobile
        function changePlayerIndex() {
            cellArray[playerIndex].classList.remove('player');
            cellArray[newPlayerIndex].classList.add('player');
            playerIndex = newPlayerIndex;
            return newPlayerIndex;
            }
        
        playerIndex = changePlayerIndex();

        // Index du joueur divisé par 20, ou modulo 20 on arrondit le résultat si division, et cela donne la ligne et la colonne du joueur 
        newblueDragonIndex = dragonMoves();
        changeblueDragonIndex();

    

        // Décrémenter la vie si le joueur se trouve sur le dragon
        
        if (newPlayerIndex == blueDragonIndex) {
            lostLife();
        } else if (life == 0) {
            gameOver();  
        } 

        
        // Gagner si le joueur  trouve les 3 trésors
        if (playerIndex == treasureIndex) {
            // success();
            refreshTreasure();
            // Lorsque je trouve un trésor, je crée un nouveau dragon en allant piocher dans mon tableau dragons au hasard
            let dragon = dragons[Math.floor(Math.random() * dragons.length)]
            console.log(dragon);
            insertDragon(dragon.index, dragon.className);
            // insertDragon(Math.random.dragons.index, Math.random.dragons.className);  
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
        
        playerIndex = changePlayerIndex();

        newblueDragonIndex = dragonMoves();
        changeblueDragonIndex();

        if (newPlayerIndex == blueDragonIndex) {
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




