import React, { useEffect, useState } from 'react';
import {
  useParams,
  useHistory,
  Link
} from "react-router-dom";
import './styles.css';
import moment from 'moment';
import Autocomplete from '../places/autocomplete';
import Maps from '../maps/maps';
import Preloader from '../preloader'
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';

const apiUrl = process.env.REACT_APP_OPENWEATHER_API_URL;
const apiKey = process.env.REACT_APP_OPENWEATHER_API_KEY;
const cacheTime = +process.env.REACT_APP_CACHE_TIME;
const useStyles = makeStyles((theme) => ({
  root: {
    '& > *': {
      margin: theme.spacing(1),
    },
  },
  paper: {
    padding: theme.spacing(2),
    textAlign: 'center',
    color: theme.palette.text.secondary,
    width: "100%"
  },
}));

const RenderForecast = ({ data }) => {
  return data.list ? [...Array(5).keys()].reduce((acc, el, id) => {
    return acc.concat([
      <Grid key={`render-forecast-grid-${id}1`} item xl={4} lg={4} md={4} sm={4} xs={4}>{moment().format('dddd')}, {moment().format('LL')}</Grid>,
      <Grid key={`render-forecast-grid-${id}2`} item xl={2} lg={2} md={2} sm={2} xs={2}><img src={`http://openweathermap.org/img/w/${data.list[id].weather[0].icon}.png`} /></Grid>,
      <Grid key={`render-forecast-grid-${id}3`} item xl={2} lg={2} md={2} sm={2} xs={2}>{data.list[id].weather[0].main}</Grid>,
      <Grid key={`render-forecast-grid-${id}4`} item xl={2} lg={2} md={2} sm={2} xs={2}>{data.list[id].main.temp_max} &deg;C</Grid>,
      <Grid key={`render-forecast-grid-${id}5`} item xl={2} lg={2} md={2} sm={2} xs={2}>{data.list[id].main.temp_min} &deg;C</Grid>
    ])
  }, []) : ''
}

const RenderWeather = ({ data }) => {
  return data.weather ?
     [
      <Grid key={'render-weather-grid-1'} item xl={4} lg={4} md={4} sm={4} xs={4}>{moment().format('dddd')}, {moment().format('LL')}</Grid>,
      <Grid key={'render-weather-grid-2'} item xl={2} lg={2} md={2} sm={2} xs={2}><img src={`http://openweathermap.org/img/w/${data.weather[0].icon}.png`} /></Grid>,
      <Grid key={'render-weather-grid-3'} item xl={2} lg={2} md={2} sm={2} xs={2}>{data.weather[0].main}</Grid>,
      <Grid key={'render-weather-grid-4'} item xl={2} lg={2} md={2} sm={2} xs={2}>{data.main.temp_max} &deg;C</Grid>,
      <Grid key={'render-weather-grid-5'} item xl={2} lg={2} md={2} sm={2} xs={2}>{data.main.temp_min} &deg;C</Grid>,
      <Grid key={'render-weather-grid-6'} item xl={12} lg={12} md={12} sm={12} xs={12} ></Grid>,
      <Grid key={'render-weather-grid-7'} item xl={12} lg={12} md={12} sm={12} xs={12} ></Grid>,
      <Grid key={'render-weather-grid-8'} item xl={12} lg={12} md={12} sm={12} xs={12} ></Grid>
     ] : ''
  
}

const RenderDataGrid = ({ data, latLon }) => {
  
  return (
    <>
      <Grid item xl={12} lg={12} md={12} sm={12} xs={12} ><h3>Current weather for {data.name || data.city && data.city.name || ''}</h3></Grid>
      <Grid item xl={8} lg={8} md={8} sm={8} xs={8}></Grid>
      <Grid item xl={2} lg={2} md={2} sm={2} xs={2}>High</Grid>
      <Grid item xl={2} lg={2} md={2} sm={2} xs={2}>Low</Grid>
      {!latLon.forecast ? <RenderWeather data={data} /> : <RenderForecast data={data} /> }
    </>
    
    
  )
}

const WeatherCard = () => {
  const urlParams = useParams();
  const history = useHistory();
  const [latLon, setLatLon] = useState({ lat: undefined, lon: undefined, forecast: false });
  const [isPositioning, setIsPositioning] = useState(false);
  const [data, setData] = useState({});
  const [refreshing, setRefreshing] = useState(false);
  const classes = useStyles();

  useEffect(() => {
    const fetchGeoData = async () => {
      if ((isNaN(urlParams.lat) || isNaN(urlParams.lon)) && !isPositioning) {
        setIsPositioning(true);
        await new Promise((resolve, reject) => {
          navigator.geolocation.getCurrentPosition(function (position) {
            history.push(`/weather/${position.coords.latitude}/${position.coords.longitude}`);
            setIsPositioning(false);
            resolve();
          });
        });
      } else {
        setLatLon({ lat: urlParams.lat, lon: urlParams.lon, forecast: !!urlParams.forecast });
        setRefreshing(true);
      }
    }
    fetchGeoData();
  }, [urlParams.lat, urlParams.lon, urlParams.forecast])


  useEffect(() => {
    const fetchData = async () => {
      if (!isNaN(latLon.lat) && !isNaN(latLon.lon)) {
        if (new Date(+localStorage.getItem(`${latLon.forecast ? 'forecast' : 'weather'}Datalastupdate${latLon.lat}${latLon.lon}`) + cacheTime * 60000) > new Date()) {
          setData(JSON.parse(localStorage.getItem(`${latLon.forecast ? 'forecast' : 'weather'}Data${latLon.lat}${latLon.lon}`)));
        } else {
          await fetch(`${apiUrl}/${latLon.forecast ? 'forecast' : 'weather'}?lat=${latLon.lat}&lon=${latLon.lon}&units=metric&appid=${apiKey}`)
            .then(res => res.json())
            .then(result => {
              setData(result);
              localStorage.setItem(`${latLon.forecast ? 'forecast' : 'weather'}Data${latLon.lat}${latLon.lon}`, JSON.stringify(result));
              localStorage.setItem(`${latLon.forecast ? 'forecast' : 'weather'}Datalastupdate${latLon.lat}${latLon.lon}`, +new Date());
            });
        }
        setRefreshing(false);
      }
    }
    fetchData();
    console.log('WE HERE! 0')
  }, [latLon.lat, latLon.lon, latLon.forecast]);

  return (
    <>
      <Grid key={'weather-grid-3'} container item layout={"row"} spacing={0} xl={12} lg={12} md={12} sm={12} xs={12}>
        <Grid item xl={6} lg={6} md={6} sm={6} xs={12}>
          <Autocomplete inputInitial={data.name || data.city && data.city.name || ''} forecast={latLon.forecast}></Autocomplete>
        </Grid>
        <Grid item xl={6} lg={6} md={6} sm={6} xs={12}>
          <Link to={`/weather/${latLon.lat}/${latLon.lon}`}>
            <Button variant="outlined" color="primary" m={2}>
              Current
            </Button>
          </Link>
          <Link to={`/weather/${latLon.lat}/${latLon.lon}/forecast`}>
            <Button variant="outlined" color="primary">
              5 day
            </Button>
          </Link>
        </Grid>
      </Grid>
      <Grid key={'weather-grid-1'} container item spacing={0} xl={6} lg={6} md={6} sm={6} xs={12}>
        {!refreshing 
            ? <RenderDataGrid data={data} latLon={latLon} /> 
            : <Preloader text={'LOOKING OUTSIDE FOR YOU... ONE SEC'} />
        }
      </Grid>
      <Grid key={'weather-grid-2'} item xl={6} lg={6} md={6} sm={6} xs={12}>
        <Maps lon={latLon.lon} lat={latLon.lat} />
      </Grid>
    </>
  )
}

export default WeatherCard;