import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import './App.css'
import Header from './components/Header'
import Footer from './components/Footer'
import WhatsAppFloat from './components/WhatsAppFloat'
import Home from './pages/Home'
import About from './pages/About'
import FounderDesk from './pages/FounderDesk'
import Activities from './pages/Activities'
import Gallery from './pages/Gallery'
import Volunteers from './pages/Volunteers'
import Donate from './pages/Donate'
import Contact from './pages/Contact'
import PrivacyPolicy from './pages/PrivacyPolicy'
import TermsConditions from './pages/TermsConditions'
import NotFound from './pages/NotFound'
import ScrollToTop from './components/ScrollToTop'
import CauseEducation from './pages/CauseEducation'
import CauseHealthcare from './pages/CauseHealthcare'
import CauseFoodDistribution from './pages/CauseFoodDistribution'
import CauseWomenEmpowerment from './pages/CauseWomenEmpowerment'
import CauseSeniorCitizens from './pages/CauseSeniorCitizens'
import CauseDisasterRelief from './pages/CauseDisasterRelief'
import CauseBloodDonation from './pages/CauseBloodDonation'
import CauseAnimalWelfare from './pages/CauseAnimalWelfare'

function App() {
  return (
    <Router>
      <ScrollToTop />
      <Header />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/founder-desk" element={<FounderDesk />} />
          <Route path="/activities" element={<Activities />} />
          <Route path="/gallery" element={<Gallery />} />
          <Route path="/volunteers" element={<Volunteers />} />
          <Route path="/careers" element={<Volunteers />} />
          <Route path="/donate" element={<Donate />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route path="/terms-conditions" element={<TermsConditions />} />
          {/* Cause pages */}
          <Route path="/causes/education" element={<CauseEducation />} />
          <Route path="/causes/healthcare" element={<CauseHealthcare />} />
          <Route path="/causes/food-distribution" element={<CauseFoodDistribution />} />
          <Route path="/causes/women-empowerment" element={<CauseWomenEmpowerment />} />
          <Route path="/causes/senior-citizens" element={<CauseSeniorCitizens />} />
          <Route path="/causes/disaster-relief" element={<CauseDisasterRelief />} />
          <Route path="/causes/blood-donation" element={<CauseBloodDonation />} />
          <Route path="/causes/animal-welfare" element={<CauseAnimalWelfare />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Footer />
      <WhatsAppFloat />
    </Router>
  )
}

export default App
