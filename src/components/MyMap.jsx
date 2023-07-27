/*Imports*/

import React, { Component } from 'react';
import { MapContainer, GeoJSON, Marker, Popup, ZoomControl } from 'react-leaflet';
import mapData from "./data/countries.json";
import departamentos from "./data/departamentos-argentina.json";
import departamentosBsAs from "./data/departamentos-buenos_aires.json";
import provincias from "./data/provincias.json";
import 'leaflet/dist/leaflet.css';
import "./MyMap.css";
import L from 'leaflet';
import customIconImage from './pin.png'; // Reemplaza la ruta correcta de tu imagen
import logoRadar from './logoRadar.png'
import radar from './radar.png'





class MyMap extends Component {
    state = {       
        
        hoverProvince: null,
        clickedProvince: null,
    };

    componentDidMount() {
        console.log(mapData);
        console.log(departamentos);
        console.log(departamentosBsAs);
        console.log(provincias);
    }

    countryStyle = {
        fillColor: "#d8d7fa",
        fillOpacity: 0.6,
        color: "black",
        weight: 0.2,

    }

    

    departamentosStyle = {
        fillColor: "#a2a8f4",
        fillOpacity: 0.2,
        color: "blue",
        weight: 0.2,

    }

    provinciasStyle = {
        fillColor: "#b2b7f5",
        color: "blue",
        weight: 0.5,
        fillOpacity: 0.2,
    };

    onProvinciaMouseover = (event) => {
        const target = event.target;
      
        // Si no hay una provincia clickeada o el mouseover proviene de la provincia clickeada, aplicamos el estilo de mouseover
        if (!this.state.clickedProvince ||  this.state.clickedProvince !== target) {
          target.setStyle({
            fillColor: "#4436fc",
            fillOpacity: "0.6",
            weight: 2,
          });
          this.setState({ hoverProvince: target});
        }
      };

    onProvinciaMouseout = (event) => {
        const target = event.target;
        if (!this.state.clickedProvince ||  this.state.clickedProvince !== target){
        target.setStyle({
          fillColor: "#b2b7f5", // Vuelve al color original cuando se saca el mouse
          fillOpacity: 0.7,
          weight: 0.5,
        });
        this.setState({ hoverProvince: null })
    }
      };

      onProvinciaClick = (event) => { 
        const target = event.target;
        const {clickedProvince} = this.state;
    
        if (clickedProvince !== target) {
      if (clickedProvince) {
        // Si ya había una provincia seleccionada, restauramos su estilo
        clickedProvince.setStyle({
            fillColor: "#b2b7f5",
            fillOpacity: 0.7,
            weight: 0.5,
        });
        
    } 
    target.setStyle({
        fillColor: "#4436fc",
        fillOpacity: "0.6",
        weight: 2,
    });
    this.setState({ clickedProvince: target, hoverProvince: null });
} else {
    // Si hacemos clic nuevamente en la misma provincia, la deseleccionamos
    target.setStyle({
        fillColor: "#b2b7f5",
        fillOpacity: 0.7,
        weight: 0.5,
    });
    this.setState({ clickedProvince: null, hoverProvince: null });
}
};


    onEachProvincia = (provincia, layer) => {
        const provinciaName = provincia.properties.name;
        console.log(provinciaName);
        layer.bindPopup(provinciaName + " Casos: 15");


        
        layer.on({
            click: this.onProvinciaClick,
    
            mouseover: this.onProvinciaMouseover,
            mouseout: this.onProvinciaMouseout,
        });
    };



    render() {

           // Filtrar el área de "Argentina" del archivo countries.json
    const filteredCountriesData = mapData.features.filter(
        (feature) => feature.properties.name !== 'Argentina'
      );

        // Coordenadas de Recoleta, Buenos Aires
        const recoletaCoordinates = [-34.588889, -58.3975];

        // Configuración del marcador personalizado
        const customIcon = new L.Icon({
            iconUrl: customIconImage,
            iconSize: [30, 30],
            iconAnchor: [15, 15],
            popupAnchor: [0, -32],
        });

    

        return(

        
            <div>

            <header>

            <div id='logo' > 
             <a href=""><img id='imgLogo' src= {logoRadar} alt="" />
             </a>
            </div>

            <div>
            <ul id="menu">
                <li><a href="">REPORTÁ</a></li>
                <li><a href="">NOTAS</a></li>
                <li><a href="">SOBRE RADAR</a></li>
             </ul>
            </div>

            <div id="iso">
                <a href=""></a><img src= {radar}  alt="" />

            </div>


            </header>

            
        
             <MapContainer id='elMapa' style={{height:"100vh"}} zoom={3.7} center={[-40, -65]} ZoomControl={false} 
             
             > 

            
            
            

             
             <GeoJSON style={this.countryStyle} data={mapData.features} />
             <GeoJSON style={this.countryStyle} data={filteredCountriesData} />

             <GeoJSON style={this.departamentosStyle} data={departamentos.features} />
             
             <GeoJSON  style={this.provinciasStyle} data={provincias.features} onEachFeature={this.onEachProvincia}/>

              {/* Marcador personalizado para Recoleta */}
              <Marker position={recoletaCoordinates} icon={customIcon}>
                        <Popup>
                            Recoleta, Buenos Aires
                        </Popup>
                    </Marker>

                     {/* Botones de zoom personalizados */}
          <div className="custom-zoom-controls">
            <button className="zoom-in" onClick={() => this.setState({ zoom: this.state.zoom + 1 })}>+</button>
            <button className="zoom-out" onClick={() => this.setState({ zoom: this.state.zoom - 1 })}>-</button>
          </div>

           {/* ZoomControl predeterminado de Leaflet */}
           <ZoomControl position="bottomleft" />

             </MapContainer>

            <section>
            <div>
                <h2>REPORTÁ</h2>

            </div>

            <div>
            <h2>
                NOTAS
            </h2>

            </div>

            </section>

             
        
               
                
            </div>
         );
    }
}

export default MyMap;