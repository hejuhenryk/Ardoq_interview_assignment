import * as React from 'react';
import { GoogleMap, LoadScript, Marker, InfoWindow, MarkerClusterer } from '@react-google-maps/api';
import * as dotenv from 'dotenv'

import axios from 'axios';
import pin_1 from './icons/pin_1.png'
import pin_2 from './icons/pin_2.png'
import pin_3 from './icons/pin_3.png'

import { Nav, ButtonName } from './Nav';
import { StationInfo } from './Station';
import { Theme, ThemeProvider, toogleTheme, getMapOptions } from './theme';


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

const containerStyle = { width: "100vw", height: "80vh" }

function App() {
  const [center, setCenter] = React.useState(initialState.center)
  const [zoom, setZoom] = React.useState(initialState.zoom)
  const [stations, setStations] = React.useState( [] as StationInfo[])
  const [stationsDetails, setStationsDetails] = React.useState( {} as Stations)
  const [clickedStations, setClickStations] = React.useState([] as string[])
  const [isLoading, setIsLoading] = React.useState(true)
  const [error, setError] = React.useState(false)
  const [inUse, setInUse] = React.useState('All' as ButtonName)
  const [theme, setTheme] = React.useState('light' as Theme)
 

  const handleAddStation = (id: string) => {
    !clickedStations.includes(id) && setClickStations([...clickedStations, id])
    setCenter({ lat: stationsDetails[id].lat, lng: stationsDetails[id].lon })
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

 const getStationsDetails = React.useCallback(()=>{
  const newStations = {} as Stations
  setIsLoading(true)
  stations.forEach(s=>{
    const {station_id, ...sd} = s
    newStations[s.station_id] = {...sd} as Station
  })
  axios.get("https://gbfs.urbansharing.com/oslobysykkel.no/station_status.json").then(r => {
    r.data.data.stations.forEach((s: StationStatus) => {
      if (newStations[s.station_id]) newStations[s.station_id] = { ...newStations[s.station_id], ...s }
    })
    setStationsDetails(newStations)
    setIsLoading(false)
    }).catch(err => {
      setCenter(initialState.center)
      setZoom(12)
      setError(true)
      setIsLoading(false)
    })
 },[stations])

  const getStationsInfo = React.useCallback(()=>{
    setIsLoading(true)
    axios.get("https://gbfs.urbansharing.com/oslobysykkel.no/station_information.json").then(r => {
      setStations([...r.data.data.stations])
      setIsLoading(false)

    }).catch(err => {
      setCenter(initialState.center)
      setZoom(12)
      setError(true)
      setIsLoading(false)
    })

  },[])
  
  React.useEffect(() => {
    getStationsInfo()
  }, [error, getStationsInfo])
  React.useEffect(()=>{
    getStationsDetails()
  },[inUse, getStationsDetails])

  return (
    <ThemeProvider theme={theme}>
      <Nav inUse={inUse} setInUse={handleSetInUse} onReload={getStationsDetails} isLoading={isLoading} theme={theme} toogleTheme={()=>setTheme(theme=>toogleTheme(theme))} />
      <LoadScript
        id="script-loader"
        googleMapsApiKey={API_KEY}
        onLoad={getStationsInfo}
      >
        <GoogleMap
          id='oslosykel-map'
          mapContainerStyle={containerStyle}
          center={center}
          zoom={zoom}
          onClick={handleMapClick}
          options={getMapOptions(theme)}
        >
          {/* error handling */}
          {error && <InfoWindow position={center} onCloseClick={()=>setError(false)} ><h3>DATA WAS NOT FETCHED</h3></InfoWindow>}
          {/* show markers */}
          <MarkerClusterer options={{imagePath: "https://developers.google.com/maps/documentation/javascript/examples/markerclusterer/m"}}>
          {(clusterer)=>{ 
            return Object.keys(stationsDetails).map(key => ({ ...stationsDetails[key], station_id: key })).map(s => {
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
          {clickedStations.map(cs => stationsDetails[cs] && <StationInfo key={cs} id={cs} station={stationsDetails[cs]} handleClick={handleRemoveStation} />)}
          <></>
        </GoogleMap>
      </LoadScript>
      <div style={{position: "fixed", bottom: 0, right: 0}}>Icons made by <a style={{ color: "inherit", textDecoration: "none"}} href="http://www.freepik.com/" title="Freepik">Freepik</a> from <a style={{ color: "inherit", textDecoration: "none"}} href="https://www.flaticon.com/" title="Flaticon">www.flaticon.com</a></div>
    </ThemeProvider>
  );
}

export default App;








