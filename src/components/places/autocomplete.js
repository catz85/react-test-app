import React, { useEffect, useRef } from 'react';
import TextField from '@material-ui/core/TextField';
import Paper from "@material-ui/core/Paper";
import MenuItem from '@material-ui/core/MenuItem';
import './styles.css'
import {
    useHistory
} from "react-router-dom";
import Geocoder from "react-mapbox-gl-geocoder";

const TestInput = (props) => {
    return <TextField {...props} id="standard-basic" label="Type city name" />;
    
}
const TestItems = (props) => {
    return <MenuItem {...props} className="autocomplete-thing"/>
    // return <Paper zIndex="modal" elevation={8} {...props} />;
}

const Search = ({ inputInitial, forecast }) => {
    const history = useHistory();
    const mapAccess = {
        mapboxApiAccessToken: process.env.REACT_APP_MAPBOX_API_KEY
    };
    const queryParams = {
        types: "place"
    };
    const GeoRef = useRef({});
    const onSelected = (_, item) => {
        const url = `/weather/${item.center[1]}/${item.center[0]}${!!forecast ? '/forecast' : ''}`
        history.push(url);
    };

    useEffect(() => {
        if (!GeoRef.current.state) return
        GeoRef.current.setInput(inputInitial);
    }, [inputInitial])
    return (
        <div>
            <Geocoder
                ref={GeoRef}
                {...mapAccess}
                onSelected={onSelected}
                viewport={{}}
                queryParams={queryParams}
                inputComponent={TestInput}
                itemComponent={TestItems}
            />
        </div>
    );
}
export default Search;

