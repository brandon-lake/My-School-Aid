import React, { useState, useEffect } from 'react';
import Paper from '@material-ui/core/Paper';
import { ViewState, EditingState, IntegratedEditing, GroupingState } from '@devexpress/dx-react-scheduler';
import {
  Scheduler, Resources,
  DayView, WeekView, MonthView, ViewSwitcher, TodayButton, DateNavigator, 
  Toolbar, Appointments, AppointmentTooltip, ConfirmationDialog
} from '@devexpress/dx-react-scheduler-material-ui';
import Grid from '@material-ui/core/Grid';
import IconButton from '@material-ui/core/IconButton';
import EditIcon from '@material-ui/icons/Edit';
import { green, lightBlue, orange } from '@material-ui/core/colors';
import { useAuth } from '../../../contexts/AuthContext';

/* This file renders the calender component within the viewschedule page, using the react-scheduler library */
const ViewCalendar = ({
    events, setEvents, setPageState, setEventToEdit
}) => {

    const [calendarEvents, setCalendarEvents] = useState([]);
    const [grouping, setGrouping] = useState("typeId");
    const [successMsg, setSuccessMsg] = useState("");
    const [errorMsg, setErrorMsg] = useState("");
    const { currentUser } = useAuth();
    const controller = new AbortController();
    const signal = controller.signal;
    const currentDate = new Date();

    useEffect(() => {
        var typeGrouping = { "school": 0, "work": 1, "personal": 2 };
        var formData = new FormData();
        formData.append("dataToQuery", "events");
        formData.append("query", "select");
        formData.append("userid", currentUser.uid);

        // do fetch
        fetch("https://csunix.mohawkcollege.ca/~000766089/capstone/backend.php", {
            method: "POST",
            headers: new Headers(),
            body: formData,
            signal: signal
        }).then(response => {
            return response.json();
        }).then(data => {
            data = data[1];
            var localEvents = [];

            // property name mappings
            // id = EventID
            // title = Title
            // notes = Description
            // startDate = StartTime
            // endDate = EndTime
            // typeId -> type (0, 1, 2) = school, work, personal
            for (var i = 0; i < data.length; i++) {
                localEvents.push({ id: data[i].EventID, title: data[i].Title, notes: data[i].Description, typeId: typeGrouping[data[i].Type],
                    startDate: new Date(data[i].StartTime), endDate: new Date(data[i].EndTime), frequency: data[i].Frequency });
            }
            setEvents(localEvents);
            setCalendarEvents(localEvents);
        }).catch(err => {
            // error handling
        });

        return () => {
            controller.abort();
        }
    }, []);

    useEffect(() => {
        const timer = setTimeout(() => {
            setSuccessMsg("");
            setErrorMsg("");
        }, 3000);

        return () => clearTimeout(timer);
    }, [successMsg, errorMsg]);

    const resources = [{
        fieldName: 'typeId',
        title: 'Type',
        instances: [
            { text: 'School', id: 0, color: orange },
            { text: 'Work', id: 1, color: green },
            { text: 'Personal', id: 2, color: lightBlue },
        ],
    }];

    const editEvent = (eventData) => {
        var tzoneOffset = (new Date()).getTimezoneOffset() * 60000;

        var properEvent = {
            EventID: eventData.id,
            Title: eventData.title,
            Description: eventData.notes,
            Type: resources[0].instances[eventData.typeId].text.toLocaleLowerCase(),
            StartTime: new Date(eventData.startDate - tzoneOffset).toISOString().slice(0, -8),
            EndTime: new Date(eventData.endDate - tzoneOffset).toISOString().slice(0, -8),
            Frequency: eventData.frequency
        }

        setEventToEdit(properEvent);
        setPageState("edit");
    }

    const TooltipContent = (({
        children, appointmentData, classes, ...restProps
    }) => (
        <AppointmentTooltip.Content {...restProps} appointmentData={appointmentData}>
            <hr></hr>
            <Grid container alignItems="center">
                <Grid item xs={2}>
                </Grid>
                <Grid item xs={10}>
                    <span>{appointmentData.notes}</span>
                </Grid>
            </Grid>
        </AppointmentTooltip.Content>
    ));

    const Header = (({
        children, appointmentData, classes, ...restProps
    }) => (
        <AppointmentTooltip.Header {...restProps} appointmentData={appointmentData} >
            <IconButton onClick={() => editEvent(appointmentData)} >
                <EditIcon />
            </IconButton>
        </AppointmentTooltip.Header>
    ));

    const deleteEvent = (id) => {
        // fetch call to delete from database
        var formData = new FormData();
        formData.append("dataToQuery", "events");
        formData.append("query", "delete");
        formData.append("eventid", id);

        // do fetch
        fetch("https://csunix.mohawkcollege.ca/~000766089/capstone/backend.php", {
            method: "POST",
            headers: new Headers(),
            body: formData
        }).then(response => {
            return response.json();
        }).then(data => {
            // do something with returned data
            if (data[0] === true) {
                // successful db delete
                setSuccessMsg("Event successfully deleted!");

                // delete from local calendarEvents
                setCalendarEvents(calendarEvents.filter(e => e.id !== id));
            } else {
                // unsuccessful db delete
                // set an error msg
                setErrorMsg("Could not delete event.");
            }
        }).catch(err => {
            // error handling
        }).finally(() => {
            window.scrollTo(0, 0);
        });
    }

    const commitChanges = ({ added, changed, deleted }) => {
        // will not be implemented until later
        if (added !== undefined) {
            // object returned
        }
        // will not be implemented until later
        if (changed !== undefined) {
            for (var i = 0; i < calendarEvents.length; i++) {
                if (changed[calendarEvents[i].id]) {
                    console.log(changed[calendarEvents[i].id]);
                }
            }
        }

        // this method will only be used for deleting, but scaffolding will be left to implement create/change later
        if (deleted !== undefined) {
            // id returned
            deleteEvent(deleted);
        }
    }

    const filterCalendarEvents = (e) => {
        var index = parseInt(e.target.value);
        if (index === -1) {
            setCalendarEvents(events);
        } else {
            setCalendarEvents(events.filter(e => e.typeId === index));
        }
    }
    return (
        <div>
            <div style={shorterRow}>
                <h2 className="text-center mt-4">Your Schedule</h2>
            </div>
            <div className="row w-100">
                <div className="col-7"></div>
                <div className="col-3 text-right mb-3">
                    <span style={marginRight}>Displaying:</span>
                    <select style={filterSelect} id="filterEvents" onChange={filterCalendarEvents}>
                        <option value="-1">All</option>
                        <option value="0">School</option>
                        <option value="1">Work</option>
                        <option value="2">Personal</option>
                    </select>
                </div>
                <div className="col-2"></div>
            </div>

            <div className="container text-danger">
                {successMsg.length > 0 && 
                    <div className="row justify-content-center text-success">
                        <h3>{successMsg}</h3>
                    </div>
                }
                {errorMsg.length > 0 && 
                    <div className="row justify-content-center text-danger">
                        <h3>{errorMsg}</h3>
                    </div>
                }
            </div>
            <div className="row w-100">
                <div className="col-2"></div>
                <div className="col-8">
                    <Paper>
                        <Scheduler
                            data={calendarEvents}
                        >
                            <ViewState
                                defaultCurrentDate={currentDate}
                            />
                            <EditingState
                                onCommitChanges={commitChanges}
                            />
                            <IntegratedEditing />
                            <GroupingState
                                grouping={grouping}
                            />
                            <DayView
                                startDayHour={6}
                                endDayHour={24}
                                cellDuration={60}
                            />
                            <WeekView
                                startDayHour={6}
                                endDayHour={24}
                                cellDuration={60}
                            />
                            <MonthView />
                            <Toolbar />
                            <ViewSwitcher />
                            <DateNavigator />
                            <TodayButton />
                            <ConfirmationDialog />
                            <Appointments />
                            <Resources
                                data={resources}
                                mainResourceName="typeId"
                            />
                            <AppointmentTooltip
                                showCloseButton
                                showDeleteButton
                                headerComponent={Header}
                                contentComponent={TooltipContent}
                            />
                            
                            {/* <AppointmentForm
                                textEditorComponent={TextEditor}
                            /> */}
                        </Scheduler>
                    </Paper>
                </div>
                <div className="col-2"></div>
            </div>
        </div>
    );
};

const filterSelect = {
    width: "100px",
    height: "30px",
    fontSize: "1.1em"
}
const marginRight = {
    marginRight: "15px"
}
const shorterRow = {
    height: "30px"
}

export default ViewCalendar;