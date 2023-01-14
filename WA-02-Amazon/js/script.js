function updateSearchCat() {
    const selectedCat = document.querySelector("#select-cat");
    const newText = selectedCat.options[selectedCat.selectedIndex].text;
    document.querySelector("#selected-cat-text").innerText = newText;
}
