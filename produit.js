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
        // Assure que le prix est une chaîne de caractères
        price = String(price);
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
                    <img class="pokemonDetails-image" src="${pokemonDetails.sprites.front_default}" alt="${name}">
                    <p class="pokemonDetails-type">Type(s): ${getMultipleValues(pokemonDetails.types, 'type')}</p>
                    <p class="pokemonDetails-stats">Statistiques: ${getStatsList(pokemonDetails.stats)}</p>
                    <p class="pokemonDetails-abilities">Talent(s): ${getMultipleValues(pokemonDetails.abilities, 'ability')}</p>
                    <p class="pokemonDetails-prix">Prix: ${price}</p>
                    <button class="pokemonDetails-button">Capturer</button>
                `;

                const captureButton = pokemonDetailsContainer.querySelector('.pokemonDetails-button');
                captureButton.addEventListener('click', () => {
                    handleCaptureButtonClick({ name, price });
                });
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
        return `<ul>${stats.map(stat => `<li>${stat.stat.name}: ${stat.base_stat}</li>`).join('')}</ul>`;
    }

    // Fonction pour obtenir une représentation en chaîne de caractères des valeurs multiples
    function getMultipleValues(values, key) {
        return values.map(value => value[key].name).join(', ');
    }

    // Fonction pour gérer le clic sur le bouton "Capturer"
    function handleCaptureButtonClick(pokemon) {
        captureCounter++;
        cartCounterElement.textContent = captureCounter.toString();
        localStorage.setItem('captureCounter', captureCounter.toString());

        const capturedPokemon = {
            name: pokemon.name,
            price: pokemon.price,
        };

        const capturedPokemons = JSON.parse(localStorage.getItem('capturedPokemons')) || [];
        capturedPokemons.push(capturedPokemon);
        localStorage.setItem('capturedPokemons', JSON.stringify(capturedPokemons));
    }

    // Afficher les détails du Pokémon
    displayPokemonDetails();
});
