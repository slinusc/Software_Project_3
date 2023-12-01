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

    modeSwitch.addEventListener("click", () =>{
        body.classList.toggle("dark");

        if(body.classList.contains("dark")){
            modeText.innerText = "Light Mode"
        }else{
            modeText.innerText = "Dark Mode"
        }
    });

export function saveMapDarkModeState(enabled) {
  localStorage.setItem('mapDarkMode', enabled);
}

document.querySelectorAll('.menu-links a').forEach(link => {
    link.addEventListener('click', function(event) {
        event.preventDefault();
        let targetSectionID = this.getAttribute('href').substring(1); // Entfernt das '#' aus dem href
        document.querySelectorAll('.home .content-section').forEach(section => {
            section.classList.remove('active');
        });
        document.getElementById(targetSectionID).classList.add('active');
    });
});
