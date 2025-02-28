document.addEventListener("DOMContentLoaded", () => {
    console.log("DOM chargé");
    const index = getRandomIndex();
});

const myAudio = document.querySelector('audio');

(async function () {
    myAudio.src = 'musics/Zelda Main Theme Song.mp3';
    myAudio.volume = 0.05;
    await myAudio.play();
    myAudio.loop = true;
    myAudio.autoplay = true;
    myAudio.controls = true;
    myAudio.preload = 'auto';
})();

/* ----------------- VARIABLES DOM ----------------- */
const checksboxs = document.querySelectorAll('input[type="checkbox"]');
const btnUp = document.querySelector('.btnUp');
const btnDown = document.querySelector('.btnDown');
const btnLeft = document.querySelector('.btnLeft');
const btnRight = document.querySelector('.btnRight');
const grid = document.querySelector('.grid');
let btnStart = document.querySelector('.btn-set-difficulty');

/* ----------------- VARIABLES GLOBALES ----------------- */
let difficultyMax = 14;

let isMobile = localStorage.getItem('isMobile');
console.log(isMobile == 'true');
let nbrRows;
if (isMobile == 'true') {
    nbrRows = 10;
} else {
    nbrRows = 20;
}

let nbrColumns = nbrRows;
console.log(nbrRows, "nbrRows", "nbrColumns", nbrColumns);
const dragons = [];
const portals = [];
const bluePortalsIndexs = [];
const purplePortalsIndexs = [];
const existingIndex = [];
const dragonsClassesNames = ['blue-dragoon', 'green-dragoon', 'orange-dragoon', 'purple-dragoon', 'red-dragoon', 'yellow-dragoon'];
let countTreasure = 0;
let totalForWin;
const treasuresDiv = document.querySelector('.treasures');

/* ----------------- LISTENER SUR LES CHECKBOXS ----------------- */
let checkboxTarget;
checksboxs.forEach(checkbox => {
    checkbox.addEventListener('change', e => {
        if (e.currentTarget.checked) {
            // Parcourt tous les checkboxes et décoche ceux qui ne sont pas le currentTarget
            checksboxs.forEach(box => {
                if (box !== e.currentTarget) {
                    box.checked = false;
                }
            });
            checkboxTarget = e.currentTarget;
            console.log(checkboxTarget);
        }
    });
});



/* ----------------- LISTENER SUR LE BOUTON START ----------------- */

btnStart.addEventListener('click', () => {
    const input = document.querySelector('input');
    totalForWin = input.value;
    if (checkboxTarget == undefined || input.value == '') {
        alert('Veuillez entrer les paramètres requis');
        return;
    } else if (checkboxTarget.id == "Mobile") {
        isMobile = true;
    } else if (checkboxTarget.id == "Ordinateur") {
        isMobile = false;
    }
    // Soit je fais if checkboxTarget(à vérifier), soit je fais une boolean isChecked
    if (input.value > 20) {
        input.value = 20;
        alert('Veuillez choisir une valeur comprise entre 1 et 14');
        console.log("click", totalForWin);
        location.reload();
    } else {
        localStorage.setItem('totalForWin', totalForWin);
        localStorage.setItem('isMobile', isMobile);
        document.querySelector('.difficulty').style.display = 'none';
        checkboxTarget.checked = false;
        location.reload();
    }
})


/* ----------------- INITIALISATION ----------------- */

// Je dois faire en sorte que quand j'ai choisi la quantité, la page se recharge et le jeu commence
// Si j'ai choisi une difficulté, elle sera forcémment dans le local storage car je la stocke au chargement de la page
// Comme ça lorsque je clique sur GO, cela recharge la page mais je reprends la difficulté choisie avant le rechargement
if (localStorage.getItem('totalForWin')) {
    totalForWin = localStorage.getItem('totalForWin');
    document.querySelector('.difficulty').style.display = 'none';
    // Je dois supprimer le localStorage une fois qu'on a fait son choix
    localStorage.removeItem('totalForWin');
}

// QUANTITE DE TREASURE
for (let i = 0; i < totalForWin; i++) {
    treasuresDiv.innerHTML += `<img src="assets/treasure.png" alt="treasure">
`;
}

// QUANTITE DE VIE
let life;

// Gestion des vies selons la quantité de treasures choisie/dfficulté + stockage du max de vies du début
totalForWin <= 5 ? life = 3 : totalForWin > 5 && totalForWin <= 8 ? life = 4 : life = 5;
let maxLife = life;

// Affichage des vies selon la quantité de vies choisie
for (let i = 0; i < life; i++) {
    document.querySelector('.lifes').innerHTML += `<i class="fa-solid fa-heart"></i>
`;
}
let heartArray = Array.from(document.querySelectorAll('i'));


/* ----------------- CLASSES ----------------- */

class Dragon {
    constructor(index, type, className, isActive = false) {
        this.index = index;
        this.type = type;
        this.className = className;
        this.isActive = isActive;
        dragons[dragons.length] = this; // push is slower than direct assignment
    }
};

class Portal {
    constructor(index, color, className) {
        this.index = index;
        this.color = color;
        this.className = className;
        this.row = calculateRow(this.index, nbrRows);
        this.col = calculateCol(this.index, nbrColumns);

        // console.log("Class:", this.className, "Row:", this.row, "Col:", this.col);

        // Je dois calculer la col et la row de chaque portal
        calculateCol(index, nbrColumns);
        calculateRow(index, nbrRows);
    }
}

/* ----------------- CREATION GRID ----------------- */

// Générer une grille de 20x20
if (isMobile == 'true') {
    for (let i = 0; i < 200; i++) {
        let cell = document.createElement('div');
        cell.classList.add('cell');
        grid.appendChild(cell);
    }
} else {
    for (let i = 0; i < 400; i++) {
        let cell = document.createElement('div');
        cell.classList.add('cell');
        grid.appendChild(cell);
    }
}


// Créer un tableau contenant toutes les cellules
const cellArray = Array.from(document.querySelectorAll('.cell'));
const treasuresImgArray = Array.from(document.querySelectorAll('.treasures img'));


// Ajouter le player
let playerIndex = cellArray[0];
playerIndex.classList.add('player');
existingIndex.push(0);



/* ----------------- CREATION ET POSITIONNEMENT DES PORTALS ----------------- */
// Je crée les violets en premier pour pouvoir les comparer avec les bleus
let purplePortal = new Portal(getRandomIndex(), "purple", "short-portal-purple");
let purplePortal2 = new Portal(getRandomIndex(), "purple", "short-portal-purple");
let bluePortal = new Portal(getRandomIndex(), "blue", "short-portal-blue");
let bluePortal2 = new Portal(getRandomIndex(), "blue", "short-portal-blue");

if (isMobile == 'true') {
    nbrColumns = 20; // A changer tout en haut
};

let lowerValue = Math.floor(nbrRows * 0.2);   // Ici j'obiens 30 % des lignes donc partie haut, donc ça renvoit 6 car 20*0.3.
let higherValue = Math.floor(nbrRows * 0.6);  // Ici j'obiens 60 % des lignes donc partie bas, donc cela renvoit 13 car 20*0.6.
console.log("nbrRows:", nbrRows, "nbrColumns:", nbrColumns);
console.log("lowerValue:", lowerValue, "higherValue:", higherValue);
// Ce qu'il faut simplement retenir, ce sont les résultats de ces opérations, ils s'adaptent au nombre de lignes et colonnes de notre grille.

// Le portail violet ne peut dépasser une zone de 6 row/col de hauteur/largeur (en haut à gauche), donc tant que sa row ou sa col que l'on calcule avec la méthode de classe est supéreure à 6...
// On boucle jusqu'au moment ou l'on trouve un index valide, en recréant directement le portal car à la création on lui donne un randomIndex, et on calcule sa row et col.
while (purplePortal.row > lowerValue || purplePortal.col > lowerValue || purplePortal.index == 0) {
    purplePortal = new Portal(getRandomIndex(), "purple", "short-portal-purple");
}

// Tant que valeur row du portal2 est inférieur à higherValue... Donc ce portail sera sur la partie basse de la grille, ce portail sera en bas à droite. 
// Car tant que sa col est inférieur à higherValue, on change son index donc inférieur à 13... Changer jusqu'à que la row soit supérieure à higherValue. Donc à partir de la colonne 13
while (purplePortal2.row < higherValue || purplePortal2.col < higherValue) {
    purplePortal2 = new Portal(getRandomIndex(), "purple", "short-portal-purple");
} console.log(`PurplePortal -- MinRow = ${higherValue} | minCol: ${higherValue}\n, ${purplePortal2.row},  ${purplePortal2.col}`);


// En haut à droite
while (bluePortal.row > lowerValue || bluePortal.col < higherValue) {
    bluePortal = new Portal(getRandomIndex(), "blue", "short-portal-blue");
} 

// En bas à gauche
while (bluePortal2.row < higherValue || bluePortal2.col > lowerValue) {
    bluePortal2 = new Portal(getRandomIndex(), "blue", "short-portal-blue");

}

// Si tant que row > lowerValue, positionnement = En haut
// Si tant que row < higherValue, positionnement = En bas
// Si tant que col > lowerValue, positionnement = En gauche
// Si tant que col < higherValue, positionnement = En droite


portals.push(bluePortal2, bluePortal, purplePortal2, purplePortal);

// Je stocke les indexs des portals bleus et violets dans des tableaux distincts pour pouvoir les comparer plus tard si jamais
portals.forEach(portal => {
    if (portal.color === 'blue') {
        bluePortalsIndexs.push(portal.index);
    } else {
        purplePortalsIndexs.push(portal.index);
    }
});

// J'ajoute des portails en fonction de la difficulté
if (totalForWin > 8) {
    portals.forEach(portal => {
        console.log(portal);
        if (portal.color == "purple") {
            cellArray[portal.index].classList.add('short-portal-purple');
            existingIndex.push(portal.index);
        } else {
            cellArray[portal.index].classList.add('short-portal-blue');
            existingIndex.push(portal.index);
        }
    })
} else {
    portals.forEach(portal => {
        if (portal.color == "purple") {
            cellArray[portal.index].classList.add('short-portal-purple');
            existingIndex.push(portal.index);
        } else {
            bluePortal.index = null;
            bluePortal2.index = null;

        }
    })
}

/* ----------------- CREATION ET POSITIONNEMENT DES TRÉSORS ----------------- */
let heartIndex = getRandomIndex();

// Ajouter le trésor aléatoirement

let treasureIndex = getRandomIndex();

while (treasureIndex == existingIndex.includes(treasureIndex)) { treasureIndex = getRandomIndex(); }

if (treasureIndex != existingIndex.includes(treasureIndex)) {
    cellArray[treasureIndex].classList.add('treasure');
    existingIndex.push(treasureIndex);
}


/* ----------------- CREATION ET POSITIONNEMENT DES DRAGONS ----------------- */

// Ma fonction qui me permet de créer plusieurs dragons, je leur donne un index random au départ
createRandomDragons(50);
let dragon = dragons[Math.floor(Math.random() * dragons.length)]
dragon.isActive = true;
insertDragon(dragon.index, dragon.className);


/* ----------------- CREATION ET POSITIONNEMENT DES ENVIRONMENTS ----------------- */

// Création d'une boucle pour ajouter des rochers aléatoirement
if (totalForWin <= 8 && isMobile != 'true') {
    createEnvironment(60, 'rock');
    createEnvironment(30, 'grass');
} else if (totalForWin <= 8 && isMobile == 'true') {
    createEnvironment(30, 'rock');
    createEnvironment(15, 'grass');
}
else if (totalForWin > 8 && totalForWin <= 12 && isMobile != 'true') {
    createEnvironment(50, 'rock');
    createEnvironment(25, 'grass');
} else if (totalForWin > 8 && totalForWin <= 12 && isMobile == 'true') {
    createEnvironment(25, 'rock');
    createEnvironment(12, 'grass');
} else if (totalForWin > 12 && isMobile != 'true') {
    createEnvironment(40, 'rock');
    createEnvironment(20, 'grass');
} else if (totalForWin > 12 && isMobile == 'true') {
    createEnvironment(20, 'rock');
    createEnvironment(10, 'grass');
}


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

function calculateRow(portalIndex, nbrRows) {
    return Math.floor(portalIndex / nbrRows);
}

function calculateCol(portalIndex, nbrCols) {
    return portalIndex % nbrCols
}

function getRandomIndex() {
    return Math.floor(Math.random() * cellArray.length);
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


    console.log(playerIndex, purplePortal.index);
    // Si joueurIndex == purplePortal.index, new joueurIndex = purplePortal2.index
    let recentlyTeleported = false;
    function teleportation(portal, portal2) {
        if (playerIndex === portal.index && !recentlyTeleported) {
            recentlyTeleported = true;
            newPlayerIndex = portal2.index;
            cellArray[playerIndex].classList.remove('player');
            cellArray[newPlayerIndex].classList.add('player');
            playerIndex = newPlayerIndex;
            setTimeout(() => { recentlyTeleported = false; }, 300);
            return playerIndex;
        }
    }

    teleportation(purplePortal, purplePortal2);
    teleportation(purplePortal2, purplePortal);
    teleportation(bluePortal, bluePortal2);
    teleportation(bluePortal2, bluePortal);

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
            heartArray[0].classList.contains('last') ? heartArray[0].classList.remove('last') : false;
            !heartArray[0].classList.contains('last') ? myAudio.playbackRate = 1 : false;
            heartArray[life - 1].classList.remove('lost');
            heartArray[life - 1].classList.add('getLife');
            cellArray[heartIndex].classList.remove('heart');
        }

    }
}); // Fin de la gestion des touches



// ------------------------- VERSION MOBILE ------------------------------ //
document.querySelector('.gamepad').addEventListener('touchstart', (e) => {
    let newPlayerIndex;
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

    cellArray[playerIndex].classList.remove('player');
    cellArray[newPlayerIndex].classList.add('player');
    playerIndex = newPlayerIndex;

    let recentlyTeleported = false;
    function teleportation(portal, portal2) {
        if (playerIndex === portal.index && !recentlyTeleported) {
            recentlyTeleported = true;
            newPlayerIndex = portal2.index;
            cellArray[playerIndex].classList.remove('player');
            cellArray[newPlayerIndex].classList.add('player');
            playerIndex = newPlayerIndex;
            setTimeout(() => { recentlyTeleported = false; }, 300);
            return playerIndex;
        }
    }

    teleportation(purplePortal, purplePortal2);
    teleportation(purplePortal2, purplePortal);
    teleportation(bluePortal, bluePortal2);
    teleportation(bluePortal2, bluePortal);


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


        if (countTreasure == 3 || countTreasure == 6 || countTreasure == 9 || countTreasure == 11 || countTreasure == 13 || countTreasure == 15 || countTreasure == 17 || countTreasure == 19) {
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
            heartArray[0].classList.contains('last') ? heartArray[0].classList.remove('last') : false;
            heartArray[life - 1].classList.remove('lost');
            heartArray[life - 1].classList.add('getLife');
            cellArray[heartIndex].classList.remove('heart');
        }
    }
});
// });




