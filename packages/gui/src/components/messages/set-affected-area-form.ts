import m, { FactoryComponent } from 'mithril';
import { TextArea, TextInput, NumberInput } from 'mithril-materialized';
import { getMessage, IInject, MessageType, IAffectedArea, IareaPoly } from 'trial-manager-models';
import { LeafletMap } from 'mithril-leaflet';
import { Polygon, FeatureCollection } from 'geojson';
import { LatLngExpression, FeatureGroup, geoJSON } from 'leaflet';

export const SetAffectedAreaForm: FactoryComponent<{
  inject: IInject;
  disabled?: boolean;
  onChange?: () => void;
}> = () => {
  const convertToSec = (n: number) => (n === -1 ? -1 : n / 1000);
  const convertToMSec = (n: number) => (n === -1 ? -1 : n * 1000);

  const areaToGeoJSON = (area?: IareaPoly) => {
    const geojson: FeatureCollection<Polygon> = {
      type: 'FeatureCollection',
      features: [],
    };
    if (area && area.type && area.coordinates && area.coordinates.length > 0) {
      area.coordinates.forEach(coordinates =>
        geojson.features.push({
          type: 'Feature',
          properties: {},
          geometry: {
            type: 'Polygon',
            coordinates,
          },
        })
      );
    }
    return geoJSON(geojson) as L.GeoJSON<Polygon>;
  };

  const geoJSONtoArea = (geojson: FeatureCollection<Polygon>) =>
    geojson.features.length === 0
      ? undefined
      : {
          type: 'MultiPolygon',
          coordinates: geojson.features.reduce(
            (acc, f) => {
              acc.push(f.geometry.coordinates);
              return acc;
            },
            [] as number[][][][]
          ),
        };

  const centerArea = (area: L.GeoJSON<Polygon>) => {
    const bounds = area.getBounds();
    return Object.keys(bounds).length
      ? {
          view: bounds.getCenter(),
          zoom: 14,
        }
      : {
          view: [51.5, 5] as LatLngExpression,
          zoom: 4,
        };
  };

  return {
    view: ({ attrs: { inject, disabled, onChange } }) => {
      const aa = getMessage(inject, MessageType.SET_AFFECTED_AREA) as IAffectedArea;
      aa.id = inject.id;
      aa.begin = aa.begin || -1;
      aa.end = aa.end || -1;
      aa.restriction = aa.restriction || 'all';

      const area = areaToGeoJSON(aa.area);
      const { view, zoom } = centerArea(area);

      return [
        m(TextInput, {
          disabled,
          className: 'col s6',
          label: 'Title of the area',
          iconName: 'title',
          isMandatory: true,
          initialValue: inject.title,
          onchange: v => (inject.title = v),
        }),
        m(TextInput, {
          disabled,
          className: 'col s6',
          label: 'Restriction',
          iconName: 'directions',
          helperText: 'Types of the vehicles, which are not allowed in this area (SUMO vehicle types), default "all"',
          isMandatory: true,
          initialValue: aa.restriction,
          onchange: v => (aa.restriction = v),
        }),
        m(TextArea, {
          disabled,
          id: 'desc',
          initialValue: inject.description,
          onchange: (v: string) => (inject.description = v),
          label: 'Description',
          iconName: 'description',
        }),
        m(NumberInput, {
          disabled,
          className: 'col s6',
          label: 'Begin time',
          iconName: 'timer',
          isMandatory: true,
          helperText: 'Begin time of the duration in seconds or -1 for indefinite',
          initialValue: convertToSec(aa.begin),
          onchange: v => (aa.begin = convertToMSec(v)),
        }),
        m(NumberInput, {
          disabled,
          className: 'col s6',
          label: 'End time',
          iconName: 'timer_off',
          isMandatory: true,
          helperText: 'End time of the duration in seconds or -1 for indefinite',
          initialValue: convertToSec(aa.begin),
          onchange: v => (aa.begin = convertToMSec(v)),
        }),
        m(LeafletMap, {
          style: 'width: 100%; height: 400px; margin-top: 10px;',
          view,
          zoom,
          overlays: { area },
          visible: ['area'],
          editable: ['area'],
          showScale: { imperial: false },
          onLayerEdited: (f: FeatureGroup) => {
            const geojson = f.toGeoJSON() as FeatureCollection<Polygon>;
            const a = geoJSONtoArea(geojson);
            if (a) {
              aa.area = a;
              if (onChange) {
                onChange();
              }
            }
          },
        }),
      ];
    },
  };
};