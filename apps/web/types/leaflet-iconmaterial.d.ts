import "leaflet";

declare module "leaflet" {
  namespace IconMaterial {
    type IconOptions = {
      icon?: string;
      iconColor?: string;
      markerColor?: string;
      outlineColor?: string;
      outlineWidth?: number;
      iconSize?: [number, number];
    };

    function icon(options: IconOptions): L.Icon;

    class Icon extends L.Icon {
      constructor(options: IconOptions);
    }
  }
}
