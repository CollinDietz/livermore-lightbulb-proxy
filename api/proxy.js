export default async function handler(req, res) {
  // MJPEG stream URL you want to proxy
  const targetUrl = 'http://bulbcam.cityofpleasantonca.gov/mjpg/video.mjpg';

  try {
    // Fetch the MJPEG stream
    const response = await fetch(targetUrl);

    // Check if the response is valid
    if (!response.ok) {
      res.status(500).send('Error fetching MJPEG stream');
      return;
    }

    // Set the proper content type for MJPEG stream
    res.setHeader('Content-Type', 'multipart/x-mixed-replace; boundary=--boundary');

    // Pipe the stream from the MJPEG stream response to the client
    response.body.pipe(res);
  } catch (error) {
    console.error('Error fetching MJPEG stream:', error);
    res.status(500).send('Error fetching MJPEG stream');
  }
}
