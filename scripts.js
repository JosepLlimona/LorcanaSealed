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

let one = 0;
let two = 0;
let three = 0;
let four = 0;
let five = 0;
let six = 0;
let seven = 0;
let eight = 0;


async function GetSets() {
    const url = "https://api.lorcana-api.com/sets/all?displayonly=set_num;name;cards&orderby=set_num";
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
        if (e.Cards > 200) {
            let option = document.createElement("option");
            option.value = e.Set_Num;
            option.text = e.Name;
            select.appendChild(option);
        }
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
    DeleteDeck();
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
        CreateCardImage(c, "cardList");
    })
}

function CreateCardImage(card, div) {
    let cardDiv = document.getElementById(div);
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
        CreateCardImage(c, "cardList");
    })
}

function OrderByRaritySelected() {
    if (pull.length == 0)
        return;
    let cardDiv = document.getElementById("selectedCards");
    cardDiv.innerHTML = "";

    const rarityOrder = {
        "Common": 5,
        "Uncommon": 4,
        "Rare": 3,
        "Super Rare": 2,
        "Legendary": 1
    };

    // Supongamos que tienes una lista de cards llamada `cards`
    selectCardList.sort((a, b) => rarityOrder[a.rarity] - rarityOrder[b.rarity]);

    selectCardList.forEach(c => {
        CreateCardImage(c, "selectedCards");
    })
}

function OrderByCost() {
    if (pull.length == 0)
        return;

    let cardDiv = document.getElementById("cardList");
    cardDiv.innerHTML = "";

    pull.sort((a, b) => a.cost - b.cost);
    pull.forEach(c => {
        CreateCardImage(c, "cardList");
    })
}

function OrderByCostSelected() {
    if (pull.length == 0)
        return;

    let cardDiv = document.getElementById("selectedCards");
    cardDiv.innerHTML = "";

    selectCardList.sort((a, b) => a.cost - b.cost);
    selectCardList.forEach(c => {
        CreateCardImage(c, "selectedCards");
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
    one = 0;
    two = 0;
    three = 0;
    four = 0;
    five = 0;
    six = 0;
    seven = 0;
    eight = 0;

    let cardDiv = document.getElementById("cardList");
    cardDiv.innerHTML = "";

    let selectedCardDiv = document.getElementById("selectedCards");
    selectedCardDiv.innerHTML = "";

    console.log(selectCardList.length);

    console.log(pull.length);
    pull.forEach(c => {
        CreateCardImage(c, "cardList");
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

        switch (c.cost) {
            case 1:
                one++;
                break;
            case 2:
                two++;
                break;
            case 3:
                three++;
                break;
            case 4:
                four++;
                break;
            case 5:
                five++;
                break;
            case 6:
                six++;
                break;
            case 7:
                seven++;
                break;
            default:
                eight++;
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

    let oneNum = document.getElementById("one");
    let twoNum = document.getElementById("two");
    let threeNum = document.getElementById("three");
    let fourNum = document.getElementById("four");
    let fiveNum = document.getElementById("five");
    let sixNum = document.getElementById("six");
    let sevenNum = document.getElementById("seven");
    let eightNum = document.getElementById("eight");

    cardNum.text = selectCardList.length;
    inkNum.text = ink;
    charNum.text = characters;
    actionNum.text = actions;
    itemNum.text = items;
    locNum.text = locations;

    oneNum.text = one;
    twoNum.text = two;
    threeNum.text = three;
    fourNum.text = four;
    fiveNum.text = five;
    sixNum.text = six;
    sevenNum.text = seven;
    eightNum.text = eight;

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

function DeleteDeck() {
    selectCardList = [];
    let selectedCardDiv = document.getElementById("selectedCards");
    selectedCardDiv.innerHTML = "";

    let cardNum = document.getElementById("cardNumber");
    let inkNum = document.getElementById("inkNumber");
    let charNum = document.getElementById("charNumber");
    let actionNum = document.getElementById("actionNumber");
    let itemNum = document.getElementById("itemNumber");
    let locNum = document.getElementById("locNumber");

    let oneNum = document.getElementById("one");
    let twoNum = document.getElementById("two");
    let threeNum = document.getElementById("three");
    let fourNum = document.getElementById("four");
    let fiveNum = document.getElementById("five");
    let sixNum = document.getElementById("six");
    let sevenNum = document.getElementById("seven");
    let eightNum = document.getElementById("eight");

    cardNum.text = "0";
    inkNum.text = "0";
    charNum.text = "0";
    actionNum.text = "0";
    itemNum.text = "0";
    locNum.text = "0";

    oneNum.text = "0";
    twoNum.text = "0";
    threeNum.text = "0";
    fourNum.text = "0";
    fiveNum.text = "0";
    sixNum.text = "0";
    sevenNum.text = "0";
    eightNum.text = "0";
}

function SearchCard() {
    let searcher = document.getElementById("cardSearch");

    if (pull.length == 0)
        return

    let searchArray = pull.filter(c => c.name.toLowerCase().includes(searcher.value.toLowerCase()));
    console.log(searchArray.length);

    let cardDiv = document.getElementById("cardList");
    cardDiv.innerHTML = "";

    searchArray.forEach(c => {
        CreateCardImage(c, "cardList");
    })
}

GetSets();