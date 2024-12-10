import http from "http"; // or 'http' depending on the URL

export default async function handler(req, res) {
  const streamUrl = "http://bulbcam.cityofpleasantonca.gov/mjpg/video.mjpg";

  // Initialize a buffer to accumulate stream data
  let buffer = Buffer.alloc(0);

  // Start the request to fetch the MJPEG stream
  http
    .get(streamUrl, (stream) => {
      stream.on("data", (chunk) => {
        // Accumulate the stream data
        buffer = Buffer.concat([buffer, chunk]);

        // Look for the boundary markers
        const boundaryStart = buffer.indexOf("--myboundary");
        const boundaryEnd = buffer.indexOf("--myboundary", boundaryStart + 1);

        // If we have two boundaries (start and end of the frame)
        if (boundaryStart !== -1 && boundaryEnd !== -1) {
          stream.destroy();
          // Extract the frame between the two boundaries
          const frameStart = boundaryStart + "--myboundary".length;
          const frameEnd = boundaryEnd;

          // Extract the frame data
          const frameData = buffer.slice(frameStart, frameEnd); // Skip past the \r\n\r\n headers

          const headerEnd = frameData.indexOf("\r\n\r\n"); // Find the end of the headers

          if (headerEnd === -1) {
            res.status(500).send("No headers found in the MJPEG stream.");
            return;
          }

          // Trim everything before the first JPEG frame
          const startOfFrame = headerEnd + 4; // Skip past \

          const trimmedBuffer = frameData.slice(startOfFrame);


          // Add Cross-Origin headers
          res.setHeader("Access-Control-Allow-Origin", "*");
          res.setHeader("Content-Type", "image/jpeg");
          res.status(200).send(trimmedBuffer);
        }
      });

      stream.on("end", () => {
        console.log("Stream ended.");
      });

      stream.on("error", (err) => {
        console.error("Stream error:", err);
        res.status(500).send("Error fetching stream");
      });
    })
    .on("error", (err) => {
      console.error("Request error:", err);
      res.status(500).send("Error fetching MJPEG stream");
    });
}
