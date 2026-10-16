import type { Metadata } from 'next';
import Image from 'next/image';
import './about.css';

export const metadata: Metadata = {
  title: 'About',
  description: 'Meet Ian of Super Car Society.',
};

export default function About() {
  return (
    <section className="about-page" aria-labelledby="about-heading">
      <div className="about-portrait">
        <Image
          src="/images/scs/ian.PNG"
          alt="Ian standing beside a red supercar"
          width={1023}
          height={1537}
          priority
          sizes="(max-width: 700px) 88vw, 50vw"
        />
      </div>
      <h1 id="about-heading">THIS IS{' '}<span>IAN.</span></h1>
    </section>
  );
}
