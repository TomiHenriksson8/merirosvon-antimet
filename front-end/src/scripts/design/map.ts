declare var L: any;

class MapInitializer {
    private map: any;

    constructor(private mapId: string) {
        this.initMap();
        this.setupResizeListener();
    }

    private initMap(): void {
        // Determine the initial zoom level based on screen width
        const isSmallScreen = window.innerWidth < 600;
        const zoomLevel = isSmallScreen ? 12 : 13;

        // Initialize the map with the dynamic zoom level and new coordinates
        this.map = L.map(this.mapId).setView([60.223904, 24.758388], zoomLevel);

        // Add tile layer
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {}).addTo(this.map);

        // Add a marker at the specified coordinates
        L.marker([60.223904, 24.758388]).addTo(this.map)
    }

    private setupResizeListener(): void {
        // Adjust map size on window resize
        window.addEventListener('resize', () => {
            this.map.invalidateSize();
        });
    }
}

new MapInitializer('map');