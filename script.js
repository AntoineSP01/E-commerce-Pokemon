document.addEventListener('DOMContentLoaded', () => {
    // Initialisation du compteur de captures
    let captureCounter = 0;
    // Élément du compteur dans le panier
    const cartCounterElement = document.getElementById('cart-counter');
    // Conteneur pour les Pokémon aléatoires
    let randomPokemonContainer;

    // Fonction pour obtenir des Pokémon aléatoires depuis le PokeAPI
    async function getRandomPokemon(count) {
        const randomPokemon = [];
        const apiUrl = 'https://pokeapi.co/api/v2/pokemon/';

        while (randomPokemon.length < count) {
            const randomIndex = Math.floor(Math.random() * 50) + 1;
            const url = `${apiUrl}${randomIndex}`;

            try {
                const response = await fetch(url);
                const data = await response.json();

                const pokemonInfo = {
                    name: data.name,
                    image: data.sprites.front_default,
                    price: Math.floor(Math.random() * 1000) + 1,
                };

                if (!randomPokemon.some(p => p.name === pokemonInfo.name)) {
                    randomPokemon.push(pokemonInfo);
                }
            } catch (error) {
                console.error('Error fetching Pokémon data:', error);
            }
        }

        return randomPokemon;
    }

    // Fonction pour afficher les Pokémon aléatoires sur la page d'accueil
    async function displayRandomPokemon(count) {
        const randomPokemon = await getRandomPokemon(count);
        randomPokemonContainer = document.getElementById('random-pokemon');

        randomPokemon.forEach(pokemon => {
            const pokemonCard = document.createElement('div');
            pokemonCard.classList.add('pokemon-card');
            const formattedPrice = formatPrice(pokemon.price);

            pokemonCard.innerHTML = `
                <img src="${pokemon.image}" alt="${pokemon.name}">
                <p class="pokemon-card-name">${pokemon.name}</p>
                <p class="pokemon-card-price">Prix: ${formattedPrice}</p>
                <button class="pokemon-card-button">Capturer</button>
            `;

            pokemonCard.addEventListener('click', (event) => {
                if (!event.target.classList.contains('pokemon-card-button')) {
                    window.location.href = `produit.html?name=${pokemon.name}&price=${formattedPrice}`;
                } else {
                    handleCaptureButtonClick(pokemon, pokemon.price);
                }
            });

            randomPokemonContainer.appendChild(pokemonCard);
        });
    }

    // Fonction pour formater le prix avec séparation des milliers et suppression des décimales inutiles
    function formatPrice(price) {
        return price.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR', minimumFractionDigits: 0 });
    }

    // Fonction pour récupérer et afficher tous les Pokémon depuis le PokeAPI
    async function displayAllPokemon() {
        const apiUrl = 'https://pokeapi.co/api/v2/pokemon?limit=50';

        try {
            const response = await fetch(apiUrl);
            const data = await response.json();
            const pokemonList = data.results;

            pokemonList.forEach(async (pokemon) => {
                const pokemonData = await getPokemonData(pokemon.url);
                createPokemonCard(pokemonData);
            });
        } catch (error) {
            console.error('Error fetching Pokémon data:', error);
        }
    }

    // Fonction pour récupérer les données détaillées d'un Pokémon
    async function getPokemonData(url) {
        const response = await fetch(url);
        return await response.json();
    }

    // Fonction pour créer une carte Pokémon et l'ajouter à la liste
    function createPokemonCard(pokemon) {
        const pokemonListContainer = document.getElementById('pokemon-list');
        const pokemonCard = document.createElement('div');
        pokemonCard.classList.add('pokemon-list-container');

        const randomPrice = Math.floor(Math.random() * 1000) + 1;
        const formattedPrices = formatPrice(randomPrice);

        pokemonCard.innerHTML = `
            <img class="pokemon-list-image" src="${pokemon.sprites.front_default}" alt="${pokemon.name}">
            <p class="pokemon-list-name">${pokemon.name}</p>
            <p class="pokemon-list-price">Prix: ${formattedPrices}</p>
            <button class="pokemon-list-button">Capturer</button>
        `;

        pokemonCard.addEventListener('click', (event) => {
            if (!event.target.classList.contains('pokemon-list-button')) {
                window.location.href = `produit.html?name=${pokemon.name}&price=${formattedPrices}`;
            } else {
                handleCaptureButtonClick(pokemon, randomPrice);
            }
        });

        pokemonListContainer.appendChild(pokemonCard);
    }

    // Fonction pour gérer le clic sur le bouton "Capturer"
    function handleCaptureButtonClick(pokemon, price) {
        captureCounter++;

        cartCounterElement.textContent = captureCounter.toString();

        const capturedPokemon = {
            name: pokemon.name,
            price: price,
        };

        const capturedPokemons = JSON.parse(localStorage.getItem('capturedPokemons')) || [];
        capturedPokemons.push(capturedPokemon);

        localStorage.setItem('capturedPokemons', JSON.stringify(capturedPokemons));
        localStorage.setItem('captureCounter', captureCounter.toString());
    }

    // Récupérer la valeur du compteur depuis le stockage local
    const storedCaptureCounter = localStorage.getItem('captureCounter');

    if (storedCaptureCounter !== null) {
        captureCounter = +storedCaptureCounter;
        cartCounterElement.textContent = captureCounter.toString();
    }

    // Afficher trois Pokémon aléatoires sur la page d'accueil
    displayRandomPokemon(3);

    // Afficher tous les Pokémon depuis le PokeAPI
    displayAllPokemon();
});
