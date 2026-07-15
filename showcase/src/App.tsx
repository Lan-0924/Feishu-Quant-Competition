import { ScrollProgress }    from './components/layout/ScrollProgress';
import { SiteHeader }        from './components/layout/SiteHeader';
import { Hero }              from './components/sections/Hero';
import { Highlights }        from './components/sections/Highlights';
import { Pipeline }          from './components/sections/Pipeline';
import { Results }           from './components/sections/Results';
import { Gallery }           from './components/sections/Gallery';
import { PaperSection }      from './components/sections/PaperSection';
import { Reproducibility }   from './components/sections/Reproducibility';
import { Footer }            from './components/sections/Footer';

export default function App() {
  return (
    <div className="min-h-screen bg-bg text-white">
      <ScrollProgress />
      <SiteHeader />
      <main>
        <Hero />
        <Highlights />
        <Pipeline />
        <Results />
        <Gallery />
        <PaperSection />
        <Reproducibility />
      </main>
      <Footer />
    </div>
  );
}
