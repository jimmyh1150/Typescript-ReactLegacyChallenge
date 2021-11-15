export interface IGeolocation {
  geoEnabled: boolean;
  latitude: number;
  longitude: number;
}

class Geolocation {
  public geoEnabled: boolean = false;
  public latitude!: number;
  public longitude!: number;

  constructor() {
    if ("geolocation" in navigator) {
      this.geoEnabled = true;
    } else {
      console.warn("[geolocation] disabled, please enable to continue");
    }
  }

  serialize(): IGeolocation {
    const { geoEnabled, latitude, longitude } = this;
    return { geoEnabled, latitude, longitude };
  }

  public async fetchLocation() {
    if (!this.geoEnabled) {
      throw new Error(
        "[geolocation] geolocation not supported in this browser"
      );
    }

    if (!this.latitude || !this.longitude) {
      try {
        const location: any = await new Promise((resolve, reject) => {
          navigator.geolocation.getCurrentPosition(resolve, reject, {
            timeout: 10000,
            maximumAge: 1000 * 60 * 60 * 24,
          });
        });

        console.debug("[geolocation] success", location);

        this.latitude = location.coords.latitude;
        this.longitude = location.coords.longitude;
      } catch (e) {
        console.debug("[geolocation] error getting user location", e);
        throw e;
      }
    }

    return this.serialize();
  }
}
const _geoLocation = new Geolocation();
export default _geoLocation;
