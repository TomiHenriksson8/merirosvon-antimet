/**
 * Class to initialize and manage a map using Leaflet.js.
 */
declare var L: any;

class MapInitializer {
    private map: any;

    /**
     * Initializes a new instance of the MapInitializer class.
     * @param {string} mapId The DOM element ID where the map will be initialized.
     */
    constructor(private mapId: string) {
        this.initMap();
    }

    /**
     * Initializes the map with a default view and tile layer using Leaflet.js.
     * @private
     */
    private initMap(): void {
        // Setting a default view for the map (London, in this case).
        this.map = L.map(this.mapId).setView([51.505, -0.09], 13); 

        // Adding a tile layer from OpenStreetMap.
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        }).addTo(this.map);
    }
}

// Creating an instance of MapInitializer to initialize the map.
new MapInitializer('map');