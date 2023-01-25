let newCellSize = 70;

// Body
document.body.style.boxSizing = "border-box";
document.body.style.width = "100vw";
document.body.style.height = "100vh";
document.body.style.margin = "0";
document.body.style.padding = "10px";
document.body.style.background = "#030303";
document.body.style.color = "#030303";
document.body.style.overflow = "hidden";

// Welcoming words
const hint = newElement("div", [], {
    width: "90%",
    marginInline: "auto",
    color: "#cccc",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    font: `normal 400 clamp(12px, min(1.5vh, 1.5vw), 18px) sans-serif`,
    padding: "5px",
    marginBottom: "5px",
    textTransform: "uppercase",
});
hint.textContent =
    "resize the window or press [-/+] to resize the grid – find the secret";
document.body.appendChild(hint);

// Container
const container = newElement("div", [], {
    width: "100%",
    height: "100%",
    margin: "auto",
    boxSizing: "border-box",
    border: "1px solid #3c3c3c",
    backgroundColor: "#4158D0",
    backgroundImage:
        "linear-gradient(43deg, #4158D0 0%, #C850C0 46%, #FFCC70 100%)",
});
document.body.appendChild(container);

// Global Event Listeners
window.addEventListener("load", generateGrid);
window.addEventListener("resize", generateGrid);
window.addEventListener("keydown", changeCellSize);
// Generate/Regenerate Grid
function generateGrid() {
    // Recursive remove old grid
    const oldGrid = document.querySelector(".mainGrid");
    if (oldGrid) clear(oldGrid);
    // Reset container
    container.style.width = "100%";
    container.style.height = "100%";
    // Grid Settings
    const cellSize = newCellSize;
    const cellCountWidth = Math.floor(container.offsetWidth / cellSize);
    const cellCountHeight = Math.floor(container.offsetHeight / cellSize);
    const mainGrid = newElement("div", ["mainGrid"], {
        display: "grid",
        gridTemplateColumns: `repeat(${cellCountWidth}, ${cellSize}px)`,
        gridTemplateRows: `repeat(${cellCountHeight}, ${cellSize}px)`,
        // width: "100%",
        // height: "100%",
    });
    container.appendChild(mainGrid);
    // container fix
    container.style.width = `${cellSize * cellCountWidth + 2}px`;
    container.style.height = `${cellSize * cellCountHeight + 2}px`;
    // Build rows and columns of cells and add to DOM
    for (let i = 0; i < cellCountHeight; i++) {
        for (let j = 0; j < cellCountWidth; j++) {
            const cell = newElement(
                "div",
                ["cell"],
                {
                    boxSizing: "border-box",
                    border: "1px solid #3c3c3c",
                    aspectRatio: "1/1",
                    background: "#030303",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    font: `normal 400 ${cellSize / 5}px sans-serif`,
                    color: "transparent",
                },
                { winner: "MOshe" }
            );
            cell.textContent = getCellContent(
                ["DEV", "MBUKH"],
                cellCountWidth,
                cellCountHeight,
                i,
                j
            );
            // Cell mouse events
            cell.addEventListener("mouseenter", handleMouseOver);
            cell.addEventListener("mouseover", handleMouseOver);
            cell.addEventListener("mouseleave", handleMouseOut);
            cell.addEventListener("mouseout", handleMouseOut);
            // Add cell to DOM / mainGrid
            mainGrid.appendChild(cell);
        }
    }
}
// Reveal cell
function handleMouseOver(e) {
    e.target.style.background = "transparent";
    e.target.style.color = "#030303";
    e.target.style.transition = "none";
}
// Dim cell
function handleMouseOut(e) {
    e.target.style.background = "#030303";
    // e.target.style.color = "transparent";
    e.target.style.transition = "all 0.5s linear";
}
function getCellContent(textArr = "", cellCountWidth, cellCountHeight, i, j) {
    const perHeight = ((i + 0.5) / cellCountHeight) * 100;
    const perWidth = ((j + 0.5) / cellCountWidth) * 100;
    // Random fill
    let content = textArr[Math.floor(Math.random() * textArr.length)];
    // Conditional fill
    // J
    if (perWidth > 25 && perWidth < 45 && perHeight > 10 && perHeight < 90)
        content = "❤️‍🔥";
    if (perWidth > 5 && perWidth <= 25 && perHeight > 70 && perHeight < 90)
        content = "❤️‍🔥";
    // S
    if (perWidth > 50 && perWidth < 90 && perHeight > 10 && perHeight < 25)
        content = "❤️‍🔥";
    if (perWidth > 50 && perWidth < 90 && perHeight > 40 && perHeight < 55)
        content = "❤️‍🔥";
    if (perWidth > 50 && perWidth < 90 && perHeight > 70 && perHeight < 90)
        content = "❤️‍🔥";
    if (perWidth > 50 && perWidth < 65 && perHeight >= 25 && perHeight < 55)
        content = "❤️‍🔥";
    if (perWidth > 70 && perWidth < 90 && perHeight >= 55 && perHeight <= 70)
        content = "❤️‍🔥";
    return content;
}
function changeCellSize(e) {
    if ((e.keyCode === 189 || e.key === "-") && newCellSize >= 35) {
        newCellSize -= 5;
        generateGrid();
    }
    if ((e.keyCode === 187 || e.key === "=") && newCellSize <= 120) {
        newCellSize += 5;
        generateGrid();
    }
}
// Helper Function to create a new html Element
function newElement(
    tag = "div",
    classList = [],
    style = {},
    addInfo = {},
    dataset = {}
) {
    const el = document.createElement(tag);
    for (const prop in style) {
        el.style[prop] = style[prop];
    }
    for (const data in dataset) {
        el.dataset[data] = dataset[data];
    }
    for (const info in addInfo) {
        el[info] = addInfo[info];
    }
    el.classList.add(...classList);
    return el;
}

// Helper function from stackoverflow to recursively clear a node
function clearInner(node) {
    while (node.hasChildNodes()) {
        clear(node.firstChild);
    }
}
function clear(node) {
    while (node.hasChildNodes()) {
        clear(node.firstChild);
    }
    node.parentNode.removeChild(node);
}
