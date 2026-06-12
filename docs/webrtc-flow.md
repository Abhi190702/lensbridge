# WebRTC Flow

Phone:

1. Capture camera with `getUserMedia`.
2. Create `RTCPeerConnection`.
3. Add video tracks.
4. Create offer.
5. Send offer through signaling.
6. Receive answer and ICE candidates.

Desktop:

1. Connect to signaling.
2. Receive offer.
3. Create answer.
4. Render remote track in the webview.
