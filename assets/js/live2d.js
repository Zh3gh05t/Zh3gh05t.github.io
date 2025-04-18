document.addEventListener("DOMContentLoaded", function() {
    // https://unpkg.com/live2d-widget-model-z16@1.0.5/assets/z16.model.json
    L2Dwidget.init({
      model: {
        jsonPath: "https://unpkg.com/live2d-widget-model-z16@1.0.5/assets/z16.model.json",  // L'URL du modèle Live2D Z16
        
      },
      display: {
        position: "right",  // Position du modèle à gauche
        width: 250,  // Largeur du modèle
        height: 500,  // Hauteur du modèle
        hOffset: 0,  // Décalage horizontal
        vOffset: 0,  // Décalage vertical
      },
      mobile: {
        show: true,  // Afficher sur mobile
        scale: 0.2,  // Échelle sur mobile
      },
      react: {
        opacityDefault: 0.7,  // Opacité par défaut
        opacityOnHover: 1,  // Opacité lors du survol de la souris
      }
    });
  });
  