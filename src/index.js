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
            let personTitle = testContainer[whichPage].items[j].title
            let personDesc = testContainer[whichPage].items[j].details

            personTitle = strip(personTitle);
            personDesc = strip(personDesc);

            if (personTitle == 'null' || personTitle.trim() == '') {
                personTitle = `<span id="Title_${i}_${j}" class="Description">NO Title PROVIDED</span>`
            } else {
                let tempTitle = `<span id="Title_${i}_${j}" class="Title">${personTitle}</span>`
                personTitle = tempTitle
            };


            if (personDesc == 'null' || personDesc.trim() == '') {
                personDesc = `<span id="Desc_${i}_${j}" class="Description">NO DESC PROVIDED</span>`
            } else {
                let tempDesc = `<span id="Desc_${i}_${j}" class="Description">${personDesc}</span>`
                personDesc = tempDesc
            };

            let getBlock = personTitle + personDesc

            allThePeople.push(getBlock);
            // allThePeople.push(testContainer[whichPage].items[j].title);
        }

        // first argument is page number for div id, second is what we want to stuff in the html
        // console.log(allThePeople)

        addElement(i, allThePeople);
    }
}

// Working so far
// function stripHtml(html)
// {
//    let tmp = document.createElement("DIV");
//    tmp.innerHTML = html;
//    return tmp.textContent || tmp.innerText || "";
// }


function strip(str) {
    const parsedHTML = new DOMParser().parseFromString(str, "text/html");
    const text = parsedHTML.body.textContent;
  
    if (/(<([^>]+)>)/gi.test(text)) {
      return stripHTML(text);
    }
  
    return text || "";
  }


function addElement(inc, allThePeople) {
    // inc: integer value of current loop, allThePeople: array containing each record for current page

    // create a new div element with an id of div1, div2, etc..
    const newDiv = document.createElement('div');
    let divID = 'div' + inc;
    newDiv.id = divID;

    let moreHTMLBuilder = `<span id="Page_Title_${inc}" class="Page_Title">PAGE ${inc}</span>`;

    // On Each Page
    allThePeople.forEach((element, index) => {
        moreHTMLBuilder += `<p id="ITEM_${inc}_${index}" class="Item">${element}</p>`;
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
