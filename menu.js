document.getElementById('menuButton').onclick = function() {
    this.__toggle = !this.__toggle;
    var target = document.getElementById('menu');
    if( this.__toggle) {
        target.style.width = "30%";
    }
    else {
        target.style.width = 0;
    }
}



