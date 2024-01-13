document.addEventListener('DOMContentLoaded', () => {
    const capturedPokemonsContainer = document.getElementById('captured-pokemons');
    let capturedPokemons = JSON.parse(localStorage.getItem('capturedPokemons')) || [];

    // Fonction pour récupérer les données détaillées d'un Pokémon
    async function getPokemonData(url) {
        try {
            const response = await fetch(url);
            return await response.json();
        } catch (error) {
            throw new Error(`Error fetching Pokémon details: ${error.message}`);
        }
    }

    // Fonction pour afficher les Pokémon capturés
    async function displayCapturedPokemons() {
        const totalPriceElement = document.getElementById('total-price');
        capturedPokemonsContainer.innerHTML = ''; // Effacez le contenu actuel

        for (const pokemon of capturedPokemons) {
            try {
                const pokemonData = await getPokemonData(`https://pokeapi.co/api/v2/pokemon/${pokemon.name}`);
                createPokemonCard(pokemon, pokemonData);
            } catch (error) {
                console.error(error.message);
            }
        }

        updateTotalPrice();

        // Fonction pour créer une carte Pokémon et l'ajouter à la liste
        function createPokemonCard(pokemon, pokemonData) {
            const pokemonCard = document.createElement('div');
            pokemonCard.classList.add('captured-pokemons-card');

            pokemonCard.innerHTML = `
                <span class="delete-icon" onclick="removePokemon('${pokemon.name}')">&#10006;</span>
                <img src="${pokemonData.sprites.front_default}" alt="${pokemon.name}">
                <p class="captured-pokemons-name">${pokemon.name}</p>
                <p class="captured-pokemons-price">Prix: ${formatPrice(pokemon.price)}</p>
            `;

            capturedPokemonsContainer.appendChild(pokemonCard);
        }

        // Fonction pour mettre à jour le prix total
        function updateTotalPrice() {
            const totalPrice = capturedPokemons.reduce((total, pokemon) => total + pokemon.price, 0);
            totalPriceElement.textContent = `Total: ${formatPrice(totalPrice)}`;
        }
    }

    // Fonction pour formater le prix avec séparation des milliers et suppression des décimales inutiles
    function formatPrice(price) {
        return price.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR', minimumFractionDigits: 0 });
    }

    // Fonction pour supprimer un Pokémon du panier
    window.removePokemon = function (pokemonName) {
        const normalizedPokemonName = pokemonName.toLowerCase();

        const indexToRemove = capturedPokemons.findIndex(pokemon => pokemon.name.toLowerCase() === normalizedPokemonName);

        if (indexToRemove !== -1) {
            capturedPokemons.splice(indexToRemove, 1);

            localStorage.setItem('capturedPokemons', JSON.stringify(capturedPokemons));

            displayCapturedPokemons();

            localStorage.setItem('captureCounter', capturedPokemons.length);

            location.reload();
        }
    };

    // Affichez les Pokémon capturés lors du chargement de la page
    displayCapturedPokemons();
});
