import * as React from 'react';
import { GoogleMap, LoadScript, Marker, InfoWindow, MarkerClusterer } from '@react-google-maps/api';
import * as dotenv from 'dotenv'
import { Clusterer } from '@react-google-maps/marker-clusterer';

import pin_1 from './icons/pin_1.png'
import pin_2 from './icons/pin_2.png'
import pin_3 from './icons/pin_3.png'

import { Nav } from './Nav';
import { StationInfo } from './Station';
import { ThemeProvider, getMapOptions } from './theme';
import { ButtonName, dispatchMany, reducer, initialState, getStationsDetails,getStationsInfo } from "./state"

dotenv.config();

const API_KEY = process.env.REACT_APP_API_KEY

const App = () => {
  const [state, dispatchRaw] = React.useReducer(reducer, initialState);
  const dispatch = dispatchMany(dispatchRaw)

  const handleRemoveStation = (id: string) => 
    dispatch([
      {type: "RemoveClickedStation", payload: id},
      {type: "SetZoom", payload: 12}
    ])

  const handleMapClick = () => 
    dispatch([{type: "RemoveAllClickedStation"}, {type: "SetZoom", payload: 12}])

  const handleSetInUse = (id: ButtonName) => 
    dispatch([{type: "RemoveAllClickedStation"}, {type: "SetInUse", payload: id}])

  const getStationsDetailsCb = getStationsDetails(state.stationsInfo, dispatch)
  const getStationsInfoCb = getStationsInfo(dispatch)

  React.useEffect(getStationsDetailsCb, [state.stationsInfo])
  React.useEffect(getStationsInfoCb, [])

  const renderCluster = (clusterer: Clusterer) => 
    Object.keys(state.stationsDetails).map(key => ({ ...state.stationsDetails[key], station_id: key })).map(s => {
      const isMarker = state.inUse === "Bikes" 
        ? (s.is_renting === 1 && s.num_bikes_available > 0): state.inUse === "Slots" 
        ? (s.is_returning === 1 && s.num_docks_available > 0) : state.inUse === "All"
      if (isMarker) return null

      const icon = state.inUse === "Slots" ? pin_3 : state.inUse === "Bikes" ? pin_2 : pin_1
      const onClick = () => dispatch({type: "AddStation", payload: s.station_id } )
      const position = { lat: s.lat, lng: s.lon }
      return <Marker key={s.station_id} position={position} icon={icon} onClick={onClick} clusterer={clusterer} />
    })

  return (
    <ThemeProvider theme={state.theme}>
      <Nav inUse={state.inUse} 
        setInUse={handleSetInUse} 
        onReload={getStationsDetailsCb}
        isLoading={state.isLoading} currentTheme={state.theme} 
        toogleTheme={()=>dispatch({type: "ToogleTheme"})} />
      <LoadScript
        id="script-loader"
        googleMapsApiKey={API_KEY}
        onLoad={getStationsInfoCb}
      >
        <GoogleMap
          id='oslosykel-map'
          mapContainerStyle={ { width: "100vw", height: "80vh" }}
          center={state.center}
          zoom={state.zoom}
          onClick={handleMapClick}
          options={getMapOptions(state.theme)}
        >
          {state.error && <InfoWindow position={state.center} onCloseClick={() => dispatch({type: "SetError", payload: false})}>
            <h3>DATA WAS NOT FETCHED</h3>
          </InfoWindow>
          }
          <MarkerClusterer options={{imagePath: "https://developers.google.com/maps/documentation/javascript/examples/markerclusterer/m"}}>
            {renderCluster}
          </MarkerClusterer>
          {state.clickedStations.map(cs => state.stationsDetails[cs] && 
            <StationInfo key={cs} id={cs} station={state.stationsDetails[cs]} handleClick={handleRemoveStation} />)}
        </GoogleMap>
      </LoadScript>
    </ThemeProvider>
  );
}

export default App;





