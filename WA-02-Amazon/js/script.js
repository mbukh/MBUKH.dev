const updateSelectedValueText = (querySelect, queryUpdate) => {
    const selected = document.querySelector(querySelect);
    const newText = selected.options[selected.selectedIndex].text;
    document.querySelector(queryUpdate).innerText = newText;
};

const updateSearchCat = () =>
    updateSelectedValueText("#select-cat", "#selected-cat-text");

const updateOrderQuantity = () =>
    updateSelectedValueText("#select-quantity", "#selected-quantity-text");

(function imageSwitchEventer() {
    const mainImage = document.querySelector("#prod-img-block #prod-image img");
    const imageSwitchers = document.querySelectorAll("#image-switch>ul>li>a");
    imageSwitchers.forEach((el) =>
        el.addEventListener("mouseover", () => {
            mainImage.src = el.dataset.mainImg;
            imageSwitchers.forEach((el) =>
                el.parentNode.classList.remove("active")
            );
            el.parentNode.classList.add("active");
        })
    );
})();

(function imageZoom(imgID, resultID, lensID) {
    let img, lens, result, cx, cy, aspect;
    img = document.querySelector(imgID);
    result = document.querySelector(resultID);
    lens = document.querySelector(lensID);
    /* Calculate the ratio between result DIV and lens: */
    [cx, cy] = proportionalScale(lens, result);
    /* Execute a function when someone moves the cursor over the image, or the lens: */
    lens.addEventListener("mousemove", moveLens);
    img.addEventListener("mousemove", moveLens);
    /* And also for touch screens: */
    lens.addEventListener("touchmove", moveLens);
    img.addEventListener("touchmove", moveLens);
    // Close image
    img.addEventListener("mouseleave", closeZoom);
    lens.addEventListener("mouseleave", closeZoom);
    function moveLens(e) {
        let pos, x, y;
        updateImage();
        /* Prevent any other actions that may occur when moving over the image */
        e.preventDefault();
        /* Get the cursor's x and y positions: */
        pos = getCursorPos(e);
        /* Calculate the position of the lens: */
        x = pos.x - lens.offsetWidth / 2;
        y = pos.y - lens.offsetHeight / 2;
        /* Prevent the lens from being positioned outside the image: */
        if (x > img.width - lens.offsetWidth) {
            x = img.width - lens.offsetWidth;
        }
        if (x < 0) {
            x = 0;
        }
        if (y > img.height - lens.offsetHeight) {
            y = img.height - lens.offsetHeight;
        }
        if (y < 0) {
            y = 0;
        }
        /* Set the position of the lens: */
        lens.style.left = x + "px";
        lens.style.top = y + "px";
        /* Display what the lens "sees": */
        result.style.backgroundPosition = "-" + x * cx + "px -" + y * cy + "px";
    }
    function getCursorPos(e) {
        let a,
            x = 0,
            y = 0;
        e = e || window.event;
        /* Get the x and y positions of the image: */
        a = img.getBoundingClientRect();
        /* Calculate the cursor's x and y coordinates, relative to the image: */
        x = e.pageX - a.left;
        y = e.pageY - a.top;
        /* Consider any page scrolling: */
        x = x - window.pageXOffset;
        y = y - window.pageYOffset;
        return { x: x, y: y };
    }
    function updateImage() {
        result.style.zIndex = "999";
        result.style.visibility = "visible";
        result.style.backgroundImage = "url('" + img.src + "')";
        result.style.backgroundSize =
            img.width * cx + "px " + img.height * cy + "px";
    }

    function closeZoom() {
        result.style.backgroundImage = null;
        result.style.backgroundSize = null;
        result.style.backgroundPosition = null;
        result.style.zIndex = "-999";
        result.style.visibility = "hidden";
    }

    // Returns array with new width and height
    function proportionalScale(original, dest) {
        const originalSize = [original.offsetWidth, original.offsetHeight];
        const newSize = [dest.offsetWidth, dest.offsetHeight];
        const cx = newSize[0] / originalSize[0];
        const cy = newSize[1] / originalSize[1];
        const aspect = cx / cy;
        if (cx > cy) {
            // horizontal scaling
            return [cx, cy, aspect];
        } else {
            // vertical scaling
            return [cx, cy * aspect];
        }
    }
})(
    "#prod-img-block #prod-image img",
    "#image-zoom-overlay",
    "#prod-img-block #img-zoom-lens"
);
