import { forwardRef, type HTMLAttributes } from "react";
import { Input } from "../../components/Input";
import "./GeolocationInput.css";

export interface LatLng {
  lat: number;
  lng: number;
  address?: string;
}

export interface GeolocationInputProps
  extends Omit<HTMLAttributes<HTMLDivElement>, "onChange"> {
  value: LatLng | null;
  onChange: (value: LatLng | null) => void;
  mapProvider?: "none" | "embed";
  disabled?: boolean;
}

export const GeolocationInput = forwardRef<HTMLDivElement, GeolocationInputProps>(
  function GeolocationInput(
    { value, onChange, mapProvider = "none", disabled, className, ...rest },
    ref,
  ) {
    const classes = ["ui-geolocation-input", className].filter(Boolean).join(" ");

    return (
      <div ref={ref} className={classes} {...rest}>
        <Input
          aria-label="Address"
          type="text"
          value={value?.address ?? ""}
          onChange={(e) =>
            onChange({
              lat: value?.lat ?? 0,
              lng: value?.lng ?? 0,
              address: e.target.value,
            })
          }
          disabled={disabled}
          placeholder="Search address…"
        />
        <div className="ui-geolocation-input__coords">
          <Input
            aria-label="Latitude"
            type="number"
            step="0.000001"
            value={value?.lat ?? ""}
            onChange={(e) =>
              onChange({
                lat: e.target.value === "" ? 0 : Number(e.target.value),
                lng: value?.lng ?? 0,
                address: value?.address,
              })
            }
            disabled={disabled}
            placeholder="Lat"
          />
          <Input
            aria-label="Longitude"
            type="number"
            step="0.000001"
            value={value?.lng ?? ""}
            onChange={(e) =>
              onChange({
                lat: value?.lat ?? 0,
                lng: e.target.value === "" ? 0 : Number(e.target.value),
                address: value?.address,
              })
            }
            disabled={disabled}
            placeholder="Lng"
          />
        </div>
        {mapProvider === "embed" && value && (
          <div className="ui-geolocation-input__map" aria-label="Map preview">
            <span className="ui-geolocation-input__map-placeholder">
              {value.lat.toFixed(4)}, {value.lng.toFixed(4)}
            </span>
          </div>
        )}
      </div>
    );
  },
);
