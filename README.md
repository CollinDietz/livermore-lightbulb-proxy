# livermore-lightbulb-proxy

A simple app to run on vercel to fetch a single frame of the mjpg stream of the Livermore Centential Light Bulb hosted on http://bulbcam.cityofpleasantonca.gov/mjpg/video.mjpg.

## Why?

The stream from that page never "ends" so I cannot just get the data direct from there to use on a webpage. 
Additionally the content from that stream does not allow for cross-origin access, which meant I couldn't run ML identification on it. 
This app pulls data from the stream until it sees the streams custom frame barrier, and forwards along a single frame to the requestor so it can be used

## See it used

I made it for use with my is-the-light-still-on website, which can be seen [here](https://github.com/CollinDietz/is-the-light-still-on)
