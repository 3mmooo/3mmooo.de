document.addEventListener('DOMContentLoaded', function () {
    var sceneEl = document.querySelector('a-scene');
    var cameraEl = sceneEl.camera.el;
    var aktuellSky = document.querySelector('#aktuellSky');
    var neuSky = document.querySelector('#neuSky');

    // Kamera-Zoom-Funktionalität
    window.addEventListener('wheel', function (e) {
        var delta = e.deltaY;
        moveInLookDirection(delta);
    });

    function moveInLookDirection(delta) {
        var direction = new THREE.Vector3();
        cameraEl.object3D.getWorldDirection(direction);
        direction.multiplyScalar(-delta * 0.05);
        cameraEl.object3D.position.add(direction);
    }

    // Warp-Funktionalität
    var menuItems = document.querySelectorAll('.menu-item');
    menuItems.forEach(function(item) {
        item.addEventListener('click', function() {
            var target = item.getAttribute('data-target');
            warpCameraTo(target);
        });
    });

    function warpCameraTo(targetId) {
        var newPosition;
        var newBackgroundId;
        switch(targetId) {
            case '#aboutMeSection':
                newPosition = '-80 10 -90';
                newBackgroundId = '#projekteSky';
                break;
            case '#gamesSection':
                newPosition = '80 10 -90';
                newBackgroundId = '#gamesSky';
                break;
            case '#MiddelSection':
                newPosition = '1 10 -90';
                newBackgroundId = '#middleSky';
                break;
            case '#ProjekteSection':
                newPosition = '-22 65 -65';
                newBackgroundId = '#aboutMeSky';
                break;
            case '#AsciiSection':
                newPosition = '20 65 -65';
                newBackgroundId = '#asciiSky';
                break;
            case '#WelcomeSection':
                newPosition = '-1 10 495';
                newBackgroundId = '#welcomeSky';
                break;
            case '#ImpressumSection':
                newPosition = '1 -350 120';
                newBackgroundId = '#impressumSky';
                break;
            case '#home':
                newPosition = '0 1.6 5';
                newBackgroundId = '#aktuellSky';
                break;
            default:
                newPosition = '0 1.6 5';
                newBackgroundId = '#defaultSky';
        }
    
        cameraEl.setAttribute('animation', {
            property: 'position',
            to: newPosition,
            dur: 1000
        });
    
        changeBackground(newBackgroundId);
    }
    
    function changeBackground(newBackgroundId) {
        var skies = document.querySelectorAll('a-sky');
        skies.forEach(function(sky) {
            if (sky.id !== newBackgroundId) {
                // Alte Hintergründe ausblenden
                sky.setAttribute('animation', {
                    property: 'material.opacity',
                    from: 1,
                    to: 0,
                    dur: 1000
                });
            }
        });
    
        // Neuen Hintergrund bereits während des Ausblendens der alten Hintergründe einblenden
        var newBackground = document.querySelector(newBackgroundId);
        newBackground.setAttribute('animation', {
            property: 'material.opacity',
            from: 0,
            to: 1,
            dur: 1000
        });
    }
    
    
    

    // Link-On-Click-Funktionalität für Clickable Boxen
    var clickables = document.querySelectorAll('.clickable');
    clickables.forEach(function(clickable) {
        clickable.addEventListener('click', function() {
            var data = clickable.components['link-on-click'].data;
            if (data.url) {
                window.open(data.url);
            }
        });
    });
});

// Komponente für das Öffnen von Links
AFRAME.registerComponent('link-on-click', {
    schema: { url: { default: '' } },
    init: function () {
        this.el.addEventListener('click', function () {
            window.open(this.data.url);
        });
    }
});


AFRAME.registerComponent('tooltip', {
    schema: {
        text: { type: 'string', default: 'Tooltip' }
    },
    init: function() {
        var tooltip = document.createElement('a-text');
        tooltip.setAttribute('value', this.data.text);
        tooltip.setAttribute('visible', false);
        tooltip.setAttribute('position', { x: 1, y: -2, z: 6 }); // Position anpassen
        tooltip.setAttribute('color', 'white'); // Farbe für bessere Sichtbarkeit
        this.el.appendChild(tooltip);
        this.tooltip = tooltip;

        this.el.addEventListener('mouseenter', () => {
            tooltip.setAttribute('visible', true);
            tooltip.setAttribute('look-at', '[camera]'); // Tooltip soll immer zur Kamera ausgerichtet sein
        });
        this.el.addEventListener('mouseleave', () => {
            tooltip.setAttribute('visible', false);
        });
    }
});

AFRAME.registerComponent('dynamic-tooltip', {
    schema: {
        text: {type: 'string', default: 'Tooltip'}
    },
    init: function() {
        var tooltip = document.createElement('a-text');
        tooltip.setAttribute('color', 'white'); // Setzt die Farbe auf Weiß für bessere Sichtbarkeit
        tooltip.setAttribute('align', 'center'); // Zentriert den Text
        tooltip.setAttribute('value', this.data.text);
        tooltip.setAttribute('visible', false);
        tooltip.setAttribute('scale', '1 1 1'); // Passt die Skalierung an
        this.el.appendChild(tooltip);
        this.tooltip = tooltip;

        this.el.addEventListener('mouseenter', () => {
            var position = this.el.object3D.position.clone();
            position.y += 0.5; // Erhöht leicht über dem Element
            tooltip.setAttribute('position', position);
            tooltip.setAttribute('visible', true);
            tooltip.setAttribute('look-at', '[camera]'); // Tooltip soll immer zur Kamera ausgerichtet sein
        });

        this.el.addEventListener('mouseleave', () => {
            tooltip.setAttribute('visible', false);
        });
    }
});

