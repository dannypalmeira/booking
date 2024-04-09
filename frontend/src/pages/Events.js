import React,  { useRef, useState } from "react";
import Modal from "../components/Modal/Modal";
import Backdrop from "../components/Backdrop/Backdrop";
import './Events.css';

export default function EventsPage() {
    const [creating, setCreating] = useState(false);
    const titleElRef = useRef(null);
    const priceElRef = useRef(null);
    const dateElRef = useRef(null);
    const descriptionElRef = useRef(null);

    const startCreateEventHandler = () => { 
           setCreating(true);
        };

    const modalConfirmHandler = () => {
        setCreating(false);
        creating.preventDefault();
        const title = titleElRef.current.value;
        const price = +priceElRef.current.value;
        const date = dateElRef.current.value;
        const description = descriptionElRef.current.value;

        if (title.trim().lenght === 0 || price.trim().lenght === 0 || date.trim().lenght === 0 || description.trim().length === 0) {
            return;
        }

        const event = { title, price, date, description};
        console.log(event);
        
    }

    const modalCancelHandle = () => {
        setCreating(false);
    }

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
            <div className="events-control">
                <p>Share your own Events!</p>
                <button className="btn" onClick={startCreateEventHandler}>Create Event</button>
            </div>
            </React.Fragment>
            );   
}