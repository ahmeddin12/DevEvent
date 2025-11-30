import React from 'react';
import ExploreBtn from "@/components/ExploreBtn";
import EventsCard from "@/components/EventsCard";
import {events} from "@/lib/constants";

const Home = () => {
    return (
      <section>
          <h1 className='text-center'>The Hub for Every Dev<br />Event You Can't Miss</h1>
          <p className='text-center mt-5'>Hackathons, Meetups, and Conference, All in one Place</p>
          <ExploreBtn />

          <div className='mt-7 space-y-7'>
              <ul className='events'>
                  {events.map((event)=>(
                      <li key={event.title}>
                          <EventsCard image={event.image} title={event.title} location={event.location} slug={event.slug} time={event.time} date={event.date} />
                      </li>
                  ))}
              </ul>
          </div>
      </section>
  )
}

export default Home;
