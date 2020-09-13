import * as React from 'react';
import { GoogleMap, LoadScript, Marker, InfoWindow, MarkerClusterer } from '@react-google-maps/api';
import * as dotenv from 'dotenv'

import axios from 'axios';
import pin_1 from './icons/pin_1.png'
import pin_2 from './icons/pin_2.png'
import pin_3 from './icons/pin_3.png'

import { Nav, ButtonName } from './Nav';
import { StationInfo } from './Station';


dotenv.config();

const API_KEY = process.env.REACT_APP_API_KEY

const initialState = {
  center: { lat: 59.91, lng: 10.75 },
  zoom: 12
}
type StationInfo = {
  station_id: string;
  name: string;
  address: string;
  lat: number;
  lon: number;
  capacity: number;
}
type StationStatus = {
  is_installed: number;
  is_renting: number;
  num_bikes_available: number;
  num_docks_available: number;
  last_reported: number;
  is_returning: number;
  station_id: string;
}

export type Station = Omit<(StationInfo & StationStatus), 'station_id'>;

type Stations = {
  [key: string]: Station;
}

const mapOptions: google.maps.MapOptions = {
  styles: [
    {
      elementType: 'geometry',
      stylers: [
        {
          color: '#ebe3cd'
        }
      ]
    },
    {
      elementType: 'labels.text.fill',
      stylers: [
        {
          color: '#523735'
        }
      ]
    },
    {
      elementType: 'labels.text.stroke',
      stylers: [
        {
          color: '#f5f1e6'
        }
      ]
    },
    {
      featureType: 'administrative',
      elementType: 'geometry.stroke',
      stylers: [
        {
          color: '#c9b2a6'
        }
      ]
    },
    {
      featureType: 'administrative.land_parcel',
      elementType: 'geometry.stroke',
      stylers: [
        {
          color: '#dcd2be'
        }
      ]
    },
    {
      featureType: 'administrative.land_parcel',
      elementType: 'labels',
      stylers: [
        {
          visibility: 'off'
        }
      ]
    },
    {
      featureType: 'administrative.land_parcel',
      elementType: 'labels.text.fill',
      stylers: [
        {
          color: '#ae9e90'
        }
      ]
    },
    {
      featureType: 'landscape.natural',
      elementType: 'geometry',
      stylers: [
        {
          color: '#dfd2ae'
        }
      ]
    },
    {
      featureType: 'poi',
      elementType: 'geometry',
      stylers: [
        {
          color: '#dfd2ae'
        }
      ]
    },
    {
      featureType: 'poi',
      elementType: 'labels.text',
      stylers: [
        {
          visibility: 'off'
        }
      ]
    },
    {
      featureType: 'poi',
      elementType: 'labels.text.fill',
      stylers: [
        {
          color: '#93817c'
        }
      ]
    },
    {
      featureType: 'poi.business',
      stylers: [
        {
          visibility: 'off'
        }
      ]
    },
    {
      featureType: 'poi.park',
      elementType: 'geometry.fill',
      stylers: [
        {
          color: '#a5b076'
        }
      ]
    },
    {
      featureType: 'poi.park',
      elementType: 'labels.text.fill',
      stylers: [
        {
          color: '#447530'
        }
      ]
    },
    {
      featureType: 'road',
      elementType: 'geometry',
      stylers: [
        {
          color: '#f5f1e6'
        }
      ]
    },
    {
      featureType: 'road',
      elementType: 'labels.icon',
      stylers: [
        {
          visibility: 'off'
        }
      ]
    },
    {
      featureType: 'road.arterial',
      elementType: 'geometry',
      stylers: [
        {
          color: '#fdfcf8'
        }
      ]
    },
    {
      featureType: 'road.highway',
      elementType: 'geometry',
      stylers: [
        {
          color: '#f8c967'
        }
      ]
    },
    {
      featureType: 'road.highway',
      elementType: 'geometry.stroke',
      stylers: [
        {
          color: '#e9bc62'
        }
      ]
    },
    {
      featureType: 'road.highway.controlled_access',
      elementType: 'geometry',
      stylers: [
        {
          color: '#e98d58'
        }
      ]
    },
    {
      featureType: 'road.highway.controlled_access',
      elementType: 'geometry.stroke',
      stylers: [
        {
          color: '#db8555'
        }
      ]
    },
    {
      featureType: 'road.local',
      elementType: 'labels',
      stylers: [
        {
          visibility: 'off'
        }
      ]
    },
    {
      featureType: 'road.local',
      elementType: 'labels.text.fill',
      stylers: [
        {
          color: '#806b63'
        }
      ]
    },
    {
      featureType: 'transit',
      stylers: [
        {
          visibility: 'off'
        }
      ]
    },
    {
      featureType: 'transit.line',
      elementType: 'geometry',
      stylers: [
        {
          color: '#dfd2ae'
        }
      ]
    },
    {
      featureType: 'transit.line',
      elementType: 'labels.text.fill',
      stylers: [
        {
          color: '#8f7d77'
        }
      ]
    },
    {
      featureType: 'transit.line',
      elementType: 'labels.text.stroke',
      stylers: [
        {
          color: '#ebe3cd'
        }
      ]
    },
    {
      featureType: 'transit.station',
      elementType: 'geometry',
      stylers: [
        {
          color: '#dfd2ae'
        }
      ]
    },
    {
      featureType: 'water',
      elementType: 'geometry.fill',
      stylers: [
        {
          color: '#b9d3c2'
        }
      ]
    },
    {
      featureType: 'water',
      elementType: 'labels.text.fill',
      stylers: [
        {
          color: '#92998d'
        }
      ]
    }
  ]
}


const containerStyle = { width: "100vw", height: "80vh" }

function App() {
  const [center, setCenter] = React.useState(initialState.center)
  const [zoom, setZoom] = React.useState(initialState.zoom)
  const [stations, setStations] = React.useState({} as Stations)
  const [clickedStations, setClickStations] = React.useState([] as string[])
  const [error, setError] = React.useState(false)
  const [inUse, setInUse] = React.useState("All" as ButtonName)


  const handleAddStation = (id: string) => {
    !clickedStations.includes(id) && setClickStations([...clickedStations, id])
    setCenter({ lat: stations[id].lat, lng: stations[id].lon })
    setZoom(16)
  }
  const handleRemoveStation = (id: string) => {
    setClickStations(clickedStations.filter(s => s !== id))
    setZoom(12)
  }

  const handleMapClick = () => {
    setClickStations([])
    setZoom(12)
  }
  const handleSetInUse = (id: any) => {
    setClickStations([])
    setInUse(id)
  }

  // const getStations = () => {
  //  let newStations = {} as Stations
  //   axios.get("https://gbfs.urbansharing.com/oslobysykkel.no/station_information.json").then(r => {
  //     r.data.data.stations.forEach((s: StationInfo) => {
  //       newStations[s.station_id] = { address: s.address, lat: s.lat, lon: s.lon, name: s.name, capacity: s.capacity } as Station
  //     })
  //     setStations(newStations)
  //   }).catch(err => {
  //     setCenter(initialState.center)
  //     setZoom(12)
  //     setError(true)
  //   })
  // }
  // const getStationsDetails = React.useCallback(() => {
  //   const newStations = {...stations}
  //   axios.get("https://gbfs.urbansharing.com/oslobysykkel.no/station_status.json").then(r => {
  //     r.data.data.stations.forEach((s: StationStatus) => {
  //       if (newStations[s.station_id]) newStations[s.station_id] = { ...newStations[s.station_id], ...s }
  //     })
  //     setStations({...newStations})
  // }).catch(err => {
  //   setCenter(initialState.center)
  //   setZoom(12)
  //   setError(true)
  // })
  // },[stations])
  

  // React.useEffect(() => {
  //   getStationsDetails();
  // }, [inUse])

  // React.useEffect(()=>{},[error])
  

  React.useEffect(() => {
    let newStations = {} as Stations
    axios.get("https://gbfs.urbansharing.com/oslobysykkel.no/station_information.json").then(r => {
      r.data.data.stations.forEach((s: StationInfo) => {
        newStations[s.station_id] = { address: s.address, lat: s.lat, lon: s.lon, name: s.name, capacity: s.capacity } as Station
      })
    }).then(() => {
      axios.get("https://gbfs.urbansharing.com/oslobysykkel.no/station_status.json").then(r => {
        r.data.data.stations.forEach((s: StationStatus) => {
          if (newStations[s.station_id]) newStations[s.station_id] = { ...newStations[s.station_id], ...s }
        })
        setStations(newStations)
      })
    }).catch(err => {
      setCenter(initialState.center)
      setZoom(12)
      setError(true)
    })
  }, [error, inUse])

  return (
    <>
      <Nav inUse={inUse} setInUse={handleSetInUse} />
      <LoadScript
        id="script-loader"
        googleMapsApiKey={API_KEY}
        // onLoad={getStations}
      >
        <GoogleMap
          id='oslosykel-map'
          mapContainerStyle={containerStyle}
          center={center}
          zoom={zoom}
          onClick={handleMapClick}
          options={mapOptions}
        >
          {/* error handling */}
          {error && <InfoWindow position={center} onCloseClick={()=>setError(false)} ><h3>DATA WAS NOT FETCHED</h3></InfoWindow>}
          {/* show markers */}
          <MarkerClusterer options={{imagePath: "https://developers.google.com/maps/documentation/javascript/examples/markerclusterer/m"}}>
          {(clusterer)=>{ 
            return Object.keys(stations).map(key => ({ ...stations[key], station_id: key })).map(s => {
              const isMarker = inUse === "Bikes" 
                ? (s.is_renting === 1 && s.num_bikes_available > 0): inUse === "Slots" 
                ? (s.is_returning === 1 && s.num_docks_available > 0) : inUse === "All"
              return isMarker && <Marker 
                key={s.station_id} 
                position={{ lat: s.lat, lng: s.lon }} 
                icon={inUse==="Slots" ? pin_3 : inUse === "Bikes" ? pin_2 : pin_1} 
                onClick={() => handleAddStation(s.station_id)} 
                clusterer={clusterer}
              />
            })
          }}
          </MarkerClusterer>

          {
          }
          {clickedStations.map(cs => stations[cs] && <StationInfo key={cs} id={cs} station={stations[cs]} handleClick={handleRemoveStation} />)}
          <></>
        </GoogleMap>
      </LoadScript>
      <div style={{position: "fixed", bottom: 0, right: 0}}>Icons made by <a style={{ color: "black", textDecoration: "none"}} href="http://www.freepik.com/" title="Freepik">Freepik</a> from <a style={{ color: "black", textDecoration: "none"}} href="https://www.flaticon.com/" title="Flaticon">www.flaticon.com</a></div>

    </>
  );
}

export default App;








