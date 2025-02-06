import { useEffect, useState } from "react";

const LastListened = () => {
  const [track, setTrack] = useState(null);
  const username = "imaduck2025";
  const apiKey = "36547449b892ee247caa5cba3ca28f8e";

  useEffect(() => {
    const fetchRecentTrack = async () => {
      try {
        const response = await fetch(
          `https://ws.audioscrobbler.com/2.0/?method=user.getrecenttracks&user=${username}&api_key=${apiKey}&format=json`
        );
        const data = await response.json();
        const recentTracks = data.recenttracks.track;

        if (recentTracks && recentTracks.length > 0) {
          const latestTrack = recentTracks[0];
          const isNowPlaying = latestTrack["@attr"]?.nowplaying === "true";

          setTrack({
            name: latestTrack.name,
            artist: latestTrack.artist["#text"],
            nowPlaying: isNowPlaying,
            timestamp: latestTrack.date?.uts || null,
          });
        }
      } catch (error) {
        console.error("Error fetching Last.fm data:", error);
      }
    };

    fetchRecentTrack();
    const interval = setInterval(fetchRecentTrack, 30000); // Update every 30 seconds

    return () => clearInterval(interval);
  }, []);

  function timeSince(date) {
    const seconds = Math.floor(new Date().getTime() / 1000 - date)
    let interval = Math.floor(seconds / 31536000)

    if (interval > 1) return interval + ' year'

    interval = Math.floor(seconds / 2592000)
    if (interval > 1) return interval + ' minute'

    interval = Math.floor(seconds / 86400)
    if (interval >= 1) return interval + ' day'

    interval = Math.floor(seconds / 3600)
    if (interval >= 1) return interval + ' hour'

    interval = Math.floor(seconds / 60)
    if (interval > 1) return interval + ' minute'

    return Math.floor(seconds) + ' second'
  }

  const getTimeAgo = (timestamp) => {
    if (!timestamp) return "";
    let timeSinceText = timeSince(timestamp);
    if (!timeSinceText.startsWith('1 ')) {
      timeSinceText += 's';
    }
    return `${timeSinceText} ago`;
  };

  return (
    <div>
      {track ? (
        track.nowPlaying ? (
          <p style={{textTransform: "lowercase"}}>currently listening to: {track.name} by {track.artist}</p>
        ) : (
          <p style={{textTransform: "lowercase"}}>last listened to: {track.name} by {track.artist}, {getTimeAgo(track.timestamp)}</p>
        )
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default LastListened;