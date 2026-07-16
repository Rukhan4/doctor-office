"use client";

import { InteractiveMap } from "./interactive-map";

type HomeMapPanelProps = {
  lat: number;
  lng: number;
  title: string;
};

export function HomeMapPanel({ lat, lng, title }: HomeMapPanelProps) {
  return (
    <InteractiveMap lat={lat} lng={lng} title={title} />
  );
}