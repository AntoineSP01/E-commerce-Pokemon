document.addEventListener('DOMContentLoaded', () => {
  let captureCounter = 0; // Initialiser le compteur à zéro
  const cartCounterElement = document.getElementById('cart-counter');
  let randomPokemonContainer; // Déclarer randomPokemonContainer ici

  // Fonction pour obtenir des Pokémon aléatoires depuis le PokeAPI
  async function getRandomPokemon(count) {
      const randomPokemon = [];
      const apiUrl = 'https://pokeapi.co/api/v2/pokemon/';

      while (randomPokemon.length < count) {
          const randomIndex = Math.floor(Math.random() * 150) + 1; // Il y a actuellement 898 Pokémon dans le PokeAPI
          const url = `${apiUrl}${randomIndex}`;

          try {
              const response = await fetch(url);
              const data = await response.json();

              const pokemonInfo = {
                  name: data.name,
                  image: data.sprites.front_default,
                  price: Math.floor(Math.random() * 1000) + 1, // Prix aléatoire entre 1 et 100000
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

  // Fonction pour afficher les Pokémon aléatoires dans une div
  // Fonction pour afficher les Pokémon aléatoires dans une div
async function displayRandomPokemon(count) {
  const randomPokemon = await getRandomPokemon(count);
  randomPokemonContainer = document.getElementById('random-pokemon'); // Initialiser randomPokemonContainer ici

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
      randomPokemonContainer.appendChild(pokemonCard);

      // Ajouter le gestionnaire d'événements au bouton "Capturer"
      const captureButton = pokemonCard.querySelector('.pokemon-card-button');
      captureButton.addEventListener('click', handleCaptureButtonClick);
  });
}


  // Fonction pour formater le prix avec séparation des milliers et suppression des décimales inutiles
  function formatPrice(price) {
      return price.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR', minimumFractionDigits: 0 });
  }

  // Fonction pour récupérer et afficher tous les Pokémon depuis le PokeAPI
  async function displayAllPokemon() {
      const apiUrl = 'https://pokeapi.co/api/v2/pokemon?limit=50'; // Il y a actuellement 898 Pokémon dans le PokeAPI
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
      const pokemonCard = document.createElement('div');
      pokemonCard.classList.add('pokemon-list-container');

      // Génération d'un prix aléatoire entre 1 et 1000
      const randomPrice = Math.floor(Math.random() * 1000) + 1;

      pokemonCard.innerHTML = `
          <img class="pokemon-list-image" src="${pokemon.sprites.front_default}" alt="${pokemon.name}">
          <p class="pokemon-list-name">${pokemon.name}</p>
          <p class="pokemon-list-price">Prix: ${randomPrice} ₽</p>
          <button class="pokemon-list-button">Capturer</button>
      `;

      // Ajouter un gestionnaire d'événements pour rediriger vers la page produit avec le prix
      // pokemonCard.addEventListener('click', () => {
      //   window.location.href = `produit.html?name=${pokemon.name}&price=${randomPrice}`;
      // });

      pokemonListContainer.appendChild(pokemonCard);

      const captureButton = pokemonCard.querySelector('.pokemon-list-button');
      captureButton.addEventListener('click', handleCaptureButtonClick);
  }

  // Ajoutez le gestionnaire d'événements pour le clic sur le bouton "Capturer"
  function handleCaptureButtonClick() {
      // Incrémentez le compteur
      captureCounter++;

      // Mettez à jour l'affichage du compteur dans la barre de navigation
      cartCounterElement.textContent = captureCounter.toString();
  }

  // Appel de la fonction pour afficher trois Pokémon aléatoires (vous pouvez changer le nombre selon vos besoins)
  displayRandomPokemon(3);

  const pokemonListContainer = document.getElementById('pokemon-list');

  // Appel de la fonction pour afficher tous les Pokémon
  displayAllPokemon();
});

