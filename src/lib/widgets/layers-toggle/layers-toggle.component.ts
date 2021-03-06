import { Component, OnInit, Input} from '@angular/core';
import { EsriMapService } from './../../core/index';

@Component({
  selector: 'esri-layersToggle',
  template: `
    <div esri-customWidget [position]="position">
      <!-- Only display if there is a map and it has layers -->
      <div *ngIf="map?.layers.length > 0" class="esri-layers-toggle">
        <div *ngFor="let layer of map.layers.toArray()">
          <input type="checkbox" [checked]="layer.visible" (click)="onCheck($event, layer)" /> {{layer.title}}
          <a href="javascript:void(0)" (click)="onZoomLayer(layer)">Zoom</a>
          <esri-sublayersToggle [layer]="layer" *ngIf="layer.sublayers && layer.sublayers.items"></esri-sublayersToggle>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .esri-layers-toggle {
      z-index: 99;
      background-color: white;
      border-radius: 8px;
      padding: 10px;
      opacity: 0.75;
    }
  `]
})
export class LayersToggleComponent implements OnInit {

  map: __esri.Map;
  view: __esri.View;

  @Input() position: string;

  constructor(private mapService: EsriMapService) { }

  ngOnInit() {
    this.mapService.isLoaded.subscribe(() => {
      this.map = this.mapService.map;
      this.view = this.mapService.view;
    });
  }

  onCheck($event: any, layer: __esri.Layer) {
    layer.visible = $event.target.checked;
  }

  onZoomLayer(layer: __esri.Layer) {
    if (this.view.type==='2d') {
      (this.view as __esri.MapView).goTo(layer.fullExtent);
    } else {
      let sceneView = (this.view as __esri.SceneView);
      sceneView.goTo({
        target:layer.fullExtent,
        heading:sceneView.camera.heading
      });
    }
  }
}
