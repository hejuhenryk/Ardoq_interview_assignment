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
import styled from 'styled-components';


dotenv.config();

const API_KEY = process.env.REACT_APP_API_KEY


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
type Center = {
  lat: number;
  lng: number;
}
type Stations = {
  [key: string]: Station;
}

const containerStyle = { width: "100vw", height: "80vh" }

const initialState = {
  center: { lat: 59.91, lng: 10.75 },
  zoom: 12, 
  stationsInfo: [] as StationInfo[],
  stationsDetails: {} as Stations,
  clickedStations: [] as string[],
  isLoading: false,
  error: false,
  inUse: "All" as ButtonName,
  theme: "light" as Theme
}

type AppState = typeof initialState
type Action<T extends string> = {type: T}
type ActionWithPayload<T extends string, P> = {type: T, payload: P} 
type Actions = 
  | Action<"ToogleTheme" | "SetError" | "RemoveError" | "SetLoading" | "RemoveLoading" | "SetInitialState" | "RemoveAllClickedStation"> 
  | ActionWithPayload<"SetInUse", ButtonName>
  | ActionWithPayload<"RemoveClickedStation" | "AddClickStation" | "SetCenterToStation" , string>
  | ActionWithPayload<"SetZoom", number> 
  | ActionWithPayload<"SetStations", StationInfo[]> 
  | ActionWithPayload<"SetStationsDetails", Stations> 
  | ActionWithPayload<"SetCenter", Center> 
  

const reducer = (state: AppState, action: Actions): AppState => {
  const getDelta = () => {
    switch (action.type) {
      case "ToogleTheme":
        return { theme: toogleTheme(state.theme)}
      case "SetError":
        return { error: true }
      case "RemoveError": 
        return { error: false }
      case "SetLoading": 
        return { loading: true }
      case "RemoveLoading": 
        return { loading: false }
      case "SetInitialState": 
        return { ...initialState }
      case "SetInUse": 
        return { inUse: action.payload }
      case "SetZoom":
        return { zoom: action.payload }
      case "RemoveAllClickedStation":
        return { clickedStations: [] }
      case "RemoveClickedStation":
        return { clickedStations: state.clickedStations.filter(s => s !== action.payload) }
      case "AddClickStation": {
        return { clickedStation: !state.clickedStations.includes(action.payload) ? [...state.clickedStations, action.payload] : state.clickedStations }
      }
      case "SetCenterToStation": 
        return { center: {
          lat: state.stationsDetails[action.payload].lat,
          lng: state.stationsDetails[action.payload].lon
        } }
      case "SetCenter": 
        return { center: {...action.payload}}
      case "SetStationsDetails": 
        return { stationsDetails: action.payload }
      case "SetStations": 
        return { stationsInfo: action.payload }
    }

  }
  console.log(getDelta())
  return {...state, ...getDelta()};
}

function App() {
  const [state, dispatch] = React.useReducer(reducer, initialState);

  const handleAddStation = (id: string) => {
    dispatch({type: "AddClickStation", payload: id})
    dispatch({type: "SetCenterToStation", payload: id})
    dispatch({type: "SetZoom", payload: 16})
  }
  const handleRemoveStation = (id: string) => {
    dispatch({type: "RemoveClickedStation", payload: id})
    dispatch({type: "SetZoom", payload: 16})
  }

  const handleMapClick = () => {
    dispatch({type: "RemoveAllClickedStation"})
    dispatch({type: "SetZoom", payload: 12})
  }
  const handleSetInUse = (id: any) => {
    dispatch({type: "RemoveAllClickedStation"})
    dispatch({type: "SetInUse", payload: id})
  }

 const getStationsDetails = React.useCallback(()=>{
  const newStations = {} as Stations
  dispatch({type: "SetLoading"})
  dispatch({type: "RemoveError"})
  state.stationsInfo.forEach(s=>{
    const {station_id, ...sd} = s
    newStations[s.station_id] = {...sd} as Station
  })
  axios.get("https://gbfs.urbansharing.com/oslobysykkel.no/station_status.json").then(r => {
    r.data.data.stations.forEach((s: StationStatus) => {
      if (newStations[s.station_id]) newStations[s.station_id] = { ...newStations[s.station_id], ...s }
    })
    dispatch({type: "SetStationsDetails", payload: newStations})
    dispatch({type: "RemoveLoading"})
    }).catch(err => {
      dispatch({type: "SetCenter", payload: {...initialState.center}})
      dispatch({type: "SetZoom", payload: 12})
      dispatch({type: "SetError"})
      dispatch({type: "RemoveLoading"})
    })
 },[state.stationsInfo])

  const getStationsInfo = React.useCallback(()=>{
    dispatch({type: "SetLoading"})
    dispatch({type: "RemoveError"})
    axios.get("https://gbfs.urbansharing.com/oslobysykkel.no/station_information.json").then(r => {
      dispatch({type: "SetStations", payload: [...r.data.data.stations] })

      dispatch({type: "RemoveLoading"})

    }).catch(err => {
      dispatch({type: "SetCenter", payload: initialState.center})
      dispatch({type: "SetZoom", payload: 12})
      dispatch({type: "SetError"})
      dispatch({type: "RemoveLoading"})
    })

  },[])
  
  React.useEffect(() => {
    getStationsInfo()
  }, [state.error, getStationsInfo])
  React.useEffect(()=>{
    getStationsDetails()
  },[state.inUse, getStationsDetails])

  return (
    <ThemeProvider theme={state.theme}>
      <Nav inUse={state.inUse} setInUse={handleSetInUse} onReload={getStationsDetails} isLoading={state.isLoading} theme={state.theme} toogleTheme={()=>dispatch({type: "ToogleTheme"})} />
      <LoadScript
        id="script-loader"
        googleMapsApiKey={API_KEY}
        onLoad={getStationsInfo}
      >
        <GoogleMap
          id='oslosykel-map'
          mapContainerStyle={containerStyle}
          center={state.center}
          zoom={state.zoom}
          onClick={handleMapClick}
          options={getMapOptions(state.theme)}
        >
          {/* error handling */}
          {state.error && <InfoWindow position={state.center} onCloseClick={()=>dispatch({type: "RemoveError"})} ><h3>DATA WAS NOT FETCHED</h3></InfoWindow>}
          {/* show markers */}
          <MarkerClusterer options={{imagePath: "https://developers.google.com/maps/documentation/javascript/examples/markerclusterer/m"}}>
          {(clusterer)=>{ 
            return Object.keys(state.stationsDetails).map(key => ({ ...state.stationsDetails[key], station_id: key })).map(s => {
              const isMarker = state.inUse === "Bikes" 
                ? (s.is_renting === 1 && s.num_bikes_available > 0): state.inUse === "Slots" 
                ? (s.is_returning === 1 && s.num_docks_available > 0) : state.inUse === "All"
              return isMarker && <Marker 
                key={s.station_id} 
                position={{ lat: s.lat, lng: s.lon }} 
                icon={state.inUse==="Slots" ? pin_3 : state.inUse === "Bikes" ? pin_2 : pin_1} 
                onClick={() => handleAddStation(s.station_id)} 
                clusterer={clusterer}
              />
            })
          }}
          </MarkerClusterer>
          {state.clickedStations.map(cs => state.stationsDetails[cs] && <StationInfo key={cs} id={cs} station={state.stationsDetails[cs]} handleClick={handleRemoveStation} />)}
          <></>
        </GoogleMap>
      </LoadScript>
      <Footer >Icons made by <a style={{ color: "inherit", textDecoration: "none"}} href="http://www.freepik.com/" title="Freepik">Freepik</a> from <a style={{ color: "inherit", textDecoration: "none"}} href="https://www.flaticon.com/" title="Flaticon">www.flaticon.com</a></Footer>
    
    </ThemeProvider>
  );
}

export default App;

const Footer = styled.footer`
  position: fixed;
  bottom: 0;
  right: 0;
`






