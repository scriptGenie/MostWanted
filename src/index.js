// object to hold all data for each page so we only make the api calls once per page
//  Keys: Page1, Page2, etc..
//  Values: page data
let testContainer = {};


// test show pages
async function useThis() {
    // testing adding elements based on number of pages
    // only allows scraping up to page 10
    for (let i = 1; i <= 10; i++) {

        await getEachPage(i);

        let whichPage = 'Page' + i;
        let pageData = testContainer[whichPage];

        // first argument is page number for div id, second is what we want to stuff in the html
        addElement(i, pageData.items[0].nationality);

        // console.log(testContainer[whichPage]);
    };
};
useThis();


function addElement(inc, link) {
  // create a new div element with an id of div1, div2, etc..
  const newDiv = document.createElement("div");
  let divID = 'div' + inc; 
  newDiv.id = divID;

  // create a new text node and give it some content
  const newContent = document.createTextNode(`Page: ${inc} / Target: 1 --- This target's nationality is: ${link}`);

  // add the text node to the newly created div
  newDiv.appendChild(newContent);

  // add the newly created element and its content into the DOM
  //    added before the bottomDiv, so each new div will go under the previous
  const bottomDiv = document.getElementById("EXAMPLE");
  document.body.insertBefore(newDiv, bottomDiv);
};


async function getEachPage(page) {
    const response = await fetch("https://api.fbi.gov/wanted/v1/list?page=" + page);
    const wantedList = await response.json();
    let key = 'Page' + page;

    testContainer[key] = wantedList;
};