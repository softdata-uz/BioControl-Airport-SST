import React from "react";
import {
    Player,
    PosterImage,
    ControlBar,
    PlayToggle,
    BigPlayButton,
    LoadingSpinner,
    ReplayControl,
    ForwardControl,
    VolumeMenuButton,
    PlaybackRateMenuButton
} from "video-react";

import "../../../../../node_modules/video-react/dist/video-react.css";

const VideoPlayer = (props) => {
    return (
        <Player poster={props.poster} src={props.src} startTime={300}>
            <BigPlayButton position="center" />
            <LoadingSpinner />
            <ControlBar autoHide={false} disableDefaultControls={false}>
                <PlayToggle />
                <VolumeMenuButton vertical />
                <ReplayControl seconds={10} order={2.2} />
                <ForwardControl seconds={10} order={3.2} />
                <PlaybackRateMenuButton rates={[2, 1.5, 1, 0.5, 0.1]} />
            </ControlBar>
        </Player>
    );
};

export default VideoPlayer;
