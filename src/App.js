import { BiCalendar } from 'react-icons/bi'
import Search from './components/Search'
import AddAppointment from './components/AddAppointment'
import AppointmentInfo from './components/AppointmentInfo'
import {useCallback, useEffect, useState} from "react";

function App() {
  const [appointmentList, setAppointmentList] = useState([]);
  const [query, setQuery] = useState('');
  const [sortBy, setSortBy] = useState('petName')
  const [orderBy, setOrderBy] = useState('asc')

  const filteredAppointments = appointmentList.filter(item => {
    return (
      item.petName.toLowerCase().includes(query.toLowerCase()) ||
      item.ownerName.toLowerCase().includes(query.toLowerCase()) ||
      item.aptNotes.toLowerCase().includes(query.toLowerCase())
    )
  }).sort((a, b) => {
    const order = (orderBy === 'asc') ? 1 : -1;
    return (
      a[sortBy].toLowerCase() < b[sortBy].toLowerCase() ? -1 * order : 1 * order
    )
  })

  const fetchData = useCallback(() => {
    fetch('./data.json')
      .then(response => response.json())
      .then(data => setAppointmentList(data))
  }, [])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  const onDeleteAppointment = appointmentId => {
    setAppointmentList(
      appointmentList.filter(appointment => appointment.id !== appointmentId)
    )
  }

  return (
    <div className='App container mx-auto font-thin'>
      <h1 className='text-5xl mb-3'>
        <BiCalendar className='inline-block text-red-200 align-top' />
        Your Appointments
      </h1>
      <AddAppointment
        onSendAppointment={appointment => setAppointmentList([...appointmentList, appointment])}
        lastId={appointmentList.reduce((max, item) => Number(item.id) > max ? Number(item.id): max, 0)}
      />
      <Search
        query={query}
        onQueryChange={theQuery => setQuery(theQuery)}
        orderBy={orderBy}
        onOrderByChange={(orderBy) => setOrderBy(orderBy)}
        sortBy={sortBy}
        onSortByChange={(sortBy) => setSortBy(sortBy)}
      />

      <ul className='divide-y divide-gray-200'>
        {filteredAppointments.map((appointment) => (
          <AppointmentInfo
            key={appointment.id}
            appointment={appointment}
            onDeleteAppointment={onDeleteAppointment}
          />
        ))}
      </ul>
    </div>
  )
}

export default App
