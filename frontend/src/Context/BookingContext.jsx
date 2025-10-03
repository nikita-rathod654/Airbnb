import axios from 'axios'
import React, { createContext, useContext, useState } from 'react'
import { authDataContext } from './AuthContext'
import { userDataContext } from './UserContext'
import { listingDataContext } from './ListingContext'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify';
export const bookingDataContext= createContext()
function BookingContext({children}) {
    let [checkIn,setCheckIn]=useState("")
    let [checkOut,setCheckOut]=useState("")
    let [total,setTotal]=useState(0)
    let [night,setNight]=useState(0)
    let {serverUrl} = useContext(authDataContext)
    let {getCurrentUser} = useContext(userDataContext)
    let {getListing} = useContext(listingDataContext)
    let [bookingData,setBookingData]= useState([])
    let [booking,setbooking]= useState(false)
    let navigate = useNavigate()

    const handleBooking = async (id) => {
        setbooking(true)
        // --- Pre-check ---
        if (!checkIn || !checkOut || !total || !id) {
            toast.error("Please fill all booking details!");
            setbooking(false);
            return;
        }
        // --- Debug log ---
        console.log("Booking Payload:", { checkIn, checkOut, totalRent: total, id });
        try {
            let result = await axios.post(serverUrl + `/api/booking/create/${id}`,{
                checkIn, checkOut, totalRent: total
            },{withCredentials:true});
            await getCurrentUser();
            await getListing();
            setBookingData(result.data);
            console.log(result.data);
            setbooking(false);
            navigate("/booked");
            toast.success("Booking Successfully");
        } catch (error) {
            console.log(error);
            setBookingData(null);
            toast.error(error.response?.data?.message || "Booking failed");
            setbooking(false);
        }
    }

    const cancelBooking = async (id) => {
        try {
            let result = await axios.delete(serverUrl + `/api/booking/cancel/${id}`,{withCredentials:true})
            await getCurrentUser()
            await getListing()
            console.log(result.data)
            toast.success("CancelBooking Successfully")
        } catch (error) {
            console.log(error)
            toast.error(error.response?.data?.message || "Cancel booking failed");
        }
    }

    let value={
        checkIn,setCheckIn,
        checkOut,setCheckOut,
        total,setTotal,
        night,setNight,
        bookingData,setBookingData,
        handleBooking,cancelBooking,booking,setbooking
    }
    return (
        <div>
        <bookingDataContext.Provider value={value}>
            {children}
        </bookingDataContext.Provider>
        </div>
    )
}

export default BookingContext