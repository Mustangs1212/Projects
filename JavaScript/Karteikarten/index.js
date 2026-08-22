"use strict";

/*
============================================================
ENGI – Karteikarten App
============================================================

Funktionen:

- IndexedDB
- Stapel erstellen/löschen
- Karten erstellen/bearbeiten/löschen
- Lernmodus
- Lernfortschritt
- Dark/Light Mode
- Statistikdaten
- Bestätigungsdialoge
- Responsive Oberfläche

============================================================
*/


/* ============================================================
   GLOBALE VARIABLEN
============================================================ */

let dbPromise = null;

let currentDeckId = null;

let learnQueue = [];
let currentLearnCard = null;
let answerShown = false;

let isProcessingAnswer = false;

let modalConfirmAction = null;

let messageTimer = null;


/* ============================================================
   DATENBANK
============================================================ */

const DB_NAME = "flashcardApp";
const DB_VERSION = 1;

const EMPTY_DECK_MESSAGE = "Noch keine Stapel vorhanden.";
const EMPTY_CARD_MESSAGE = "Noch keine Karten vorhanden.";


/* ============================================================
   HILFSFUNKTIONEN
============================================================ */

function getElement(id) {
    return document.getElementById(id);
}


function showMessage(message, type = "success") {

    const element = getElement("appMessage");

    if (!element) {
        return;
    }

    clearTimeout(messageTimer);

    element.textContent = message;

    element.className = "app-message";

    if (type === "success") {
        element.classList.add("success");
    }

    if (type === "error") {
        element.classList.add("error");
    }

    element.hidden = false;

    messageTimer = setTimeout(() => {
        element.hidden = true;
    }, 3500);
}


/* ============================================================
   DARK / LIGHT MODE
============================================================ */

function applyTheme(theme) {

    const body = document.body;

    const themeIcon = getElement("themeIcon");
    const themeText = getElement("themeText");
    const themeButton = getElement("themeButton");

    if (!body) {
        return;
    }

    if (theme === "dark") {

        body.classList.add("dark");

        if (themeIcon) {
            themeIcon.textContent = "☀️";
        }

        if (themeText) {
            themeText.textContent = "Hell";
        }

        if (themeButton) {
            themeButton.setAttribute(
                "aria-label",
                "Zum hellen Modus wechseln"
            );
        }

    } else {

        body.classList.remove("dark");

        if (themeIcon) {
            themeIcon.textContent = "🌙";
        }

        if (themeText) {
            themeText.textContent = "Dunkel";
        }

        if (themeButton) {
            themeButton.setAttribute(
                "aria-label",
                "Zum dunklen Modus wechseln"
            );
        }
    }
}


function changeMode() {

    const isDark = document.body.classList.contains("dark");

    const newTheme = isDark
        ? "light"
        : "dark";

    localStorage.setItem(
        "engi-theme",
        newTheme
    );

    applyTheme(newTheme);
}


function loadTheme() {

    const savedTheme =
        localStorage.getItem("engi-theme");

    if (savedTheme === "dark" || savedTheme === "light") {

        applyTheme(savedTheme);

        return;
    }

    const prefersDark =
        window.matchMedia &&
        window.matchMedia(
            "(prefers-color-scheme: dark)"
        ).matches;

    applyTheme(
        prefersDark
            ? "dark"
            : "light"
    );
}


/* ============================================================
   INDEXED DB ÖFFNEN
============================================================ */

function openDb() {

    if (dbPromise) {
        return dbPromise;
    }

    if (!window.indexedDB) {

        return Promise.reject(
            new Error(
                "IndexedDB wird von diesem Browser nicht unterstützt."
            )
        );
    }

    dbPromise = new Promise((resolve, reject) => {

        const request =
            indexedDB.open(
                DB_NAME,
                DB_VERSION
            );


        request.onupgradeneeded = (event) => {

            const db =
                event.target.result;


            /* Stapel */

            if (!db.objectStoreNames.contains("decks")) {

                const deckStore =
                    db.createObjectStore(
                        "decks",
                        {
                            keyPath: "id",
                            autoIncrement: true
                        }
                    );

                deckStore.createIndex(
                    "name",
                    "name",
                    {
                        unique: false
                    }
                );
            }


            /* Karten */

            if (!db.objectStoreNames.contains("cards")) {

                const cardStore =
                    db.createObjectStore(
                        "cards",
                        {
                            keyPath: "id",
                            autoIncrement: true
                        }
                    );

                cardStore.createIndex(
                    "deckId",
                    "deckId",
                    {
                        unique: false
                    }
                );
            }
        };


        request.onsuccess = () => {

            const db =
                request.result;

            db.onversionchange = () => {
                db.close();
            };

            resolve(db);
        };


        request.onerror = () => {

            dbPromise = null;

            reject(request.error);
        };
    });

    return dbPromise;
}


/* ============================================================
   STAPEL ERSTELLEN
============================================================ */

async function addDeck(name) {

    const db = await openDb();

    return new Promise((resolve, reject) => {

        const transaction =
            db.transaction(
                "decks",
                "readwrite"
            );

        const store =
            transaction.objectStore("decks");

        const deck = {
            name: name.trim(),
            createdAt: new Date().toISOString()
        };

        const request =
            store.add(deck);

        request.onsuccess = () => {
            resolve(request.result);
        };

        request.onerror = () => {
            reject(request.error);
        };

        transaction.onerror = () => {
            reject(transaction.error);
        };
    });
}


/* ============================================================
   STAPEL LADEN
============================================================ */

async function getAllDecks() {

    const db = await openDb();

    return new Promise((resolve, reject) => {

        const transaction =
            db.transaction(
                "decks",
                "readonly"
            );

        const store =
            transaction.objectStore("decks");

        const request =
            store.getAll();

        request.onsuccess = () => {

            const decks =
                request.result || [];

            decks.sort((a, b) => {

                return a.name.localeCompare(
                    b.name,
                    "de"
                );
            });

            resolve(decks);
        };

        request.onerror = () => {
            reject(request.error);
        };
    });
}


/* ============================================================
   STAPEL LÖSCHEN
============================================================ */

async function deleteDeck(deckId) {

    const db = await openDb();

    return new Promise((resolve, reject) => {

        const transaction =
            db.transaction(
                ["decks", "cards"],
                "readwrite"
            );

        const deckStore =
            transaction.objectStore("decks");

        const cardStore =
            transaction.objectStore("cards");

        const deckKey =
            Number(deckId);


        deckStore.delete(deckKey);


        const index =
            cardStore.index("deckId");

        const request =
            index.getAll(deckKey);


        request.onsuccess = () => {

            const cards =
                request.result || [];

            cards.forEach(card => {
                cardStore.delete(card.id);
            });
        };


        transaction.oncomplete = () => {
            resolve();
        };

        transaction.onerror = () => {
            reject(transaction.error);
        };
    });
}


/* ============================================================
   STAPELÜBERSICHT RENDERN
============================================================ */

async function renderDeckList() {

    const deckList =
        getElement("deckList");

    const deckCountBadge =
        getElement("deckCountBadge");


    if (!deckList) {
        return;
    }


    deckList.innerHTML = "";


    try {

        const decks =
            await getAllDecks();


        if (deckCountBadge) {
            deckCountBadge.textContent =
                decks.length;
        }


        if (decks.length === 0) {

            const empty =
                document.createElement("div");

            empty.className =
                "empty-state";

            empty.innerHTML = `
                <div class="empty-state-icon">📚</div>
                <strong>Noch keine Stapel</strong>
                <span>Erstelle unten deinen ersten Lernstapel.</span>
            `;

            deckList.appendChild(empty);

            return;
        }


        const fragment =
            document.createDocumentFragment();


        for (const deck of decks) {

            const card =
                document.createElement("button");

            card.type = "button";

            card.className =
                "deck-card";


            card.innerHTML = `
                <div class="deck-card-top">
                    <span class="deck-icon">📖</span>
                    <span class="deck-arrow">→</span>
                </div>

                <h3></h3>

                <p>
                    Zum Stapel öffnen
                </p>
            `;


            const title =
                card.querySelector("h3");

            title.textContent =
                deck.name;


            card.addEventListener(
                "click",
                () => {
                    openDeck(deck);
                }
            );


            fragment.appendChild(card);
        }


        deckList.appendChild(fragment);


    } catch (error) {

        console.error(
            "Fehler beim Laden der Stapel:",
            error
        );

        showMessage(
            "Die Stapel konnten nicht geladen werden.",
            "error"
        );
    }
}


/* ============================================================
   STAPEL ÖFFNEN
============================================================ */

async function openDeck(deck) {

    const deckOverviewSection =
        getElement("deckOverviewSection");

    const createDeckSection =
        getElement("stapel-erstellen");

    const deckView =
        getElement("deckView");

    const deckViewName =
        getElement("deckViewName");


    if (
        !deckOverviewSection ||
        !createDeckSection ||
        !deckView ||
        !deckViewName
    ) {
        return;
    }


    currentDeckId =
        Number(deck.id);


    deckViewName.textContent =
        deck.name;


    deckOverviewSection.hidden =
        true;

    createDeckSection.hidden =
        true;

    deckView.hidden =
        false;


    await updateDeckProgress();


    showNewCardArea(false);
    showCardOverviewArea(false);
    showLearnArea(false);


    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
}


/* ============================================================
   DECK SCHLIESSEN
============================================================ */

function closeDeck() {

    const deckOverviewSection =
        getElement("deckOverviewSection");

    const createDeckSection =
        getElement("stapel-erstellen");

    const deckView =
        getElement("deckView");


    currentDeckId =
        null;

    learnQueue =
        [];

    currentLearnCard =
        null;

    answerShown =
        false;


    if (deckView) {
        deckView.hidden = true;
    }

    if (deckOverviewSection) {
        deckOverviewSection.hidden = false;
    }

    if (createDeckSection) {
        createDeckSection.hidden = false;
    }


    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
}


/* ============================================================
   KARTE ERSTELLEN
============================================================ */

async function addCard(
    deckId,
    front,
    back
) {

    const db =
        await openDb();


    return new Promise((resolve, reject) => {

        const transaction =
            db.transaction(
                "cards",
                "readwrite"
            );

        const store =
            transaction.objectStore("cards");


        const card = {

            deckId:
                Number(deckId),

            front:
                front.trim(),

            back:
                back.trim(),

            createdAt:
                new Date().toISOString(),

            correctStreak:
                0,

            isActive:
                true,

            totalAnswers:
                0,

            correctAnswers:
                0,

            wrongAnswers:
                0,

            lastReviewedAt:
                null
        };


        const request =
            store.add(card);


        request.onsuccess = () => {
            resolve(request.result);
        };

        request.onerror = () => {
            reject(request.error);
        };

        transaction.onerror = () => {
            reject(transaction.error);
        };
    });
}


/* ============================================================
   KARTE AKTUALISIEREN
============================================================ */

async function updateCard(card) {

    const db =
        await openDb();


    return new Promise((resolve, reject) => {

        const transaction =
            db.transaction(
                "cards",
                "readwrite"
            );

        const store =
            transaction.objectStore("cards");


        const request =
            store.put(card);


        request.onsuccess = () => {
            resolve(request.result);
        };

        request.onerror = () => {
            reject(request.error);
        };

        transaction.onerror = () => {
            reject(transaction.error);
        };
    });
}


/* ============================================================
   KARTE LÖSCHEN
============================================================ */

async function deleteCard(cardId) {

    const db =
        await openDb();


    return new Promise((resolve, reject) => {

        const transaction =
            db.transaction(
                "cards",
                "readwrite"
            );

        const store =
            transaction.objectStore("cards");


        const request =
            store.delete(
                Number(cardId)
            );


        request.onsuccess = () => {
            resolve();
        };

        request.onerror = () => {
            reject(request.error);
        };

        transaction.onerror = () => {
            reject(transaction.error);
        };
    });
}


/* ============================================================
   KARTEN EINES STAPELS
============================================================ */

async function getCardsForDeck(deckId) {

    const db =
        await openDb();


    return new Promise((resolve, reject) => {

        const transaction =
            db.transaction(
                "cards",
                "readonly"
            );

        const store =
            transaction.objectStore("cards");

        const index =
            store.index("deckId");


        const request =
            index.getAll(
                Number(deckId)
            );


        request.onsuccess = () => {

            const cards =
                request.result || [];

            cards.sort((a, b) => {

                return a.id - b.id;
            });

            resolve(cards);
        };


        request.onerror = () => {
            reject(request.error);
        };
    });
}


/* ============================================================
   KARTENÜBERSICHT
============================================================ */

async function renderCardList() {

    const cardList =
        getElement("cardList");


    if (!cardList) {
        return;
    }


    cardList.innerHTML = "";


    if (currentDeckId === null) {
        return;
    }


    try {

        const cards =
            await getCardsForDeck(
                currentDeckId
            );


        if (cards.length === 0) {

            const li =
                document.createElement("li");

            li.className =
                "empty-state";

            li.innerHTML = `
                <div class="empty-state-icon">🃏</div>
                <strong>Noch keine Karten</strong>
                <span>Erstelle die erste Karte für diesen Stapel.</span>
            `;

            cardList.appendChild(li);

            return;
        }


        const fragment =
            document.createDocumentFragment();


        cards.forEach(card => {

            const li =
                document.createElement("li");

            li.className =
                "card-item";


            const content =
                document.createElement("div");

            content.className =
                "card-content";


            const frontContainer =
                document.createElement("div");

            const frontLabel =
                document.createElement("span");

            frontLabel.className =
                "card-side-label";

            frontLabel.textContent =
                "VORDERSEITE";


            const frontDiv =
                document.createElement("div");

            frontDiv.className =
                "card-front";

            frontDiv.textContent =
                card.front;


            frontContainer.appendChild(
                frontLabel
            );

            frontContainer.appendChild(
                frontDiv
            );


            const backContainer =
                document.createElement("div");

            const backLabel =
                document.createElement("span");

            backLabel.className =
                "card-side-label";

            backLabel.textContent =
                "RÜCKSEITE";


            const backDiv =
                document.createElement("div");

            backDiv.className =
                "card-back";

            backDiv.textContent =
                card.back;


            backContainer.appendChild(
                backLabel
            );

            backContainer.appendChild(
                backDiv
            );


            content.appendChild(
                frontContainer
            );

            content.appendChild(
                backContainer
            );


            /* Aktionen */

            const actions =
                document.createElement("div");

            actions.className =
                "card-actions";


            const editButton =
                document.createElement("button");

            editButton.type =
                "button";

            editButton.textContent =
                "Bearbeiten";


            editButton.addEventListener(
                "click",
                () => {

                    showCardEditor(
                        li,
                        card
                    );
                }
            );


            const deleteButton =
                document.createElement("button");

            deleteButton.type =
                "button";

            deleteButton.textContent =
                "Löschen";


            deleteButton.addEventListener(
                "click",
                () => {

                    openConfirmModal(
                        "Karte löschen?",
                        "Diese Karte wird dauerhaft gelöscht.",
                        async () => {

                            await deleteCard(
                                card.id
                            );

                            await renderCardList();

                            await updateDeckProgress();

                            showMessage(
                                "Karte wurde gelöscht."
                            );
                        }
                    );
                }
            );


            actions.appendChild(
                editButton
            );

            actions.appendChild(
                deleteButton
            );


            li.appendChild(content);
            li.appendChild(actions);

            fragment.appendChild(li);
        });


        cardList.appendChild(
            fragment
        );


    } catch (error) {

        console.error(
            "Fehler beim Anzeigen der Karten:",
            error
        );

        showMessage(
            "Die Karten konnten nicht geladen werden.",
            "error"
        );
    }
}


/* ============================================================
   KARTE BEARBEITEN
============================================================ */

function showCardEditor(
    li,
    card
) {

    const existingEditor =
        li.querySelector(
            ".card-edit-container"
        );

    if (existingEditor) {
        return;
    }


    const editor =
        document.createElement("div");

    editor.className =
        "card-edit-container";


    const frontInput =
        document.createElement("textarea");

    frontInput.rows = 3;
    frontInput.value =
        card.front;


    const backInput =
        document.createElement("textarea");

    backInput.rows = 3;
    backInput.value =
        card.back;


    const saveButton =
        document.createElement("button");

    saveButton.type =
        "button";

    saveButton.className =
        "primary-button";

    saveButton.textContent =
        "Speichern";


    const cancelButton =
        document.createElement("button");

    cancelButton.type =
        "button";

    cancelButton.className =
        "secondary-button";

    cancelButton.textContent =
        "Abbrechen";


    const buttonContainer =
        document.createElement("div");

    buttonContainer.style.display =
        "flex";

    buttonContainer.style.gap =
        "8px";


    buttonContainer.appendChild(
        saveButton
    );

    buttonContainer.appendChild(
        cancelButton
    );


    editor.appendChild(
        frontInput
    );

    editor.appendChild(
        backInput
    );

    editor.appendChild(
        buttonContainer
    );


    li.prepend(editor);


    saveButton.addEventListener(
        "click",
        async () => {

            const newFront =
                frontInput.value.trim();

            const newBack =
                backInput.value.trim();


            if (!newFront || !newBack) {

                showMessage(
                    "Beide Seiten der Karte müssen ausgefüllt sein.",
                    "error"
                );

                return;
            }


            try {

                card.front =
                    newFront;

                card.back =
                    newBack;


                await updateCard(
                    card
                );


                await renderCardList();

                showMessage(
                    "Karte wurde aktualisiert."
                );


            } catch (error) {

                console.error(
                    error
                );

                showMessage(
                    "Die Karte konnte nicht gespeichert werden.",
                    "error"
                );
            }
        }
    );


    cancelButton.addEventListener(
        "click",
        () => {

            renderCardList();
        }
    );


    frontInput.focus();
}


/* ============================================================
   FORTSCHRITT
============================================================ */

async function updateDeckProgress() {

    if (currentDeckId === null) {
        return;
    }


    const totalSpan =
        getElement("deckTotalCards");

    const activeSpan =
        getElement("deckActiveCards");

    const finishedSpan =
        getElement("deckFinishedCards");

    const percentSpan =
        getElement("deckProgressPercent");

    const progressBar =
        getElement("deckProgressBar");


    if (
        !totalSpan ||
        !activeSpan ||
        !finishedSpan
    ) {
        return;
    }


    const cards =
        await getCardsForDeck(
            currentDeckId
        );


    const total =
        cards.length;

    const active =
        cards.filter(
            card =>
                card.isActive !== false
        ).length;

    const finished =
        total - active;


    const percentage =
        total === 0
            ? 0
            : Math.round(
                (finished / total) * 100
            );


    totalSpan.textContent =
        total;

    activeSpan.textContent =
        active;

    finishedSpan.textContent =
        finished;


    if (percentSpan) {
        percentSpan.textContent =
            `${percentage} %`;
    }


    if (progressBar) {
        progressBar.style.width =
            `${percentage}%`;
    }
}


/* ============================================================
   FORTSCHRITT ZURÜCKSETZEN
============================================================ */

async function resetDeckProgress(deckId) {

    const db =
        await openDb();


    return new Promise((resolve, reject) => {

        const transaction =
            db.transaction(
                "cards",
                "readwrite"
            );

        const store =
            transaction.objectStore("cards");

        const index =
            store.index("deckId");


        const request =
            index.getAll(
                Number(deckId)
            );


        request.onsuccess = () => {

            const cards =
                request.result || [];


            cards.forEach(card => {

                card.correctStreak =
                    0;

                card.isActive =
                    true;

                card.totalAnswers =
                    0;

                card.correctAnswers =
                    0;

                card.wrongAnswers =
                    0;

                card.lastReviewedAt =
                    null;


                store.put(card);
            });
        };


        transaction.oncomplete = () => {
            resolve();
        };

        transaction.onerror = () => {
            reject(transaction.error);
        };
    });
}


/* ============================================================
   LERNMODUS
============================================================ */

async function startLearning() {

    if (currentDeckId === null) {
        return;
    }


    const cards =
        await getCardsForDeck(
            currentDeckId
        );


    learnQueue =
        cards.filter(
            card =>
                card.isActive !== false
        );


    showLearnArea(true);
    showNewCardArea(false);
    showCardOverviewArea(false);


    answerShown =
        false;


    if (learnQueue.length === 0) {

        showNoLearningCards();

        return;
    }


    showNextLearnCard();
}


/* ============================================================
   NÄCHSTE KARTE
============================================================ */

function showNextLearnCard() {

    const frontDiv =
        getElement("learnCardFront");

    const backDiv =
        getElement("learnCardBack");

    const answerButtonArea =
        getElement("answerButtonArea");

    const resultButtonsArea =
        getElement("resultButtonsArea");

    const counter =
        getElement("learningCounter");


    if (
        !frontDiv ||
        !backDiv ||
        !answerButtonArea ||
        !resultButtonsArea
    ) {
        return;
    }


    answerShown =
        false;


    backDiv.hidden =
        true;


    if (learnQueue.length === 0) {

        frontDiv.textContent =
            "Alle Karten dieses Stapels wurden gelernt. 🎉";

        answerButtonArea.hidden =
            true;

        resultButtonsArea.hidden =
            true;

        currentLearnCard =
            null;

        if (counter) {
            counter.textContent =
                "Fertig";
        }

        return;
    }


    currentLearnCard =
        learnQueue.shift();


    frontDiv.textContent =
        currentLearnCard.front;

    backDiv.textContent =
        currentLearnCard.back;


    answerButtonArea.hidden =
        false;

    resultButtonsArea.hidden =
        true;


    if (counter) {

        const remaining =
            learnQueue.length + 1;

        counter.textContent =
            `${remaining} ${remaining === 1 ? "Karte" : "Karten"} übrig`;
    }
}


/* ============================================================
   KEINE KARTEN
============================================================ */

function showNoLearningCards() {

    const frontDiv =
        getElement("learnCardFront");

    const backDiv =
        getElement("learnCardBack");

    const answerButtonArea =
        getElement("answerButtonArea");

    const resultButtonsArea =
        getElement("resultButtonsArea");

    const counter =
        getElement("learningCounter");


    if (frontDiv) {

        frontDiv.textContent =
            "Keine aktiven Karten zum Lernen.";
    }


    if (backDiv) {
        backDiv.hidden = true;
    }

    if (answerButtonArea) {
        answerButtonArea.hidden = true;
    }

    if (resultButtonsArea) {
        resultButtonsArea.hidden = true;
    }

    if (counter) {
        counter.textContent =
            "Alles erledigt";
    }
}


/* ============================================================
   ANTWORT ANZEIGEN
============================================================ */

function showAnswer() {

    if (!currentLearnCard) {
        return;
    }


    const backDiv =
        getElement("learnCardBack");

    const answerButtonArea =
        getElement("answerButtonArea");

    const resultButtonsArea =
        getElement("resultButtonsArea");


    if (
        !backDiv ||
        !answerButtonArea ||
        !resultButtonsArea
    ) {
        return;
    }


    backDiv.hidden =
        false;

    answerShown =
        true;


    answerButtonArea.hidden =
        true;

    resultButtonsArea.hidden =
        false;
}


/* ============================================================
   RICHTIG
============================================================ */

async function markCorrect() {

    if (
        !currentLearnCard ||
        !answerShown ||
        isProcessingAnswer
    ) {
        return;
    }


    isProcessingAnswer =
        true;


    try {

        currentLearnCard.correctStreak =
            (currentLearnCard.correctStreak || 0) + 1;


        currentLearnCard.totalAnswers =
            (currentLearnCard.totalAnswers || 0) + 1;


        currentLearnCard.correctAnswers =
            (currentLearnCard.correctAnswers || 0) + 1;


        currentLearnCard.lastReviewedAt =
            new Date().toISOString();


        if (
            currentLearnCard.correctStreak >= 2
        ) {

            currentLearnCard.isActive =
                false;

        } else {

            learnQueue.push(
                currentLearnCard
            );
        }


        await updateCard(
            currentLearnCard
        );


        await updateDeckProgress();


        showNextLearnCard();


    } catch (error) {

        console.error(
            error
        );

        showMessage(
            "Die Antwort konnte nicht gespeichert werden.",
            "error"
        );

    } finally {

        isProcessingAnswer =
            false;
    }
}


/* ============================================================
   FALSCH
============================================================ */

async function markWrong() {

    if (
        !currentLearnCard ||
        !answerShown ||
        isProcessingAnswer
    ) {
        return;
    }


    isProcessingAnswer =
        true;


    try {

        currentLearnCard.correctStreak =
            0;


        currentLearnCard.isActive =
            true;


        currentLearnCard.totalAnswers =
            (currentLearnCard.totalAnswers || 0) + 1;


        currentLearnCard.wrongAnswers =
            (currentLearnCard.wrongAnswers || 0) + 1;


        currentLearnCard.lastReviewedAt =
            new Date().toISOString();


        learnQueue.push(
            currentLearnCard
        );


        await updateCard(
            currentLearnCard
        );


        await updateDeckProgress();


        showNextLearnCard();


    } catch (error) {

        console.error(
            error
        );

        showMessage(
            "Die Antwort konnte nicht gespeichert werden.",
            "error"
        );

    } finally {

        isProcessingAnswer =
            false;
    }
}


/* ============================================================
   ANSICHTEN
============================================================ */

function showNewCardArea(show) {

    const element =
        getElement("newCardArea");

    if (!element) {
        return;
    }

    element.hidden =
        !show;
}


function showCardOverviewArea(show) {

    const element =
        getElement("cardOverviewArea");

    if (!element) {
        return;
    }

    element.hidden =
        !show;


    if (!show) {
        return;
    }


    renderCardList();
}


function showLearnArea(show) {

    const element =
        getElement("learnArea");

    if (!element) {
        return;
    }

    element.hidden =
        !show;
}


/* ============================================================
   MODAL
============================================================ */

function openConfirmModal(
    title,
    text,
    action
) {

    const modal =
        getElement("confirmModal");

    const titleElement =
        getElement("modalTitle");

    const textElement =
        getElement("modalText");


    if (
        !modal ||
        !titleElement ||
        !textElement
    ) {
        return;
    }


    titleElement.textContent =
        title;

    textElement.textContent =
        text;


    modalConfirmAction =
        action;


    modal.hidden =
        false;


    const confirmButton =
        getElement("modalConfirmButton");

    if (confirmButton) {
        confirmButton.focus();
    }
}


function closeConfirmModal() {

    const modal =
        getElement("confirmModal");

    if (modal) {
        modal.hidden =
            true;
    }

    modalConfirmAction =
        null;
}


/* ============================================================
   NEUEN STAPEL ERSTELLEN
============================================================ */

async function handleCreateDeck() {

    const input =
        getElement("deckNameInput");


    if (!input) {
        return;
    }


    const name =
        input.value.trim();


    if (!name) {

        showMessage(
            "Bitte gib einen Namen für den Stapel ein.",
            "error"
        );

        input.focus();

        return;
    }


    if (name.length < 2) {

        showMessage(
            "Der Stapelname muss mindestens 2 Zeichen lang sein.",
            "error"
        );

        input.focus();

        return;
    }


    try {

        const decks =
            await getAllDecks();


        const exists =
            decks.some(
                deck =>
                    deck.name.toLowerCase() ===
                    name.toLowerCase()
            );


        if (exists) {

            showMessage(
                "Ein Stapel mit diesem Namen existiert bereits.",
                "error"
            );

            input.focus();

            return;
        }


        await addDeck(name);


        input.value = "";


        await renderDeckList();


        showMessage(
            `Stapel „${name}“ wurde erstellt.`
        );


    } catch (error) {

        console.error(
            "Stapel konnte nicht erstellt werden:",
            error
        );

        showMessage(
            "Der Stapel konnte nicht erstellt werden.",
            "error"
        );
    }
}


/* ============================================================
   NEUE KARTE ERSTELLEN
============================================================ */

async function handleCreateCard() {

    const frontInput =
        getElement("cardFrontInput");

    const backInput =
        getElement("cardBackInput");


    if (
        !frontInput ||
        !backInput ||
        currentDeckId === null
    ) {
        return;
    }


    const front =
        frontInput.value.trim();

    const back =
        backInput.value.trim();


    if (!front || !back) {

        showMessage(
            "Vorderseite und Rückseite müssen ausgefüllt sein.",
            "error"
        );

        return;
    }


    try {

        await addCard(
            currentDeckId,
            front,
            back
        );


        frontInput.value = "";
        backInput.value = "";


        await updateDeckProgress();


        showCardOverviewArea(false);
        showNewCardArea(true);


        frontInput.focus();


        showMessage(
            "Karte wurde erstellt."
        );


    } catch (error) {

        console.error(
            "Karte konnte nicht erstellt werden:",
            error
        );

        showMessage(
            "Die Karte konnte nicht erstellt werden.",
            "error"
        );
    }
}


/* ============================================================
   DOMCONTENTLOADED
============================================================ */

document.addEventListener(
    "DOMContentLoaded",
    async () => {

        console.log(
            "ENGI wurde geladen."
        );


        /* Theme */

        loadTheme();


        const themeButton =
            getElement("themeButton");

        if (themeButton) {

            themeButton.addEventListener(
                "click",
                changeMode
            );
        }


        /* Stapel erstellen */

        const createDeckButton =
            getElement("createDeckButton");

        const deckNameInput =
            getElement("deckNameInput");


        if (createDeckButton) {

            createDeckButton.addEventListener(
                "click",
                handleCreateDeck
            );
        }


        if (deckNameInput) {

            deckNameInput.addEventListener(
                "keydown",
                event => {

                    if (event.key === "Enter") {

                        event.preventDefault();

                        handleCreateDeck();
                    }
                }
            );
        }


        /* Zurück */

        const backButtonTop =
            getElement(
                "backToDecksButtonTop"
            );


        if (backButtonTop) {

            backButtonTop.addEventListener(
                "click",
                closeDeck
            );
        }


        /* Neue Karte */

        const newCardButton =
            getElement("newCardButton");


        if (newCardButton) {

            newCardButton.addEventListener(
                "click",
                () => {

                    showNewCardArea(true);

                    showCardOverviewArea(false);

                    showLearnArea(false);


                    const input =
                        getElement(
                            "cardFrontInput"
                        );

                    if (input) {
                        input.focus();
                    }
                }
            );
        }


        /* Neue Karte abbrechen */

        const cancelNewCardButton =
            getElement(
                "cancelNewCardButton"
            );


        if (cancelNewCardButton) {

            cancelNewCardButton.addEventListener(
                "click",
                () => {

                    showNewCardArea(false);
                }
            );
        }


        /* Karte erstellen */

        const createCardButton =
            getElement("createCardButton");


        if (createCardButton) {

            createCardButton.addEventListener(
                "click",
                handleCreateCard
            );
        }


        /* Kartenübersicht */

        const cardOverviewButton =
            getElement(
                "cardOverviewButton"
            );


        if (cardOverviewButton) {

            cardOverviewButton.addEventListener(
                "click",
                async () => {

                    showNewCardArea(false);

                    showCardOverviewArea(true);

                    showLearnArea(false);

                    await renderCardList();
                }
            );
        }


        /* Lernen */

        const learnButton =
            getElement("learnButton");


        if (learnButton) {

            learnButton.addEventListener(
                "click",
                startLearning
            );
        }


        /* Antwort anzeigen */

        const showAnswerButton =
            getElement(
                "showAnswerButton"
            );


        if (showAnswerButton) {

            showAnswerButton.addEventListener(
                "click",
                showAnswer
            );
        }


        /* Richtig */

        const correctButton =
            getElement("correctButton");


        if (correctButton) {

            correctButton.addEventListener(
                "click",
                markCorrect
            );
        }


        /* Falsch */

        const wrongButton =
            getElement("wrongButton");


        if (wrongButton) {

            wrongButton.addEventListener(
                "click",
                markWrong
            );
        }


        /* Fortschritt zurücksetzen */

        const resetProgressButton =
            getElement(
                "resetProgressButton"
            );


        if (resetProgressButton) {

            resetProgressButton.addEventListener(
                "click",
                () => {

                    if (currentDeckId === null) {
                        return;
                    }


                    openConfirmModal(
                        "Fortschritt zurücksetzen?",
                        "Der Lernfortschritt dieses Stapels wird zurückgesetzt. Die Karten selbst bleiben erhalten.",
                        async () => {

                            await resetDeckProgress(
                                currentDeckId
                            );

                            learnQueue = [];

                            currentLearnCard = null;

                            answerShown = false;


                            await updateDeckProgress();


                            showLearnArea(false);


                            showMessage(
                                "Der Lernfortschritt wurde zurückgesetzt."
                            );
                        }
                    );
                }
            );
        }


        /* Stapel löschen */

        const deleteDeckButton =
            getElement(
                "deleteDeckButton"
            );


        if (deleteDeckButton) {

            deleteDeckButton.addEventListener(
                "click",
                () => {

                    if (currentDeckId === null) {
                        return;
                    }


                    const deckId =
                        currentDeckId;


                    const deckName =
                        getElement(
                            "deckViewName"
                        )?.textContent ||
                        "Dieser Stapel";


                    openConfirmModal(
                        "Stapel löschen?",
                        `„${deckName}“ und alle darin enthaltenen Karten werden dauerhaft gelöscht.`,
                        async () => {

                            try {

                                await deleteDeck(
                                    deckId
                                );


                                closeDeck();

                                await renderDeckList();


                                showMessage(
                                    "Stapel wurde gelöscht."
                                );


                            } catch (error) {

                                console.error(
                                    error
                                );

                                showMessage(
                                    "Der Stapel konnte nicht gelöscht werden.",
                                    "error"
                                );
                            }
                        }
                    );
                }
            );
        }


        /* Modal abbrechen */

        const modalCancelButton =
            getElement(
                "modalCancelButton"
            );


        if (modalCancelButton) {

            modalCancelButton.addEventListener(
                "click",
                closeConfirmModal
            );
        }


        /* Modal bestätigen */

        const modalConfirmButton =
            getElement(
                "modalConfirmButton"
            );


        if (modalConfirmButton) {

            modalConfirmButton.addEventListener(
                "click",
                async () => {

                    if (
                        typeof modalConfirmAction !==
                        "function"
                    ) {
                        closeConfirmModal();
                        return;
                    }


                    const action =
                        modalConfirmAction;


                    closeConfirmModal();


                    try {

                        await action();

                    } catch (error) {

                        console.error(
                            error
                        );

                        showMessage(
                            "Die Aktion konnte nicht ausgeführt werden.",
                            "error"
                        );
                    }
                }
            );
        }


        /* Modal mit Escape schließen */

        document.addEventListener(
            "keydown",
            event => {

                if (
                    event.key === "Escape"
                ) {

                    const modal =
                        getElement(
                            "confirmModal"
                        );


                    if (
                        modal &&
                        !modal.hidden
                    ) {
                        closeConfirmModal();
                    }
                }
            }
        );


        /* Enter zum Erstellen einer Karte */

        const cardFrontInput =
            getElement(
                "cardFrontInput"
            );

        const cardBackInput =
            getElement(
                "cardBackInput"
            );


        if (cardBackInput) {

            cardBackInput.addEventListener(
                "keydown",
                event => {

                    if (
                        event.key === "Enter" &&
                        (event.ctrlKey ||
                            event.metaKey)
                    ) {

                        event.preventDefault();

                        handleCreateCard();
                    }
                }
            );
        }


        /* Anwendung initialisieren */

        try {

            await openDb();

            await renderDeckList();

        } catch (error) {

            console.error(
                "Fehler beim Starten der App:",
                error
            );

            showMessage(
                "Die Datenbank konnte nicht geöffnet werden.",
                "error"
            );
        }

    }
);