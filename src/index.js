// object to hold all data for each page so we only make the api calls once per page
//  Keys: Page1, Page2, etc..
//  Values: page data
let testContainer = {};

scrapeEachPage();

async function scrapeEachPage() {
    // api only allows scraping up to page 10
    for (let i = 1; i <= 10; i++) {
        await getEachPage(i);

        let whichPage = 'Page' + i;

        // holding array for each person per page, will add div with id of page, and spans containing people
        // people id will be person_{page}_{number}
        let allThePeople = [];

        // get each person from page
        for (let j = 0; j < 20; j++) {
            allThePeople.push(testContainer[whichPage].items[j].title);
        }

        // first argument is page number for div id, second is what we want to stuff in the html
        addElement(i, allThePeople);
    }
}

function addElement(inc, allThePeople) {
    // inc: integer value of current loop, allThePeople: array containing each record for current page

    // create a new div element with an id of div1, div2, etc..
    const newDiv = document.createElement('div');
    let divID = 'div' + inc;
    newDiv.id = divID;

    let moreHTMLBuilder = `<span id="Page_Title_${inc}" class="Page_Title">##~ PAGE ${inc} ~##</span><br>`;

    // On Each Page
    allThePeople.forEach((element, index) => {
        moreHTMLBuilder += `<p id="ITEM_${inc}_${index}" class="Item">ITEM ${index}: ${element}</p><br>`;
    });

    moreHTMLBuilder += '<br><br>';

    // console.log(moreHTMLBuilder)
    newDiv.innerHTML = moreHTMLBuilder;

    const bottomDiv = document.getElementById('EXAMPLE');
    document.body.insertBefore(newDiv, bottomDiv);

    document.getElementById(divID).classList.add('Page');
}

async function getEachPage(page) {
    const response = await fetch(
        'https://api.fbi.gov/wanted/v1/list?page=' + page
    );
    const wantedList = await response.json();
    let key = 'Page' + page;

    testContainer[key] = wantedList;
}
