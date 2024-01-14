document.addEventListener('DOMContentLoaded', () => {
    const cartCounterElement = document.getElementById('cart-counter');
    const storedCaptureCounter = localStorage.getItem('captureCounter');
    let captureCounter = storedCaptureCounter ? parseInt(storedCaptureCounter, 10) : 0;
    cartCounterElement.textContent = captureCounter.toString();

    // Fonction pour extraire les détails du Pokémon depuis l'URL
    function getPokemonDetailsFromUrl() {
        const urlParams = new URLSearchParams(window.location.search);
        const name = urlParams.get('name');
        let price = urlParams.get('price');
        
        price = parseFloat(price);
        price = isNaN(price) ? 0 : price;
    
        return { name, price };
    }

    // Fonction pour afficher les détails du Pokémon sur la page produit
    async function displayPokemonDetails() {
        const { name, price } = getPokemonDetailsFromUrl();

        if (name) {
            try {
                const { pokemonDetails } = await getPokemonDetailsByName(name);

                const pokemonDetailsContainer = document.getElementById('pokemon-details-container');
                
                pokemonDetailsContainer.innerHTML = `
                    <h2 class="pokemonDetails-name">${name}</h2>
                    <img class="pokemonDetails-image move-animation" src="${pokemonDetails.sprites.front_default}" alt="${name}">
                    <p class="pokemonDetails-type">Type(s): ${getMultipleValues(pokemonDetails.types, 'type')}</p>
                    <br>
                    <p class="pokemonDetails-stats">Statistiques: ${getStatsList(pokemonDetails.stats)}</p>
                    <br>
                    <p class="pokemonDetails-abilities">Talent(s): ${getMultipleValues(pokemonDetails.abilities, 'ability')}</p>
                    <br>
                    <p class="pokemonDetails-prix">Prix: ${price} €</p>
                    <br>
                    <button class="pokemonDetails-button">Capturer</button>
                `;

                const captureButton = pokemonDetailsContainer.querySelector('.pokemonDetails-button');
                captureButton.addEventListener('click', () => {
                    handleCaptureButtonClick({ name, price });
                });

                //Fonction pour animer l'image du Pokémon
                const pokemonImage = pokemonDetailsContainer.querySelector('.pokemonDetails-image');

                function animateImage() {
                    pokemonImage.style.transition = 'transform 0.5s ease-in-out';
                    pokemonImage.style.transform = 'translateY(-10px)'; 
                }

                function resetImagePosition() {
                    pokemonImage.style.transition = 'transform 0.5s ease-in-out';
                    pokemonImage.style.transform = 'translateY(0)';
                }

                pokemonImage.addEventListener('mouseenter', animateImage);
                pokemonImage.addEventListener('mouseleave', resetImagePosition);

            } catch (error) {
                console.error('Error fetching Pokémon details:', error);
            }
        } else {
            console.error('No Pokémon name found in the URL parameters.');
        }
    }

    // Fonction pour obtenir les détails d'un Pokémon par son nom depuis le PokeAPI
    async function getPokemonDetailsByName(name) {
        const apiUrl = `https://pokeapi.co/api/v2/pokemon/${name}`;
        const response = await fetch(apiUrl);
        const pokemonDetails = await response.json();
        return { pokemonDetails };
    }

    // Fonction pour obtenir une représentation en chaîne de caractères des statistiques du Pokémon
    function getStatsList(stats) {
        return `<ul>${stats.map(stat => `<li class="${getStatColorClass(stat.stat.name)}">${stat.stat.name}: ${stat.base_stat}</li>`).join('')}</ul>`;
    }

    // Fonction pour obtenir une représentation en chaîne de caractères des valeurs multiples
    function getMultipleValues(values, key) {
        return values.map(value => value[key].name).join(', ');
    }

    // Fonction pour obtenir la classe de couleur en fonction de la statistique
    function getStatColorClass(statName) {
        switch (statName) {
            case 'attack':
            case 'special-attack':
                return 'red';
            case 'defense':
            case 'special-defense':
                return 'brown';
            case 'hp':
                return 'green';
            case 'speed':
                return 'blue';
            default:
                return '';
        }
    }

    // Fonction pour gérer le clic sur le bouton "Capturer"
    function handleCaptureButtonClick(pokemon) {
        captureCounter++;
        cartCounterElement.textContent = captureCounter.toString();
        localStorage.setItem('captureCounter', captureCounter.toString());

        const capturedPokemon = {
            name: pokemon.name,
            price: +pokemon.price,
        };

        const capturedPokemons = JSON.parse(localStorage.getItem('capturedPokemons')) || [];
        capturedPokemons.push(capturedPokemon);
        localStorage.setItem('capturedPokemons', JSON.stringify(capturedPokemons));
    }

    // Afficher les détails du Pokémon
    displayPokemonDetails();
});
