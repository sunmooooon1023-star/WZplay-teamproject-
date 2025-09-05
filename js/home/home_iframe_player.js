let player = null;

export const initPlayer = (iframe, modalElement, videoId) => {
    const setupPlayer = () => {
        const player = new YT.Player(iframe, {
            events: {
                onReady: (event) => {
                    if (videoId) event.target.loadVideoById(videoId);
                    bindPlayButton(modalElement, player); // 모달별 player 전달
                }
            },
            playerVars: {
                autoplay: 1,
                controls: 0,
                loop: 1,
                playlist: videoId,   // 루프용
                mute: 1
            },
        });
        modalElement.player = player; // 모달에 player 저장
    };

    if (!window.YT) {
        const tag = document.createElement('script');
        tag.src = "https://www.youtube.com/iframe_api";
        document.head.appendChild(tag);
        window.onYouTubeIframeAPIReady = setupPlayer;
    } else {
        setupPlayer();
    }
};

const bindPlayButton = (modalElement, player) => {
    const btn = modalElement.querySelector('.modal-play-icon');
    if (!btn || !player) return;

    btn.addEventListener('click', () => {
        const state = player.getPlayerState();
        if (state === YT.PlayerState.PLAYING) player.pauseVideo();
        else player.playVideo();
    });
};