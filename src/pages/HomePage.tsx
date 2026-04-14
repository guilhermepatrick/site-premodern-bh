import Hero from '../components/landing/Hero';
import AboutPremodern from '../components/landing/AboutPremodern';
import AboutLeague from '../components/landing/AboutLeague';
import HowToJoin from '../components/landing/HowToJoin';
import Gallery from '../components/landing/Gallery';
import NextEvents from '../components/landing/NextEvents';

export default function HomePage() {
  return (
    <>
      <Hero />
      <AboutPremodern />
      <AboutLeague />
      <HowToJoin />
      <Gallery />
      <NextEvents />
    </>
  );
}
