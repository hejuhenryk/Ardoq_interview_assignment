import axios from 'axios';
import * as React from 'react';
import { Theme, toogleTheme } from './theme';

export type ButtonName = "All" | "Bikes" | "Slots"

export type StationInfo = {
	station_id: string;
	name: string;
	address: string;
	lat: number;
	lon: number;
	capacity: number;
}


export  type StationStatus = {
	is_installed: number;
	is_renting: number;
	num_bikes_available: number;
	num_docks_available: number;
	last_reported: number;
	is_returning: number;
	station_id: string;
}


export type Station = Omit<(StationInfo & StationStatus), 'station_id'>;
export  type Stations = { [key: string]: Station; }

export  const initialState = {
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

export type AppState = typeof initialState
export type Center = AppState["center"]

type Action<T extends string> = {type: T}
type ActionWithPayload<T extends string, P> = {type: T, payload: P} 

export type Actions = 
| Action<"ToogleTheme" | "SetLoading" | "RemoveLoading" | "SetInitialState" | "RemoveAllClickedStation"> 
| ActionWithPayload<"AddStation", string>
| ActionWithPayload<"SetInUse", ButtonName>
| ActionWithPayload<"RemoveClickedStation" | "AddClickStation" | "SetCenterToStation" , string>
| ActionWithPayload<"SetZoom", number> 
| ActionWithPayload<"SetStations", StationInfo[]> 
| ActionWithPayload<"SetStationsDetails", Stations> 
| ActionWithPayload<"SetCenter", Center> 
| ActionWithPayload<"SetError", boolean>

export  const reducer = (state: AppState, action: Actions): AppState => {
	const getDelta = (): Partial<AppState> => {
		switch (action.type) {
		case "ToogleTheme":
			return { theme: toogleTheme(state.theme)}
		case "SetError":
			return action.payload ? {error: true, center: initialState.center, zoom: 12, isLoading: false} : { error: false}
		case "SetLoading": 
			return { isLoading: true }
		case "RemoveLoading": 
			return { isLoading: false }

		case "AddStation": { 
			const id = action.payload
			const clickedStations = state.clickedStations.includes(id) ? state.clickedStations :  [...state.clickedStations, id]
			const station = state.stationsDetails[id]
			const center = { lat: station.lat, lng: station.lon }
			return { zoom: 16, clickedStations, center }
		}
		case "SetInitialState": 
			return initialState
		case "SetInUse": 
			return { inUse: action.payload }
		case "SetZoom":
			return { zoom: action.payload }
		case "RemoveAllClickedStation":
			return { clickedStations: [] }
		case "RemoveClickedStation":
			return { clickedStations: state.clickedStations.filter(s => s !== action.payload) }
		case "AddClickStation": {
			return { clickedStations: !state.clickedStations.includes(action.payload) ? [...state.clickedStations, action.payload] : [...state.clickedStations] }
		}
		case "SetCenterToStation": {
			const station = state.stationsDetails[action.payload]
			return { center: { lat: station.lat, lng: station.lon } }
		}
		case "SetCenter": 
			return {center: { ...action.payload}}
		case "SetStationsDetails": 
			return { stationsDetails: action.payload }
		case "SetStations": 
			return { stationsInfo: action.payload }
		}

	}
	return {...state, ...getDelta()};
}

export  const dispatchMany = (dispatch: React.Dispatch<Actions>) => (actions: Actions[] | Actions) => 
	(Array.isArray(actions)? actions: [actions]).forEach(a=>dispatch(a))


export type Dispatch = ReturnType<typeof dispatchMany>

const API_URL = "https://gbfs.urbansharing.com/oslobysykkel.no"

export const getStationsDetails = (stationsInfo: AppState["stationsInfo"], dispatch: Dispatch) => () => {
	dispatch({type: "SetLoading"})
	const newStations = {} as Stations
	stationsInfo.forEach(s=>{
	const {station_id, ...sd} = s
	newStations[s.station_id] = {...sd} as Station
	})
	axios.get(`${API_URL}/station_status.json`).then(result => {
	result.data.data.stations.forEach((s: StationStatus) => {
		if (newStations[s.station_id]) newStations[s.station_id] = { ...newStations[s.station_id], ...s }
	})
	
	dispatch([{type: "SetStationsDetails", payload: newStations}, {type: "RemoveLoading"}])
	}).catch(_ => {
		dispatch({type: "SetError", payload: true})
	})
}


export   const getStationsInfo = (dispatch: Dispatch) => () => {
	dispatch({type: "SetLoading"})
	axios.get(`${API_URL}/station_information.json`).then(r => {
	if (!r.data?.data?.stations ) 
	throw new Error("Invalid data");
	dispatch([{type: "SetStations", payload: [...r.data.data.stations] }, {type: "RemoveLoading"}])
	}).catch(_  => {
		dispatch({type: "SetError", payload: true})
	})
}
