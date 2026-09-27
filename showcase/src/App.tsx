import './index.css'
import Nav from './components/Nav'
import Hero from './components/Hero'
import Overview from './components/Overview'
import Methodology from './components/Methodology'
import Results from './components/Results'
import Findings from './components/Findings'
import Artifacts from './components/Artifacts'
import Footer from './components/Footer'

export default function App() {
  return (
    <>
      <Nav />
      <main>
        <Hero />
        <Overview />
        <Methodology />
        <Results />
        <Findings />
        <Artifacts />
      </main>
      <Footer />
    </>
  )
}
