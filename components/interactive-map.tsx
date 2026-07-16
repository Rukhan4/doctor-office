"use client";

type InteractiveMapProps = {
  lat: number;
  lng: number;
  title: string;
};

export function InteractiveMap({ lat, lng, title }: InteractiveMapProps) {
  const zoom = 16;
  const query = `${lat},${lng}`;

  return (
    <div className="map-shell overflow-hidden rounded-[1.5rem] border border-line">
      <iframe
        title={title}
        src={`https://maps.google.com/maps?q=${query}&z=${zoom}&output=embed`}
        className="h-[300px] w-full sm:h-[380px]"
        loading="lazy"
        allowFullScreen
        referrerPolicy="no-referrer-when-downgrade"
      />
    </div>
  );
}