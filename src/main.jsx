import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import 'bootstrap/dist/css/bootstrap.min.css';
// import '@fullcalendar/core/index.css';
// import '@fullcalendar/daygrid/index.css';
// import '@fullcalendar/timegrid/index.css';
// import '@fullcalendar/list/index.css';



createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
