import * as React from 'react'
import styled from 'styled-components'
import { InfoBox } from '@react-google-maps/api'
import { Station } from './App'
import bike from './icons/bike.png'
import bike_parking from './icons/bike_parking.png'

type StationInfoProps = {
    station: Station;
    id: string;
    handleClick: (id: string) => void;
}

export const StationInfo: React.FC<StationInfoProps> = ({ station, id, handleClick }) => {
    const position = { lat: station.lat, lng: station.lon }
    const options = { closeBoxURL: '', enableEventPropagation: true };
    return <InfoBox position={position} options={options}>
        <InfoContainer onClick={() => handleClick(id)} >
            <div className="content">
                <p className="address">{station.address}</p>
                <div className="details">
                    <div><img src={bike} alt="bikes"></img><p>{station.num_bikes_available}</p></div>
                    <div><img src={bike_parking} alt="slots"></img><p>{station.num_docks_available}</p></div>
                </div>
            </div>
        </InfoContainer>
    </InfoBox>
}

const InfoContainer = styled.div`
    background-color: #ffffff;
    opacity: 0.9;
    padding: .5rem;
    border-radius: 0 50% 0 50%;
    width: 12rem; 
    .content {
        p {
            color: #000;
            display: inline-block;
            text-align: left;
            width: auto;
        }
        img {
            margin-right: .5rem;
        }
        .details {
            margin-bottom: 1rem;
            & p {
                font-size: 1.5rem;
                margin: 0;
            }
        }
        .address {
            font-size: 1.2rem;
            align-self: flex-start;
            margin: .8rem 0 1.2rem;
        }
        display: flex;
        flex-direction: column;
        & div {
            width: 100%;
            display: flex;
            justify-content: flex-end;
            align-items: center;
        }
    }
`