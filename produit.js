document.addEventListener('DOMContentLoaded', () => {
    // Fonction pour récupérer le nom du Pokémon depuis l'URL
    function getPokemonDetailsFromUrl() {
        const urlParams = new URLSearchParams(window.location.search);
        const name = urlParams.get('name');
        const price = urlParams.get('price');
        return { name, price };
    }

    // Fonction pour afficher les détails du Pokémon sur la page produit
    async function displayPokemonDetails() {
        const { name, price } = getPokemonDetailsFromUrl();

        if (name) {
            try {
                const { pokemonDetails } = await getPokemonDetailsByName(name);

                const pokemonDetailsContainer = document.getElementById('pokemon-details-container');

                // Afficher les détails de base du Pokémon
                pokemonDetailsContainer.innerHTML = `
                    <h2 class="pokemonDetails-name">${name}</h2>
                    <img class="pokemonDetails-image" src="${pokemonDetails.sprites.front_default}" alt="${name}">
                    <p class="pokemonDetails-type">Type(s): ${getMultipleValues(pokemonDetails.types, 'type')}</p>
                    <p class="pokemonDetails-stats">Statistiques: ${getStatsList(pokemonDetails.stats)}</p>
                    <p class="pokemonDetails-abilities">Talent(s): ${getMultipleValues(pokemonDetails.abilities, 'ability')}</p>
                    <p class="pokemonDetails-prix">Prix: ${price} €</p>
                    <button class="pokemonDetails-button">Capturer</button>
                    <!-- Ajoutez d'autres détails du Pokémon ici selon vos besoins -->
                `;
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

    // Fonction pour obtenir une représentation de chaîne de caractères des statistiques du Pokémon
    function getStatsList(stats) {
        return `<ul>${stats.map(stat => `<li>${stat.stat.name}: ${stat.base_stat}</li>`).join('')}</ul>`;
    }

    // Fonction pour obtenir une représentation de chaîne de caractères de valeurs multiples
    function getMultipleValues(values, key) {
        return values.map(value => value[key].name).join(', ');
    }

    // Appel de la fonction pour afficher les détails du Pokémon
    displayPokemonDetails();
});
