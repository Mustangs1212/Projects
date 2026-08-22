let dbPromise;
const EMPTY_DECK_MESSAGE = "Noch keine Stapel vorhanden.";

// changeMode function to switch between light and dark mode
function changeMode() {
    document.body.classList.toggle("light");
    document.querySelector(".stapeluebersicht")?.classList.toggle("light");
    document.querySelector("#stapel-erstellen button")?.classList.toggle("light");
}

// after that point AI has been used
const DB_NAME = 'flashcardApp';
const DB_VERSION = 1;

function openDb() {
    if (dbPromise) {
        return dbPromise;
    }

    dbPromise = new Promise((resolve, reject) => {
        const request = indexedDB.open(DB_NAME, DB_VERSION);

        request.onupgradeneeded = (event) => {
            const db = event.target.result;

            if (!db.objectStoreNames.contains('decks')) {
                const deckStore = db.createObjectStore('decks', { keyPath: 'id', autoIncrement: true });
                deckStore.createIndex('name', 'name', { unique: false });
            }

            if (!db.objectStoreNames.contains('cards')) {
                const cardStore = db.createObjectStore('cards', { keyPath: 'id', autoIncrement: true });
                cardStore.createIndex('deckId', 'deckId', { unique: false });
            }
        };

        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);
    });

    return dbPromise;
}

async function addDeck(name) {
    const db = await openDb();
    return new Promise((resolve, reject) => {
        const tx = db.transaction('decks', 'readwrite');
        const store = tx.objectStore('decks');

        const deck = {
            name,
            createdAt: new Date().toISOString(),
        };

        const request = store.add(deck);

        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);
    });
}


async function getAllDecks() {
    const db = await openDb();
    return new Promise((resolve, reject) => {
        const tx = db.transaction('decks', 'readonly');
        const store = tx.objectStore('decks');

        const request = store.getAll();

        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);
    });
}

async function renderDeckList() {
    const deckListElement = document.getElementById('deckList');
    if (!deckListElement) return;

    // Liste zuerst leeren
    deckListElement.innerHTML = '';

    const decks = await getAllDecks();

    if (decks.length === 0) {
        const li = document.createElement('li');
        li.textContent = EMPTY_DECK_MESSAGE;
        deckListElement.appendChild(li);
        return;
    }

    const fragment = document.createDocumentFragment();

    decks.forEach(deck => {
        const li = document.createElement("li");
        li.textContent = deck.name;
        fragment.appendChild(li);
    });

    deckListElement.appendChild(fragment);
}

document.addEventListener('DOMContentLoaded', () => {
    const createDeckButton = document.getElementById('createDeckButton');
    const deckNameInput = document.getElementById('deckNameInput');

    if (createDeckButton && deckNameInput) {
        createDeckButton.addEventListener('click', async () => {
            const name = deckNameInput.value.trim();
            const decks = await getAllDecks();

            if (decks.some(deck => deck.name === name)) {
                alert("Dieser Stapel existiert bereits.");
                return;
            }
            if (!name) return;

            try {
                await addDeck(name);
                deckNameInput.value = "";
                await renderDeckList();
            } catch (error) {
                console.error(error);
                alert("Der Stapel konnte nicht erstellt werden.");
            }
        });
    }

    // Beim ersten Laden: Stapel aus IndexedDB anzeigen
    renderDeckList();
});

