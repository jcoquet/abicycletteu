export const config = {
  state: {
    folderId: null,
    folderChooserOpened: false,
    leaflet: {
      map: null,
    },
  },
  actions: {
    setFolderId: ({ state }, folderId) => (state.folderId = folderId),
    closeFolderChooser: ({ state }) => (state.folderChooserOpened = false),
    openFolderChooser: ({ state }) => (state.folderChooserOpened = true),
    setMap: ({ state }, map) => (state.leaflet.map = () => map),
    zoomIn: ({ state }) => state.leaflet.map().zoomIn(),
    zoomOut: ({ state }) => state.leaflet.map().zoomOut(),
    fitBounds: ({ state }) => {
      const map = state.leaflet.map();
      map.eachLayer(layer => {
        if (layer._layers) {
          const markers = layer.getLayers();
          const bounds = L.latLngBounds(
            markers.map(marker => marker.getLatLng())
          ).pad(0.1);
          map.flyToBounds(bounds);
        }
      });
    },
  },
};
