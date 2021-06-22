import React from 'react';
import ReactMapboxGl from 'react-mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import './styles.css'
const Map = ReactMapboxGl({
    accessToken: process.env.REACT_APP_MAPBOX_API_KEY
});

export default function Maps({lon, lat}) {
    return !isNaN(lon) && !isNaN(lat) ? (
        <div style={{height:"100%", width: "100%", position: "relative"}}>
        <Map
            style={"mapbox://styles/mapbox/streets-v9"}
            center={[lon, lat]}
            containerStyle={{
                height: '100%',
                width: '100%',
                maxHeight: '480px',
                minHeight: '320px',
                position: 'absolute',
                top: 0,
                bottom: 0
            }}
            trackResize={true}
        >
        </Map></div>
    ) : ''
}