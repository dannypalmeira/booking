import React,  { useRef, useState, useContext, useEffect } from "react";
import Modal from "../components/Modal/Modal";
import Backdrop from "../components/Backdrop/Backdrop";
import AuthContext from "../context/auth-context";
import EventList from "../components/Events/EventList";
import Spinner from "../components/Spinner/Spinner";
import './Events.css';

export default function EventsPage() {
    const [creating, setCreating] = useState(false);
    const [events, setEvents] = useState([]);
    const titleElRef = useRef(null);
    const priceElRef = useRef(null);
    const dateElRef = useRef(null);
    const [loading, isLoading] = useState(true);
    const descriptionElRef = useRef(null);

    const authContext = useContext(AuthContext);
    const token = authContext.token;

    const setLoading = () => {
        isLoading (true);
    };
 
    const startCreateEventHandler = () => { 
           setCreating(true);
        };

     const modalConfirmHandler = () => {
        setCreating(false);
        const title = titleElRef.current.value;
        const price = +priceElRef.current.value;
        const date = dateElRef.current.value;
        const description = descriptionElRef.current.value;

        if (title.trim().length === 0 || price<= 0 || date.trim().length === 0 || description.trim().length === 0) {
            return;
        }

        const event = { title, price, date, description };
        console.log(event);

        const requestBody = {
            query: `
                mutation CreateEvent($eventInput: EventInput) {
                    createEvent(eventInput: $eventInput) {
                        _id
                        title
                        description
                        price
                        date
                        creator {
                            _id
                            email
                        }
                    }
                }
            `,
            variables: {
                eventInput: {
                    title: title,
                    description: description,
                    price: price,
                    date: date,
                }
            }
        };

        const token = authContext.token;

        fetch('http://localhost:8000/graphql', {
            method: 'POST',
            body: JSON.stringify(requestBody),
            headers: {
                'Content-Type': 'application/json',
                Authorization: 'Bearer ' + token
            }
            
        })
        .then(res => {
            if (res.status !== 200 && res.status !== 201) {
                throw new Error('Failed!');
            } 
            return res.json();
        })
        .then(resData => {
            const updatedEvents = [...events, resData.data.createEvent];
            setEvents(updatedEvents);
        }) 
        .catch(err => {
            console.log(err);
        });        
    };

    const modalCancelHandle = () => {
        setCreating(false);
    };

    const fetchEvents = () => {
        const requestBody = {
            query: `
                query {
                     events {
                        _id
                        title
                        description
                        price
                        date
                        creator {
                            _id
                            email
                        }
                    }
                }
            `
        };       

        fetch('http://localhost:8000/graphql', {
            method: 'POST',
            body: JSON.stringify(requestBody),
            headers: {
                'Content-Type': 'application/json'
            }
            
        })
        .then(res => {
            if (res.status !== 200 && res.status !== 201) {
                throw new Error('Failed!');
            } 
            return res.json();
        })
        .then(resData => {
            const fetchedEvents = resData.data.events;
            setEvents(fetchedEvents);
        }) 
        .catch(err => {
            console.log(err);
            console.error('Error fetching events:', err);
        }); 
    };

    useEffect(() => {
        fetchEvents();
    }, [creating]);


        return (
            <React.Fragment>
            {creating && <Backdrop/>}
            {creating && <Modal title="Add Event" canCancel canConfirm onCancel={modalCancelHandle} onConfirm={modalConfirmHandler}>
                <form>
                    <div className="form-control">
                        <label htmlFor="title">Title</label>
                        <input type="text" id="title" ref={titleElRef}></input>
                    </div>
                    <div className="form-control">
                        <label htmlFor="price">Price</label>
                        <input type="number" id="price" ref={priceElRef}></input>
                    </div>
                    <div className="form-control">
                        <label htmlFor="date">Date</label>
                        <input type="datetime-local" id="date" ref={dateElRef}></input>
                    </div>
                    <div className="form-control">
                        <label htmlFor="description">Description</label>
                        <textarea id="description" rows="4" ref={descriptionElRef}></textarea>
                    </div>
                </form>

            </Modal> }
            {token && (
            <div className="events-control">
                <p>Share your own Events!</p>
                <button className="btn" onClick={startCreateEventHandler}>Create Event</button>
            </div>)}
                {setLoading ? (<Spinner /> ) : <EventList events={events} authUserId={authContext.userId} />}
            </React.Fragment>
            );   
}