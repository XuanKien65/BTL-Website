document.addEventListener("DOMContentLoaded", function() {
    let filterSection = document.getElementById("filterSection");
    let filterHeader = document.querySelector(".filter-header");
    let filterIcon = document.getElementById("filter-icon").querySelector("i");

    filterHeader.addEventListener("click", function() {
        if (filterSection.style.display === "none" || filterSection.style.display === "") {
            filterSection.style.display = "block";
            filterIcon.style.transform = "rotateX(180deg)";
        } else {
            filterSection.style.display = "none";
            filterIcon.style.transform = "rotate(0deg)";
        }
    });
});

document.querySelectorAll(".filter").forEach(filter => {
    filter.addEventListener("click", function() {
        this.classList.toggle("active");
    });
});

function setLayout(layout) {
            const container = document.getElementById("articlesContainer");
            if (layout === "grid") {
                container.classList.remove("list-layout");
                container.classList.add("grid-layout");
            } else {
                container.classList.remove("grid-layout");
                container.classList.add("list-layout");
            }
        }   