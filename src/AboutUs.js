import React from "react";
import Stream from "./Stream";

function AboutUs(props) {
  return (
    <Stream
      enableComments={false}
      enableStars={false}
      expanded={true}
      disableSearch={true}
      posts={[
        {
          structured_content: {
            nodes: [
              {
                paragraph: {
                  text: "Hi Friends!",
                },
              },
              {
                paragraph: {
                  text:
                    "We are Jack and Olga and we are here to share photos and stories of our traveling adventures!",
                },
              },
              {
                paragraph: {
                  text: `We left Berkeley, CA on July 2018 after finishing our engineering PhDs and taking a "sabbatical" from our jobs to experience new things and travel around the world. We cleared our wonderful tiny studio apartment (a lot of goodwill trips and friend donations took place) and packed everything else in our backpacks.`,
                },
              },
              {
                paragraph: {
                  text:
                    "We love spending time with each other, going on adventures, and finding new activities to do together. We want to use this opportunity to get inspired, try new things and gain new skills. At the same time, we want to motivate others to do the same thing: never settle and keep pushing to live new experiences.",
                },
              },
              {
                paragraph: {
                  text: `
Our plan is to:
                  <ul>
                    <li>travel as much as we can,</li>
                    <li>experience new cultures,</li>
                    <li>get off the beaten path,</li>
                    <li>step out of our comfort zone,</li>
                    <li>meet other travelers and locals,</li>
                    <li>share our experiences, and</li>
                    <li>get inspired!</li>
                  </ul>`,
                },
              },
              {
                paragraph: {
                  text:
                    "We have never done extended traveling before, so this is hopefully going to be a great experience for not only us, but you as well, as we wish to share all the ups and downs of newbie couple traveling.",
                },
              },
              {
                paragraph: {
                  text: `If you want to contact us while we are on the road, please leave us a note in our <a href='/guestbook/guestbook.html'">guestbook</a> or email us at our email:</br><a href="mailto:taxeedeetravels@gmail.com"><i>taxeedeetravels@gmail.com</i></a></br>`,
                },
              },
              {
                paragraph: {
                  text: `For more travel photos you can also follow <a target="_blank" href='https://www.instagram.com/taxeedee_travels/?hl=en'">our instagram @taxeedee_travels</a>.`,
                },
              },
            ],
          },
          photo: {
            url:
              "https://storage.googleapis.com/quiklyrics-go.appspot.com/about_us.jpg",
          },
          location: {
            city: "Clear Lake, California",
            country: "USA",
          },
          title: "About Us",
          comments: [],
        },
      ]}
    />
  );
}

export default AboutUs;
