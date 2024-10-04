document.addEventListener('DOMContentLoaded', function() {
  const petList = document.getElementById('petList');
  const tabButtons = document.querySelectorAll('.tab-button');
  const helpButton = document.querySelector('.help-button');
  const helpModal = document.getElementById('helpModal');
  const addPetButton = document.getElementById('addPetButton');
  const addPetModal = document.getElementById('addPetModal');
  const addPetForm = document.getElementById('addPetForm');
  const closeButtons = document.querySelectorAll('.close-button');
  const petDetailsModal = document.getElementById('petDetailsModal');
  const petDetailsName = document.getElementById('petDetailsName');
  const petDetailsImage = document.getElementById('petDetailsImage');
  const petDetailsLocation = document.getElementById('petDetailsLocation');
  const petDetailsType = document.getElementById('petDetailsType');
  const deletePetButton = document.getElementById('deletePetButton');

  let pets = JSON.parse(localStorage.getItem('pets')) || [
      { id: 1, name: 'Luna', location: 'São Paulo, SP', image: 'https://v0.dev/placeholder.svg', type: 'cat' },
      { id: 2, name: 'Max', location: 'Rio de Janeiro, RJ', image: 'https://v0.dev/placeholder.svg', type: 'dog' },
      { id: 3, name: 'Bella', location: 'Belo Horizonte, MG', image: 'https://v0.dev/placeholder.svg', type: 'dog' },
      { id: 4, name: 'Oliver', location: 'Porto Alegre, RS', image: 'https://v0.dev/placeholder.svg', type: 'cat' },
      { id: 5, name: 'Charlie',  location: 'Curitiba, PR', image: 'https://v0.dev/placeholder.svg', type: 'dog' },
      { id: 6, name: 'Lucy', location: 'Salvador, BA', image: 'https://v0.dev/placeholder.svg', type: 'cat' },
      { id: 7, name: 'Milo', location: 'Brasília, DF', image: 'https://v0.dev/placeholder.svg', type: 'dog' },
      { id: 8, name: 'Nala', location: 'Fortaleza, CE', image: 'https://v0.dev/placeholder.svg', type: 'cat' },
      { id: 9, name: 'Rocky', location: 'Manaus, AM', image: 'https://v0.dev/placeholder.svg', type: 'dog' },
      { id: 10, name: 'Simba', location: 'Recife, PE', image: 'https://v0.dev/placeholder.svg', type: 'cat' },
      { id: 11, name: 'Daisy', location: 'Goiânia, GO', image: 'https://v0.dev/placeholder.svg', type: 'dog' },
      { id: 12, name: 'Loki', location: 'Belém, PA', image: 'https://v0.dev/placeholder.svg', type: 'cat' },
  ];

  const petsPerPage = 8;
  let currentPage = 1;
  let currentFilter = 'todos';

  function savePetsToLocalStorage() {
      localStorage.setItem('pets', JSON.stringify(pets));
  }

  function renderPets() {
      petList.innerHTML = '';
      const startIndex = (currentPage - 1) * petsPerPage;
      const endIndex = startIndex + petsPerPage;
      const filteredPets = pets.filter(pet => currentFilter === 'todos' || 
                                              (currentFilter === 'caes' && pet.type === 'dog') || 
                                              (currentFilter === 'gatos' && pet.type === 'cat'));
      const petsToShow = filteredPets.slice(startIndex, endIndex);

      petsToShow.forEach(pet => {
          const petCard = document.createElement('div');
          petCard.className = 'pet-card';
          petCard.innerHTML = `
              <img src="${pet.image}" alt="${pet.name}">
              <div class="pet-info">
                  <h3>${pet.name}</h3>
                  <p>${pet.location}</p>
              </div>
          `;
          petCard.addEventListener('click', () => showPetDetails(pet));
          petList.appendChild(petCard);
      });

      updatePagination(filteredPets.length);
  }

  function updatePagination(totalPets) {
      const totalPages = Math.ceil(totalPets / petsPerPage);
      const paginationContainer = document.querySelector('.pagination');
      paginationContainer.innerHTML = '';

      for (let i = 1; i <= totalPages; i++) {
          const pageButton = document.createElement('button');
          pageButton.className = `page-button ${i === currentPage ? 'active' : ''}`;
          pageButton.textContent = i;
          pageButton.addEventListener('click', () => {
              currentPage = i;
              renderPets();
          });
          paginationContainer.appendChild(pageButton);
      }

      if (totalPages > 1) {
          const nextButton = document.createElement('button');
          nextButton.className = 'page-button';
          nextButton.textContent = '>';
          nextButton.addEventListener('click', () => {
              if (currentPage < totalPages) {
                  currentPage++;
                  renderPets();
              }
          });
          paginationContainer.appendChild(nextButton);
      }
  }

  function showPetDetails(pet) {
      petDetailsName.textContent = pet.name;
      petDetailsImage.src = pet.image;
      petDetailsImage.alt = pet.name;
      petDetailsLocation.textContent = `Localização: ${pet.location}`;
      petDetailsType.textContent = `Tipo: ${pet.type === 'dog' ? 'Cão' : 'Gato'}`;
      petDetailsModal.style.display = 'block';

      deletePetButton.onclick = () => {
          if (confirm('Tem certeza que deseja excluir este pet?')) {
              pets = pets.filter(p => p.id !== pet.id);
              savePetsToLocalStorage();
              renderPets();
              petDetailsModal.style.display = 'none';
          }
      };
  }

  tabButtons.forEach(button => {
      button.addEventListener('click', function() {
          tabButtons.forEach(btn => btn.classList.remove('active'));
          this.classList.add('active');
          currentFilter = this.dataset.tab;
          currentPage = 1;
          renderPets();
      });
  });

  helpButton.addEventListener('click', () => {
      helpModal.style.display = 'block';
  });

  addPetButton.addEventListener('click', () => {
      addPetModal.style.display = 'block';
  });

  closeButtons.forEach(button => {
      button.addEventListener('click', () => {
          helpModal.style.display = 'none';
          addPetModal.style.display = 'none';
          petDetailsModal.style.display = 'none';
      });
  });

  window.addEventListener('click', (event) => {
      if (event.target === helpModal || event.target === addPetModal || event.target === petDetailsModal) {
          helpModal.style.display = 'none';
          addPetModal.style.display = 'none';
          petDetailsModal.style.display = 'none';
      }
  });

  addPetForm.addEventListener('submit', function(e) {
      e.preventDefault();
      const newPet = {
          id: Date.now(),
          name: document.getElementById('petName').value,
          type: document.getElementById('petType').value,
          location: document.getElementById('petLocation').value,
          image: document.getElementById('petImage').value
      };
      pets.unshift(newPet);
      savePetsToLocalStorage();
      addPetModal.style.display = 'none';
      currentPage = 1;
      currentFilter = 'todos';
      tabButtons.forEach(btn => btn.classList.remove('active'));
      tabButtons[0].classList.add('active');
      renderPets();
      addPetForm.reset();
  });

  renderPets();
});
