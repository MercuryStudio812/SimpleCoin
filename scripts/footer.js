document.addEventListener("DOMContentLoaded", () => {
    const main_btn = document.querySelector(".main-button");
    const leaderbord_btn = document.querySelector(".leaderbord-button");
    const MAIN_ID = "main";
    const LDID = "ld";
    
    let current_tab = 0;
    
    function switchColor() {
         if(current_tab == 0) {
             main_btn.classList.add("active");
                leaderbord_btn.classList.remove("active");
          } else {
               main_btn.classList.remove("active");
              leaderbord_btn.classList.add("active");
          }
    }
    
    function mainButtonClick() {
        if(current_tab == 0) {
            return;
        } else {
            current_tab = 0;
            document.getElementById(MAIN_ID).style.display = "";
            document.getElementById(LDID).style.display = "none";
            switchColor();
        }
    }
    
    function leaderbordButtonClick() {
        if(current_tab == 1) {
            return;
        } else {
            current_tab = 1;
            document.getElementById(MAIN_ID).style.display = "none";
            document.getElementById(LDID).style.display = "";
            switchColor();
        }
    }
    
    // Начальный цвет при загрузке
    switchColor();
    
    // Вешаем обработчики на кнопки
    main_btn.addEventListener("click", mainButtonClick);
    leaderbord_btn.addEventListener("click", leaderbordButtonClick);
});