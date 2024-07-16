let cardCount = 1;

function searchPokemon() {
    const searchInput = document.getElementById('search-input');
    const pokemonName = searchInput.value.toLowerCase();

    fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonName}`)
        .then(response => response.json())
        .then(data => {
            const pokemonList = document.getElementById('pokemon-list');
            const pokemonCard = document.createElement('div');
            pokemonCard.classList.add('pokemon-card', `pokemon-card-${cardCount % 3 + 1}`);

            const pokemonImage = document.createElement('img');
            pokemonImage.src = data.sprites.front_default;
            pokemonImage.alt = data.name;

            const pokemonNameHeader = document.createElement('h2');
            fetch(data.species.url)
                .then(response => response.json())
                .then(speciesData => {
                    const spanishName = speciesData.names.find(name => name.language.name === 'es');
                    pokemonNameHeader.textContent = spanishName ? spanishName.name : data.name;
                });

            const pokemonAbilities = document.createElement('p');
            Promise.all(data.abilities.map(ability => fetch(ability.ability.url)))
                .then(responses => Promise.all(responses.map(response => response.json())))
                .then(abilitiesData => {
                    const abilitiesInSpanish = abilitiesData.map(abilityData => {
                        const spanishAbility = abilityData.names.find(name => name.language.name === 'es');
                        return spanishAbility ? spanishAbility.name : abilityData.name;
                    });
                    pokemonAbilities.textContent = `Habilidades: ${abilitiesInSpanish.join(', ')}`;
                });

            pokemonCard.appendChild(pokemonImage);
            pokemonCard.appendChild(pokemonNameHeader);
            pokemonCard.appendChild(pokemonAbilities);

            pokemonList.appendChild(pokemonCard);

            cardCount++;

            assignCustomBackgroundColor();
        })
        .catch(error => {
            console.error('Error al obtener los datos del Pokémon:', error);
        });
}

function assignCustomBackgroundColor() {
    const pokemonCards = document.querySelectorAll('.pokemon-card');
    const colors = ['#fdfd96', '#ff6961', '#77dd77', '#84b6f4', '#fdcae1', '#b2e2f2', '#fcb7af'];
    pokemonCards.forEach((card, index) => {
        card.style.backgroundColor = colors[index % colors.length];
    });
}

function toggleDarkMode() {
    const body = document.body;
    const darkModeButton = document.querySelector('.dark-mode-button');
    body.classList.toggle('dark-mode');
    if (body.classList.contains('dark-mode')) {
        darkModeButton.textContent = 'Cambiar al modo normal';
    } else {
        darkModeButton.textContent = 'Cambiar al modo oscuro';
    }
}
