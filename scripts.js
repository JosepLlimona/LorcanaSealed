let cardList = new Array();
let commonCards = new Array();
let uncommonCards = new Array();
let otherCards = new Array();

let pull = new Array();
let selectCardList = new Array();

let characters = 0;
let ink = 0;
let actions = 0;
let items = 0;
let locations = 0;


async function GetSets() {
    const url = "https://api.lorcana-api.com/sets/all?displayonly=set_num;name&orderby=set_num";
    try {
        const response = await fetch(url);

        if (!response.ok) {
            throw new Error("Response status: " + response.status);
        }

        const json = await response.json();
        console.log(json);
        CompleteSelect(json);
    } catch (error) {
        console.error(error);
    }
}

function CompleteSelect(sets) {
    let select = document.getElementById("selectSet");

    sets.forEach(e => {
        let option = document.createElement("option");
        option.value = e.Set_Num;
        option.text = e.Name;
        select.appendChild(option);
    });
}

async function GetCards() {
    let index = document.getElementById("selectSet").value;

    console.log("Selected index:" + index);

    if (index != "") {
        const url = "https://api.lorcana-api.com/cards/fetch?search=set_num=" + index + "&displayonly=Color;Image;Cost;Inkable;Name;Type;Lore;Rarity;Willpower;Strength;"

        try {
            const response = await fetch(url);

            if (!response.ok) {
                throw new Error("Response status: " + response.status);
            }

            const json = await response.json();
            console.log(json);
            CreateCards(json);

        } catch (error) {
            console.error(error);
        }
    }
}

function CreateCards(cards) {
    cardList = [];
    cards.forEach(c => {
        let card = new Card(
            c.Name,
            c.Type,
            c.Lore,
            c.Rarity,
            c.Color,
            c.Willpower,
            c.Image,
            c.Cost,
            c.Inkable,
            c.Strenght,
            false
        );
        cardList.push(card);
    })
    OpenPack();
    console.log("Cards: " + cardList[0].name);
}

function OpenPack() {
    pull = [];
    let cardDiv = document.getElementById("cardList");
    cardDiv.innerHTML = "";

    for (j = 0; j < 6; j++) {
        cardList.forEach(c => {
            switch (c.rarity) {
                case "Common":
                    commonCards.push(c);
                    break;
                case "Uncommon":
                    uncommonCards.push(c);
                    break;
                case "Rare":
                    otherCards.push(c);
                    break;
                case "Super Rare":
                    otherCards.push(c);
                    break;
                case "Legendary":
                    otherCards.push(c);
                    break;
            }
        })

        // Common cards
        for (i = 0; i < 6; i++) {
            let rand = Math.floor(Math.random() * commonCards.length);
            pull.push(commonCards[rand]);
        }
        // Uncommon cards
        for (i = 0; i < 3; i++) {
            let rand = Math.floor(Math.random() * uncommonCards.length);
            pull.push(uncommonCards[rand]);
        }
        // Rare, super rare and legendary cards
        for (i = 0; i < 2; i++) {
            let rand = Math.floor(Math.random() * otherCards.length);
            pull.push(otherCards[rand]);
        }
        //Foil card
        let rand = Math.floor(Math.random() * cardList.length);
        let foilCard = cardList[rand];
        foilCard.foil = true;
        pull.push(foilCard);

    }
    pull.forEach(c => {
        CreateCardImage(c);
    })
}

function CreateCardImage(card) {
    let cardDiv = document.getElementById("cardList");
    let image = document.createElement("img");
    image.src = card.image;
    image.className = "card"
    image.addEventListener("click", e => { CardClicked(card); })

    cardDiv.appendChild(image);
}

function OrderByRarity() {
    if (pull.length == 0)
        return;
    let cardDiv = document.getElementById("cardList");
    cardDiv.innerHTML = "";

    const rarityOrder = {
        "Common": 5,
        "Uncommon": 4,
        "Rare": 3,
        "Super Rare": 2,
        "Legendary": 1
    };

    // Supongamos que tienes una lista de cards llamada `cards`
    pull.sort((a, b) => rarityOrder[a.rarity] - rarityOrder[b.rarity]);

    pull.forEach(c => {
        CreateCardImage(c);
    })
}

function OrderByCost() {
    if (pull.length == 0)
        return;

    let cardDiv = document.getElementById("cardList");
    cardDiv.innerHTML = "";

    pull.sort((a, b) => a.cost - b.cost);
    pull.forEach(c => {
        CreateCardImage(c);
    })
}

function CardClicked(card) {
    let index = pull.indexOf(card)
    console.log("Clicked: " + card.name + ", index: " + index);
    selectCardList.push(pull[index]);
    pull.splice(index, 1);
    PrintCardsLists();
}

function PrintCardsLists() {
    characters = 0;
    ink = 0;
    actions = 0;
    items = 0;
    locations = 0;

    let cardDiv = document.getElementById("cardList");
    cardDiv.innerHTML = "";

    let selectedCardDiv = document.getElementById("selectedCards");
    selectedCardDiv.innerHTML = "";

    console.log(selectCardList.length);

    console.log(pull.length);
    pull.forEach(c => {
        CreateCardImage(c);
    })
    selectCardList.forEach(c => {
        let cardDiv = document.getElementById("selectedCards");
        let image = document.createElement("img");
        image.src = c.image;
        image.className = "card"
        image.addEventListener("click", e => { CardReturned(c); })

        if (c.inkable)
            ink++;

        switch (c.type) {
            case "Action":
                actions++;
                break;
            case "Action - Song":
                actions++;
                break;
            case "Item":
                items++;
                break;
            case "Location":
                locations++;
                break;
            case "Character":
                characters++;
                break;
        }

        cardDiv.appendChild(image);
    });

    let cardNum = document.getElementById("cardNumber");
    let inkNum = document.getElementById("inkNumber");
    let charNum = document.getElementById("charNumber");
    let actionNum = document.getElementById("actionNumber");
    let itemNum = document.getElementById("itemNumber");
    let locNum = document.getElementById("locNumber");

    cardNum.text = "Cards: " + selectCardList.length;
    inkNum.text = "Inkeable: " + ink;
    charNum.text = "Characters: " + characters;
    actionNum.text = "Actions: " + actions;
    itemNum.text = "Items: " + items;
    locNum.text = "Locations: " + locations;

}

function CardReturned(card) {
    let index = selectCardList.indexOf(card)
    console.log("Clicked: " + card.name + ", index: " + index);
    pull.push(selectCardList[index]);
    selectCardList.splice(index, 1);
    PrintCardsLists();
}

function Import() {
    selectCardList.sort((a, b) => a.name.localeCompare(b.name));
    let importString = "";

    let currentCard = "";
    let numberRepetive = 0;

    selectCardList.forEach(c => {
        if (currentCard != c.name) {
            console.log("Comprovant: " + c.name);
            if (currentCard != "") {
                console.log("Entro amb: " + currentCard);
                importString += numberRepetive + " " + currentCard + "\n";
                numberRepetive = 0;
            }
            currentCard = c.name
            numberRepetive++;
        }
        else {
            numberRepetive++;
        }
    })
    importString += numberRepetive + " " + currentCard + "\n";

    navigator.clipboard.writeText(importString)
    alert(importString + "Copy to clipboard");

}

GetSets();