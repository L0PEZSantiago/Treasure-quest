// document.addEventListener('DOMContentLoaded', (e) => {
// Ci-dessous le script JS pour gérer la génération de la grille et le placement du coffre, des rochers et du trésor.
let myAudio = document.querySelector('audio');

(async function () {
    myAudio.src = 'musics/Zelda Main Theme Song.mp3';
    myAudio.volume = 0.05;
    await myAudio.play();
    myAudio.loop = true;
    myAudio.autoplay = true;
    myAudio.controls = true;
    myAudio.preload = 'auto';
})();






let btnUp = document.querySelector('.btnUp');
let btnDown = document.querySelector('.btnDown');
let btnLeft = document.querySelector('.btnLeft');
let btnRight = document.querySelector('.btnRight');
let grid = document.querySelector('.grid');
let input = document.querySelector('input');
let btnStart = document.querySelector('.btn-set-difficulty');


let dragons = [];
let existingIndex = [];
let dragonsClassesNames = ['blue-dragoon', 'green-dragoon', 'orange-dragoon', 'purple-dragoon', 'red-dragoon', 'yellow-dragoon'];
let countTreasure = 0;
let totalForWin = input.value;
treasuresDiv = document.querySelector('.treasures');

btnStart.addEventListener('click', () => {
    totalForWin = input.value;
    localStorage.setItem('totalForWin', totalForWin);
    document.querySelector('.difficulty').style.display = 'none';
    location.reload();
})

// Je dois faire en sorte que quand j'ai choisi la quantité, la page se recharge et le jeu commence

if (localStorage.getItem('totalForWin')) {
    totalForWin = localStorage.getItem('totalForWin');
    document.querySelector('.difficulty').style.display = 'none';
    // Je dois supprimer le localStorage une fois qu'on a fait son choix
    localStorage.removeItem('totalForWin');
}

for (let i = 0; i < totalForWin; i++) {
    treasuresDiv.innerHTML += `<img src="assets/treasure.png" alt="treasure">
`;
}

// QUANTITE DE VIE
let life;

totalForWin <= 5 ? life = 3 : totalForWin > 5 && totalForWin <= 8 ? life = 4 : life = 5;
let maxLife = life;

for (let i = 0; i < life; i++) {
    document.querySelector('.lifes').innerHTML += `<i class="fa-solid fa-heart"></i>
`;
}
let heartArray = Array.from(document.querySelectorAll('i'));



// Je fais ma classe dragon, quand je crée un dragon, il est push dans le tableau dragons ci-dessus
class Dragon {
    constructor(index, type, className, isActive = false) {
        this.index = index;
        this.type = type;
        this.className = className;
        this.isActive = isActive;
        dragons[dragons.length] = this; // push is slower than direct assignment
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
let heartIndex = getRandomIndex();

// Ajouter le trésor aléatoirement

let treasureIndex = getRandomIndex();

while (treasureIndex == 0) { treasureIndex = getRandomIndex(); }

if (treasureIndex != 0) {
    cellArray[treasureIndex].classList.add('treasure');
    existingIndex.push(treasureIndex);
}



// Ma fonction qui me permet de créer plusieurs dragons, je leur donne un index random au départ
createRandomDragons(100);

console.log(dragons);


let dragon = dragons[Math.floor(Math.random() * dragons.length)]
dragon.isActive = true;
insertDragon(dragon.index, dragon.className);



// Création d'une boucle pour ajouter des rochers aléatoirement

createEnvironment(50, 'rock');
createEnvironment(30, 'grass');




// Faire fonctionner le déplacement du joueur avec les touches directionnelles.
let player = document.querySelector('.player');
playerIndex = cellArray.indexOf(player);


// ----------------------------------- FONCTIONS ------------------------------------ //

function healingSound() {
    const healingSound = new Audio('sounds/magic_spell_10-39689.mp3');
    healingSound.volume = 0.7;
    healingSound.play();
}

function treasureFounded() {
    const chestSound = new Audio('sounds/arcade-ui-30-229499.mp3'); // Assurez-vous que le chemin est correct
    chestSound.volume = 0.8; // Ajustez le volume selon vos besoins
    chestSound.play();
}

function movementsSound() {
    const moveSound = new Audio('sounds/movement-101711.mp3');
    moveSound.volume = 0.8;
    moveSound.play();
}

function dragonRoarSound() {
    const dragonRoar = new Audio('sounds/dragon-hurt-47161.mp3');
    dragonRoar.volume = 0.5;
    dragonRoar.play();
}
// Création d'une boucle pour ajouter des rochers aléatoirement ou autre objet selon sa classe
function createEnvironment(numElements, className) {
    let placedElements = 0;
    while (placedElements < numElements) {
        let index = getRandomIndex();
        while (existingIndex.includes(index) || index === playerIndex + 1 || index === playerIndex + 20) {
            index = getRandomIndex();
        }
        cellArray[index].classList.add(className);
        existingIndex.push(index);
        placedElements++;
    }
}
function getRandomIndex() {
    return Math.floor(Math.random() * cellArray.length);
}

// Pour créer un dragon précis
function createDragon(index, type, className) {
    return new Dragon(index, type, className);
}

// Ma fonction qui me permet de donner un index non existant au dragon, et on l'insère dans le tableau cellArray, il prendra la place de son indice-même
// Et biensur, lorsqu'il sera inséré, il sera push dans le tableau existingIndex
function insertDragon(dragonIndex, className) {
    while (existingIndex.includes(dragonIndex)) {
        dragonIndex = getRandomIndex();
    }
    if (!existingIndex.includes(dragonIndex)) {
        cellArray[dragonIndex].classList.add(className);
        existingIndex.push(dragonIndex);
    }
    return dragonIndex; // Je retourne l'index du dragon au cas où je voudrais le manipuler
}

function createRandomDragons(quantity) {
    for (let i = 0; i < quantity; i++) {
        createDragon(getRandomIndex(), 'Dragon', dragonsClassesNames[Math.floor(Math.random() * dragonsClassesNames.length)]);
    }
}

function calcRowDiff2(dragonIndex) {
    return Math.floor((playerIndex - dragonIndex) / 20);
    // Comme si je faisais playerIndex / 20, dragonIndex /20 pour avoir à chacun sa ligne puis je soustrait le résultat de chaque opération et je retourne le resultat -- RowDiff
}

function calcColDiff2(dragonIndex) {
    return (playerIndex % 20) - (dragonIndex % 20);
}

function dragonMoves2(dragonIndex) {
    const rowDiff = calcRowDiff2(dragonIndex);
    const colDiff = calcColDiff2(dragonIndex);
    if (rowDiff === 0 && colDiff === 0) return dragonIndex;

    const potentialMoves = [];
    if (rowDiff !== 0) potentialMoves.push(dragonIndex + (rowDiff > 0 ? 20 : -20));
    if (colDiff !== 0) potentialMoves.push(dragonIndex + (colDiff > 0 ? 1 : -1));

    return potentialMoves[Math.floor(Math.random() * potentialMoves.length)];
}

// Changer l'index du dragon
function changeDragonIndex(dragonIndex, newDragonIndex, className) {
    // Si sur le prochain index du dragon se trouve  un autre dragon, alors rien ne se passe, on utilise .some avec le endsWith
    if (Array.from(cellArray[newDragonIndex].classList).some(cls => cls.endsWith('dragoon'))) {
        return dragonIndex;
    } else {
        cellArray[dragonIndex].classList.remove(className);
        cellArray[newDragonIndex].classList.add(className);
        dragonIndex = newDragonIndex;
        return dragonIndex;
    }
}

function changePlayerIndex() {
    cellArray[playerIndex].classList.remove('player');
    cellArray[newPlayerIndex].classList.add('player');
    playerIndex = newPlayerIndex;
    return newPlayerIndex;
}

function lostLife2() {
    heartArray[life - 1].classList.remove('getLife');
    heartArray[life - 1].classList.add('lost');
    life--;
    life == 1 ? heartArray[0].classList.add('last') : false;
    return getRandomIndex();
}

function gameOver() {
    alert('Game Over');
    location.reload();
}

function success() {
    grid.classList.toggle('success')
    grid.innerHTML = `<h2>Bravo, vous avez trouvé tous les trésors!</h2>
                                <button class="btn-replay">Rejouer!</button>`;
    document.querySelector('audio').pause();
    document.querySelector('.lifes').style.display = 'none';
    document.querySelector('.treasures').style.display = 'none';
    document.querySelector('.gamepad').style.display = 'none';
    const btn = document.querySelector('.btn-replay');
    btn.addEventListener('click', () => {
        location.reload();
        document.querySelector('.grid').classList.remove('.success');
    });
}

function refreshTreasure() {
    countTreasure++;
    treasuresImgArray[countTreasure - 1].classList.add('finded');
    countTreasure == totalForWin ? success() : false;
    cellArray[treasureIndex].classList.remove('treasure');
    treasureIndex = getRandomIndex();

    while (treasureIndex == playerIndex || existingIndex.includes(treasureIndex)) {
        treasureIndex = getRandomIndex();
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

    movementsSound();
    if (life == 1) {
        myAudio.playbackRate = 1.5;
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

    dragons.forEach(dragon => {
        if (dragon.isActive) {
            let newDragonIndex = dragonMoves2(dragon.index);
            dragon.index = changeDragonIndex(dragon.index, newDragonIndex, dragon.className);

            if (newPlayerIndex == dragon.index) {
                dragonRoarSound();
                newDragonIndex = lostLife2();
                dragon.index = changeDragonIndex(dragon.index, newDragonIndex, dragon.className);

                // Si le joueur perd une vie, on le met en rouge
                // cellArray[newPlayerIndex].style.backgroundf = 'rgb(255, 0, 0)';

            } else if (life == 0) {
                gameOver();
            }
        }
    });

    // Gagner si le joueur  trouve les 3 trésors
    if (playerIndex == treasureIndex) {

        treasureFounded();
        refreshTreasure();
        // Lorsque je trouve un trésor, je crée un nouveau dragon en allant piocher dans mon tableau dragons au hasard
        // let dragon = dragons[Math.floor(Math.random() * dragons.length)]

        let dragonsNotActive = dragons.filter(dragon => !dragon.isActive);
        let dragon = dragonsNotActive[Math.floor(Math.random() * dragonsNotActive.length)];
        dragon.isActive = true;
        dragon.index = insertDragon(dragon.index, dragon.className);
        // insertDragon(Math.random.dragons.index, Math.random.dragons.className);  

        if (countTreasure == 3 || countTreasure == 6 || countTreasure == 9 || countTreasure == 11 || countTreasure == 13) {
            while (existingIndex.includes(heartIndex)) { heartIndex = getRandomIndex(); }
            cellArray[heartIndex].classList.add('heart');
            console.log(`Coeur ajouté en ${heartIndex}`);
            return heartIndex;
        }
    }

    if (playerIndex == heartIndex) {
        if (life == maxLife) {
            return
        } else {
            life++;
            healingSound();
            heartArray[life - 1].classList.remove('lost');
            heartArray[life - 1].classList.add('getLife');
            cellArray[heartIndex].classList.remove('heart');
        }
    }
}); // Fin de la gestion des touches



// ------------------------- VERSION MOBILE ------------------------------ //
document.querySelector('.gamepad').addEventListener('touchstart', (e) => {

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

    movementsSound();
    if (cellArray[newPlayerIndex].classList.contains('rock')) {
        return;
    }

    if (life == 1) {
        myAudio.playbackRate = 1.5;
    }

    playerIndex = changePlayerIndex();


    dragons.forEach(dragon => {
        if (dragon.isActive) {
            let newDragonIndex = dragonMoves2(dragon.index);
            dragon.index = changeDragonIndex(dragon.index, newDragonIndex, dragon.className);

            if (playerIndex == dragon.index) {
                dragonRoarSound();
                newDragonIndex = lostLife2();
                dragon.index = changeDragonIndex(dragon.index, newDragonIndex, dragon.className);


            } else if (life == 0) {
                gameOver();
            }
        }
    });

    if (playerIndex == treasureIndex) {
        // success();
        treasureFounded();
        refreshTreasure();
        // Lorsque je trouve un trésor, je crée un nouveau dragon en allant piocher dans mon tableau dragons au hasard
        // let dragon = dragons[Math.floor(Math.random() * dragons.length)]

        let dragonsNotActive = dragons.filter(dragon => !dragon.isActive);
        let dragon = dragonsNotActive[Math.floor(Math.random() * dragonsNotActive.length)];
        dragon.isActive = true;
        dragon.index = insertDragon(dragon.index, dragon.className);
        // insertDragon(Math.random.dragons.index, Math.random.dragons.className);

        if (countTreasure == 3 || countTreasure == 6 || countTreasure == 9 || countTreasure == 11 || countTreasure == 13) {
            while (existingIndex.includes(heartIndex)) { heartIndex = getRandomIndex(); }
            cellArray[heartIndex].classList.add('heart');
            console.log(`Coeur ajouté en ${heartIndex}`);
            return heartIndex;
        }
    }

    if (playerIndex == heartIndex) {
        if (life == maxLife) {
            return;
        } else {
            life++;
            healingSound();
            heartArray[life - 1].classList.remove('lost');
            heartArray[life - 1].classList.add('getLife');
            cellArray[heartIndex].classList.remove('heart');
        }
    }
});
// });




