const body = document.querySelector("body"),
    sidebar = body.querySelector(".sidebar"),
    toggle = body.querySelector(".toggle"),
    searchBtn = body.querySelector(".search-box"),
    modeSwitch = body.querySelector(".toggle-switch"),
    modeText = body.querySelector(".mode-text");

    if (toggle) {
        toggle.addEventListener("click", () => {
            sidebar.classList.toggle("close");
        });
    }

    searchBtn.addEventListener("click", () =>{
        sidebar.classList.remove("close");
    });


    modeSwitch.addEventListener("click", () =>{
        body.classList.toggle("dark");

        if(body.classList.contains("dark")){
            modeText.innerText = "Light Mode"
        }else{
            modeText.innerText = "Dark Mode"
        }
    });

document.addEventListener('DOMContentLoaded', function() {
    document.querySelectorAll('.content-link').forEach(link => {
        link.addEventListener('click', function(event) {
            event.preventDefault();
            let target = this.getAttribute('data-target');

            fetch(target)
                .then(response => response.text())
                .then(data => {
                    document.querySelector(".home").innerHTML = data;
                })
                .catch(error => console.error('Error:', error));
        });
    });
});