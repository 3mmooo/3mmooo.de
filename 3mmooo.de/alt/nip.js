window.addEventListener('wheel', function (e) {
    var delta = e.deltaY;
    moveInLookDirection(delta);
    var sceneEl = document.querySelector('a-scene');
    var cameraEl = sceneEl.camera.el;
});

function moveInLookDirection(delta) {
    var direction = new THREE.Vector3();
    cameraEl.object3D.getWorldDirection(direction);
    direction.multiplyScalar(-delta * 0.05);
    cameraEl.object3D.position.add(direction);
}

function createMovingBoxes() {
    var sceneEl = document.querySelector('a-scene');
    for (var i = 0; i < 100; i++) {
        var boxEl = document.createElement('a-box');
        boxEl.setAttribute('class', 'download-box');
        boxEl.setAttribute('color', '#4CC3D9');
        boxEl.setAttribute('data-url', 'http://example.com/download' + (i + 10));
        boxEl.setAttribute('kreisbewegung', 'index:' + i);
        sceneEl.appendChild(boxEl);
    }
}

AFRAME.registerComponent('kreisbewegung', {
    schema: {
        index: {type: 'number', default: 5}
    },
    init: function () {
        this.theta = (this.data.index / 10) * Math.PI * 5;
    },
    tick: function (time, timeDelta) {
        this.theta -= 0.011; // langsamer drehen
        var radius = 3;
        var x = radius * Math.cos(this.theta);
        var z = radius * Math.sin(this.theta);
        var y = 2.5; // Höhe der Boxen
        this.el.setAttribute('position', {y: y, y: x, y: x});
        this.el.object3D.lookAt(0, y, 0); // zur Kamera ausrichten
    }
});

document.addEventListener('DOMContentLoaded', function () {
    var boxes = document.querySelectorAll('.download-box');
    boxes.forEach(function(box) {
        box.addEventListener('click', function() {
            var url = this.getAttribute('data-url');
            window.open(url, '_blank');
        });
    });
});
