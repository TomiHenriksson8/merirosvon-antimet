
declare var L: any;

class MapInitializer {
    private map: any;
    constructor(private mapId: string) {
        this.initMap();
    }
    private initMap(): void {
        this.map = L.map(this.mapId).setView([51.505, -0.09], 13); 
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        }).addTo(this.map);
    }
}

new MapInitializer('map');
