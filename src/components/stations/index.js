import React, { useEffect, useState, useRef, forwardRef } from 'react';
import { DataGrid } from '@material-ui/data-grid';
import './styles.css'
import { useParams, useHistory, Link } from 'react-router-dom';
import Button from '@material-ui/core/Button';
import ButtonGroup from '@material-ui/core/ButtonGroup';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import { makeStyles } from '@material-ui/core/styles';
import { useForm } from 'react-hook-form';
const useStyles = makeStyles((theme) => ({
    root: {
        display: 'flex',
        alignItems: 'center',
        '& .MuiTextField-root': {
            margin: theme.spacing(1),
            width: '25ch'
        },
    },
}));

let defaultValuesMap = {
    name: "",
    lat: 0,
    lon: 0,
    att: 0
};




const EditForm = forwardRef(({ onSubmit, initData }, ref) => {
    const classes = useStyles();
    const defaultValues = {...initData};
    const { register, handleSubmit, formState } = useForm({ shouldUnregister: false, defaultValues });
    const [dataForForm, setDataForForm] = useState({})
    const [formInit, setFormInit] = useState(false);
    useEffect(() => {
        if (formState.isDirty) return;
        Object.keys(defaultValuesMap).map((key) => {
            
            return register(key, { value:  initData[key] })
        })
    }, [initData.lat, initData.lon, initData.name, initData.att])

    useEffect(()=> {
        console.log(formState)
        if (formInit) return;
        setFormInit(true)
        setDataForForm({...initData})
        
    },[formState])

    return <form ref={ref} className={classes.root} autoComplete="off" onSubmit={handleSubmit(onSubmit)}>
        <TextField helperText="Simple Name" error={formState.errors.name} required type="text" label="Name" {...register("name", { required: true, value: initData.name })} />
        <TextField helperText="-180 < x < 180" error={formState.errors.lon} required type="number" label="Longitude"  {...register("lon", { required: true, value: initData.lon, min: -180, max: 180 })} />
        <TextField helperText="-90 < x < 90" error={formState.errors.lat} required type="number" label="Latitude" {...register("lat", { required: true, value: initData.lat,  min: -90, max: 90 })} />
        <TextField helperText="required" error={formState.errors.att} required type="number" label="Attitude"  {...register("att", { required: true , value: initData.att})} />
        <Button variant="contained" type="submit" style={{ maxHeight: '32px' }}>Save</Button>
    </form>

})

export function StationsAdd(props) {
    const history = useHistory();
    const editForm = useRef({});
    const onSubmit = (data) => {
        const storageData = JSON.parse(localStorage.getItem('weatherstations') || '[]')
        const id = storageData.push(data) - 1;
        storageData[id].id = id;
        localStorage.setItem('weatherstations', JSON.stringify(storageData));
        history.push(`/stations`);
    }
    return (
        <Grid item xl={12} lg={12} md={12} sm={12} xs={12}>
            <EditForm ref={editForm} onSubmit={onSubmit} initData={{}} />
        </Grid >

    );

}

export function StationsEdit(props) {
    const history = useHistory();
    const urlParams = useParams();
    const editForm = useRef();
    const [storagedata, setStoragedata] = useState(JSON.parse(localStorage.getItem('weatherstations') || '[]'))
    const onSubmit = data => {
        const storageData = JSON.parse(localStorage.getItem('weatherstations') || '[]')
        data.id = urlParams.id
        storageData[urlParams.id] = data
        localStorage.setItem('weatherstations', JSON.stringify(storageData));
        history.push(`/stations`);
    }
    return (
        <Grid item xl={12} lg={12} md={12} sm={12} xs={12}>
            <EditForm ref={editForm} onSubmit={onSubmit} initData={storagedata[urlParams.id]} />
        </Grid>
    );

}

export function Stations(props) {
    const [stationsParsed, setStationsParsed] = useState(JSON.parse(localStorage.getItem('weatherstations') || '[]'))
    const deleteItem = (event, params) => {
        console.log(params)
        const storageData = JSON.parse(localStorage.getItem('weatherstations') || '[]')
        storageData.splice(params.id, 1);
        localStorage.setItem('weatherstations', JSON.stringify(storageData))
        setStationsParsed(storageData);
    }

    const columns = [
        { field: 'name', headerName: 'Name', width: 180, editable: false },
        { field: 'lat', headerName: 'Latitude', width: 120, editable: false },
        { field: 'lon', headerName: 'Longitude', width: 120, editable: false },
        { field: 'att', headerName: 'Attitude', width: 120, editable: false },
        {
            field: 'delete', headerName: 'Actions', width: 160, editable: false, renderCell: (params) => {
                return (
                    <ButtonGroup disableElevation variant="outlined" color="primary">
                        <Button onClick={e => deleteItem(e, params)}>Delete</Button>
                    </ButtonGroup>
                )

            }
        }
    ];

    return (
        <Grid key={'stations-grid-1'} container item layout={"row"} spacing={2} xl={12} lg={12} md={12} sm={12} xs={12}>
            <Grid item xl={12} lg={12} md={12} sm={12} xs={12}>
                <Link to={'/stations/add'}>
                    <Button variant="outlined" color="primary" m={2}>Add new</Button>
                </Link>
            </Grid>
            <Grid item xl={12} lg={12} md={12} sm={12} xs={12}>
                <div style={{ height: 520, width: '100%' }}>
                    <DataGrid rows={stationsParsed} columns={columns}></DataGrid>
                </div>
            </Grid>
        </Grid>
    )


}