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
    const imageSwitchers = document.querySelectorAll(
        "#image-switch>ul>li>a>img"
    );
    const events = ["click", "mouseover", "touchstart"];
    events.forEach((eName) => {
        imageSwitchers.forEach((el) => {
            el.addEventListener(eName, eventHandler, false);
        });
    });
    function eventHandler(event) {
        event.preventDefault();
        event.stopImmediatePropagation();
        mainImage.src = event.target.parentNode.dataset.mainImg;
        mainImage.parentNode.style.height = mainImage.offsetHeight;
        imageSwitchers.forEach((el) => {
            el.parentNode.parentNode.classList.remove("active");
        });
        event.target.parentNode.parentNode.classList.add("active");
    }
})();

(function imageZoom(imgID, zoomID, lensID) {
    let img, lens, zoom, cx, cy, disableZoom;
    // Touchscreen detect, cross-browser solution:
    const isTouch = "ontouchstart" in window || navigator.msMaxTouchPoints;
    img = document.querySelector(imgID);
    zoom = document.querySelector(zoomID);
    lens = document.querySelector(lensID);
    /* Execute a function when someone moves the cursor over the image, or the lens: */
    img.addEventListener("mouseenter", activateZoom, false);
    lens.addEventListener("mouseenter", activateZoom, false);
    lens.addEventListener("touchstart", activateZoom, false);
    img.addEventListener("touchstart", activateZoom, false);
    // Update on move
    lens.addEventListener("mousemove", moveLens, false);
    img.addEventListener("mousemove", moveLens, false);
    lens.addEventListener("touchmove", moveLens, false);
    img.addEventListener("touchmove", moveLens, false);
    // Close image
    img.addEventListener("mouseleave", closeZoom, false);
    lens.addEventListener("mouseleave", closeZoom, false);
    lens.addEventListener("touchend", closeZoom, false);
    img.addEventListener("touchend", closeZoom, false);
    lens.addEventListener("touchcancel", closeZoom, false);
    img.addEventListener("touchcancel", closeZoom, false);
    function moveLens(e) {
        let pos, x, y;
        if (disableZoom) return;
        /* Prevent any other actions that may occur when moving over the image */
        e.preventDefault();
        e.stopImmediatePropagation();
        /* Get the cursor's x and y positions: */
        pos = getCursorPos(e);
        /* Calculate the position of the lens: */
        x = pos.x - lens.offsetWidth / 2;
        y = pos.y - lens.offsetHeight / 2 + (isTouch ? window.scrollY : 0);
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
        if (document.body.clientWidth <= 768) {
            disableZoom = true;
            return;
        } else {
            disableZoom = false;
        }
        updateZoomPosition();
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
        // original size vs image box
        // const scaleFactor = img.naturalWidth / img.offsetWidth;
        // simple 2x scale
        const scaleFactor = 2;
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
    function updateZoomPosition() {
        const bodyRect = document.body.getBoundingClientRect();
        const imgBlockRect = img.parentNode.getBoundingClientRect();
        const startScroll = imgBlockRect.top - bodyRect.top - window.scrollY;
        // None to miminum scroll position
        zoom.style.height = window.innerHeight - 205 + window.scrollY + "px";
        zoom.style.position = "absolute";
        // When sticky block starts to go down
        if (startScroll < 10) {
            zoom.style.position = "fixed";
            zoom.style.top = imgBlockRect.top + "px";
            zoom.style.height = window.innerHeight - 10 + "px";
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
