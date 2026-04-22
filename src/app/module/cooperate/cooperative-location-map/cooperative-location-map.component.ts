import { AfterViewInit, Component, ElementRef, Input, OnDestroy, ViewChild } from '@angular/core';
import * as L from 'leaflet';

type MemberPin = {
  name: string;
  area: string;
  lat: number;
  lon: number;
};

const MEMBER_PINS: MemberPin[] = [
  { name: 'Sok Pisey', area: 'Battambang', lat: 13.11, lon: 103.18 },
  { name: 'Chea Sokha', area: 'Battambang', lat: 13.08, lon: 103.25 },
  { name: 'Lim Dara', area: 'Battambang', lat: 13.05, lon: 103.22 },
  { name: 'Pich Sophea', area: 'Siem Reap', lat: 13.4, lon: 103.8 },
  { name: 'Keo Sothea', area: 'Siem Reap', lat: 13.35, lon: 103.88 },
  { name: 'Mao Vibol', area: 'Siem Reap', lat: 13.38, lon: 103.75 },
  { name: 'Yon Chanthy', area: 'Kampong Thom', lat: 12.72, lon: 104.9 },
  { name: 'Heng Ratha', area: 'Kampong Thom', lat: 12.68, lon: 104.85 },
  { name: 'Nget Bopha', area: 'Kampong Cham', lat: 12.0, lon: 105.46 },
  { name: 'Ros Channak', area: 'Kampong Cham', lat: 12.04, lon: 105.42 },
  { name: 'Sao Kimhak', area: 'Takeo', lat: 10.99, lon: 104.79 },
  { name: 'Chan Pisey', area: 'Takeo', lat: 10.95, lon: 104.82 },
  { name: 'Noun Sreyleak', area: 'Kampot', lat: 10.61, lon: 104.19 },
  { name: 'Kong Vanna', area: 'Kampot', lat: 10.65, lon: 104.17 },
  { name: 'Tep Sophon', area: 'Prey Veng', lat: 11.49, lon: 105.32 },
  { name: 'Ouk Samnang', area: 'Banteay Meanchey', lat: 13.76, lon: 102.98 },
  { name: 'Meas Sothea', area: 'Pursat', lat: 12.54, lon: 103.93 },
  { name: 'Pen Virak', area: 'Kandal', lat: 11.22, lon: 105.13 },
  { name: 'Yorn Dara', area: 'Kep', lat: 10.48, lon: 104.32 },
  { name: 'Sim Borey', area: 'Battambang', lat: 13.14, lon: 103.2 }
];

const COOPERATIVE_PIN: MemberPin = {
  name: 'Prasat Sambor Rung Roeang MAC',
  area: 'Kampong Thom',
  lat: 12.5867,
  lon: 104.8667
};

@Component({
  selector: 'app-cooperative-location-map',
  standalone: true,
  templateUrl: './cooperative-location-map.component.html',
  styleUrl: './cooperative-location-map.component.scss',
})
export class CooperativeLocationMapComponent implements AfterViewInit, OnDestroy {
  @Input() singlePinOnly = false;

  @ViewChild('mapHost', { static: true })
  private readonly mapHost!: ElementRef<HTMLDivElement>;

  private map: L.Map | null = null;

  ngAfterViewInit(): void {
    this.map = L.map(this.mapHost.nativeElement, {
      center: [12.3, 104.6],
      zoom: 7,
      scrollWheelZoom: false
    });

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors'
    }).addTo(this.map);

    const icon = L.divIcon({
      className: '',
      html: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 36" width="24" height="36">
        <path d="M12 0C5.373 0 0 5.373 0 12c0 9 12 24 12 24S24 21 24 12C24 5.373 18.627 0 12 0z" fill="#EF4444" stroke="#991B1B" stroke-width="1.5"/>
        <circle cx="12" cy="12" r="4.5" fill="white" opacity="0.9"/>
      </svg>`,
      iconSize: [24, 36],
      iconAnchor: [12, 36],
      popupAnchor: [0, -30]
    });

    const pins = this.singlePinOnly ? [COOPERATIVE_PIN] : MEMBER_PINS;
    const bounds = L.latLngBounds([]);

    for (const pin of pins) {
      const marker = L.marker([pin.lat, pin.lon], { icon }).addTo(this.map);
      marker.bindPopup(`<strong>${pin.name}</strong><br/>${pin.area}`);
      bounds.extend([pin.lat, pin.lon]);
    }

    if (bounds.isValid()) {
      this.map.fitBounds(bounds, { padding: [20, 20], maxZoom: this.singlePinOnly ? 11 : 8 });
    }
  }

  ngOnDestroy(): void {
    this.map?.remove();
    this.map = null;
  }
}
