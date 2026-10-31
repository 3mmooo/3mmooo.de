document.addEventListener('DOMContentLoaded', function() {
    var sceneEl = document.querySelector('a-scene');
    var numBoxes = 10; // Anzahl der Boxen
    var circleRadius = 5; // Radius des Kreises

    for (var i = 0; i < numBoxes; i++) {
        var angle = (i / numBoxes) * Math.PI * 2; // Winkel für jede Box
        var x = circleRadius * Math.cos(angle);
        var y = 1; // Höhe der Boxen
        var z = circleRadius * Math.sin(angle);

        // Erstellen Sie eine abgerundete Box
        var box = document.createElement('a-rounded-box');
        box.setAttribute('position', {x: x, y: y, z: z});
        box.setAttribute('color', '#8A2BE2');
        box.setAttribute('radius', 0.1); // Abgerundete Ecken
        box.setAttribute('link-on-click', 'url: meineSeite.html'); // URL hinzufügen

        // Klick-Event-Handler
        box.addEventListener('click', function() {
            window.location.href = this.getAttribute('link-on-click');
        });

        sceneEl.appendChild(box);
    }
});