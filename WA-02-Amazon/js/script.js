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

(function imageZoom(imgID, zoomID, lensID) {
    let img, lens, zoom, cx, cy;
    img = document.querySelector(imgID);
    zoom = document.querySelector(zoomID);
    lens = document.querySelector(lensID);
    /* Execute a function when someone moves the cursor over the image, or the lens: */
    img.addEventListener("mouseenter", activateZoom);
    lens.addEventListener("mouseenter", activateZoom);
    lens.addEventListener("touchstart", activateZoom);
    img.addEventListener("touchstart", activateZoom);
    // Update on move
    lens.addEventListener("mousemove", moveLens);
    img.addEventListener("mousemove", moveLens);
    lens.addEventListener("touchmove", moveLens);
    img.addEventListener("touchmove", moveLens);
    // Close image
    img.addEventListener("mouseleave", closeZoom);
    lens.addEventListener("mouseleave", closeZoom);
    lens.addEventListener("touchend", closeZoom);
    img.addEventListener("touchend", closeZoom);
    lens.addEventListener("touchcancel", closeZoom);
    img.addEventListener("touchcancel", closeZoom);
    function moveLens(e) {
        let pos, x, y;
        /* Prevent any other actions that may occur when moving over the image */
        e.preventDefault();
        e.stopImmediatePropagation();
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
        zoom.style.backgroundPosition = "-" + x * cx + "px -" + y * cy + "px";
    }
    function getCursorPos(e) {
        let a,
            x = 0,
            y = 0;
        e = e || window.event;
        /* Get the x and y positions of the image: */
        a = img.getBoundingClientRect();
        /* Calculate the cursor's x and y coordinates, relative to the image: */
        x = (e.pageX || e.touches[0].clientX) - a.left;
        y = (e.pageY || e.touches[0].clientY) - a.top;
        /* Consider any page scrolling: */
        x = x - window.pageXOffset;
        y = y - window.pageYOffset;
        return { x: x, y: y };
    }
    function activateZoom() {
        updateZoomScale();
        resizeLens();
        updateImage();
        moveLens();
    }
    function updateZoomScale() {
        cx = zoom.offsetWidth / lens.offsetWidth;
        cy = zoom.offsetHeight / lens.offsetHeight;
    }
    function updateImage() {
        lens.style.visibility = "visible";
        zoom.style.zIndex = "999";
        zoom.style.visibility = "visible";
        zoom.style.backgroundImage = "url('" + img.src + "')";
        zoom.style.backgroundSize =
            img.width * cx + "px " + img.height * cy + "px";
    }
    function resizeLens() {
        const scaleFactor = img.naturalWidth / img.offsetWidth;
        const aspect = zoom.offsetWidth / zoom.offsetHeight;
        let lensWidth = img.offsetWidth / scaleFactor;
        let lensHeight = img.offsetHeight / scaleFactor;
        // Aspect scale down: aspect > 1 ? horizontal : vertical
        if (aspect > 1) {
            lens.style.width = lensWidth + "px";
            lens.style.height = lensWidth / aspect + "px";
        } else {
            lens.style.width = lensHeight * aspect + "px";
            lens.style.height = lensHeight + "px";
        }
    }
    function closeZoom() {
        lens.style.visibility = "hidden";
        zoom.style.backgroundImage = null;
        zoom.style.backgroundSize = null;
        zoom.style.backgroundPosition = null;
        zoom.style.zIndex = "-999";
        zoom.style.visibility = "hidden";
    }
})(
    "#prod-img-block #prod-image img",
    "#image-zoom-overlay",
    "#prod-img-block #img-zoom-lens"
);
