import ReactPlayer from 'react-player';

function VideoPlayer({ url }) {
  return (
    <div className="w-full max-w-5xl mx-auto my-8 rounded-2xl overflow-hidden shadow-2xl border border-gray-700/50">
      <ReactPlayer url={url} controls width="100%" height="5000px" />
    </div>
  );
}

export default VideoPlayer;