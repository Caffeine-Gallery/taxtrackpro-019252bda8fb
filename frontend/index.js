import { backend } from 'declarations/backend';

document.addEventListener('DOMContentLoaded', async () => {
    const taxpayerList = document.getElementById('taxpayer-list');
    const addTaxpayerButton = document.getElementById('add-taxpayer-button');
    const modal = document.getElementById('modal');
    const closeModal = document.getElementsByClassName('close')[0];
    const addTaxpayerForm = document.getElementById('add-taxpayer-form');
    const searchInput = document.getElementById('search-input');
    const searchButton = document.getElementById('search-button');

    async function displayTaxpayers(taxpayers) {
        taxpayerList.innerHTML = '';
        taxpayers.forEach(taxpayer => {
            const taxpayerElement = document.createElement('div');
            taxpayerElement.classList.add('taxpayer');
            taxpayerElement.innerHTML = `
                <h3>${taxpayer.firstName} ${taxpayer.lastName}</h3>
                <p><strong>TID:</strong> ${taxpayer.TID}</p>
                <p><strong>Address:</strong> ${taxpayer.address}</p>
            `;
            taxpayerList.appendChild(taxpayerElement);
        });
    }

    async function loadTaxpayers() {
        const taxpayers = await backend.getAllTaxPayers();
        displayTaxpayers(taxpayers);
    }

    addTaxpayerButton.onclick = () => {
        modal.style.display = 'block';
    };

    closeModal.onclick = () => {
        modal.style.display = 'none';
    };

    window.onclick = (event) => {
        if (event.target == modal) {
            modal.style.display = 'none';
        }
    };

    addTaxpayerForm.onsubmit = async (e) => {
        e.preventDefault();
        const tid = document.getElementById('tid').value;
        const firstName = document.getElementById('firstName').value;
        const lastName = document.getElementById('lastName').value;
        const address = document.getElementById('address').value;

        await backend.addTaxPayer(tid, firstName, lastName, address);
        modal.style.display = 'none';
        addTaxpayerForm.reset();
        await loadTaxpayers();
    };

    searchButton.onclick = async () => {
        const query = searchInput.value;
        if (query) {
            const searchResults = await backend.searchTaxPayers(query);
            displayTaxpayers(searchResults);
        } else {
            await loadTaxpayers();
        }
    };

    await loadTaxpayers();
});
