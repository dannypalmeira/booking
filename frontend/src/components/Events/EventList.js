import React from "react";
import EventItem from "./EventList/EventItem/EventItem";
import './EventList.css';

const EventList = (props) => { 
    const eventData = props.events.map(event => {
        return (
            <EventItem
            key={event._id}
            eventId={event._id}
            title={event.title}
            price={event.price}
            date={event.date}
            userId={props.authUserId}
            creatorId={event.creator._id}
            onDetail={props.onViewDetail}
             />
        );
    });
return <ul className="events__list">{eventData}</ul>;

};

export default EventList;