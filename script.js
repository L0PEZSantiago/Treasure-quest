    document.addEventListener('DOMContentLoaded', () => {

        // Ci-dessous le script JS pour gérer la génération de la grille et le placement du coffre, des rochers et du trésor.
        let grid = document.querySelector('.grid');
        let existingIndex = [];
        // Générer une grille de 20x20
        for (let i = 0; i < 400; i++) {
            let cell = document.createElement('div');
            cell.classList.add('cell');
            grid.appendChild(cell);
        }
        const cellArray = Array.from(document.querySelectorAll('.cell'));

        function success() {
            grid.classList.toggle('success')
            grid.innerHTML = `<h2>Bravo, vous avez trouvé le trésor!</h2>
                              <button class="btn-replay">Rejouer!</button>`;

            const btn = document.querySelector('.btn-replay');
            btn.addEventListener('click', () => {
                location.reload();
                document.querySelector('.grid').classList.remove('.success');
            });
        }

        // Ajouter des rochers aléatoirement
        // Ajouter le trésor aléatoirement
        let treasureIndex = Math.floor(Math.random() * cellArray.length);
        cellArray[treasureIndex].classList.add('treasure');
        existingIndex.push(treasureIndex);


        let dragonIndex = Math.floor(Math.random() * cellArray.length);
        cellArray[dragonIndex].classList.add('blue-dragon');
        existingIndex.push(dragonIndex);



        // Ajouter le player
        playerIndex = cellArray[0];
        playerIndex.classList.add('player');
        existingIndex.push(playerIndex);
        // Création d'une boucle pour ajouter des rochers aléatoirement
        let count = 0;
        while (count != 50) {
            let rockIndex = Math.floor(Math.random() * cellArray.length);

            if (!existingIndex.includes(rockIndex) && rockIndex != 0) {
                cellArray[rockIndex].classList.add('rock');
                existingIndex.push(rockIndex);
                count++;
            }
        }
        console.log(existingIndex)
        // Fin boucle treasure
        // Faire fonctionner le déplacement du joueur avec les touches directionnelles.
        let player = document.querySelector('.player');
        playerIndex = cellArray.indexOf(player);
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



            if (newPlayerIndex == treasureIndex) {
                success();
            }

        }); // Fin de la gestion des touches




    });




