import React from 'react';
import ExploreBtn from "@/components/ExploreBtn";

const Home = () => {
  return (
      <section>
          <h1 className='text-center'>The Hub for Every Dev<br />Event You Can't Miss</h1>
          <p className='text-center mt-5'>Hackathons, Meetups, and Conference, All in one Place</p>
          <ExploreBtn />

          <div className='mt-7 space-y-7'>
              <ul className='events'>
                  {[1, 2, 3, 4, 5].map((event)=>(
                      <li key='event'>Event {event}</li>
                  ))}
              </ul>
          </div>
      </section>
  )
}

export default Home;
