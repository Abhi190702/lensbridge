# WebRTC Flow

Phone:

1. Capture camera with `getUserMedia`.
2. Create `RTCPeerConnection`.
3. Add video tracks.
4. Connect to signaling and send `hello` with device identity.
5. Wait for desktop `pairing-approved`.
6. Create offer with the selected quality bandwidth cap.
7. Send offer through signaling.
8. Receive answer and ICE candidates.

Desktop:

1. Connect to signaling.
2. Receive the phone `hello`.
3. Auto-approve trusted devices or ask the desktop user to approve/reject unknown devices.
4. Reject offers that arrive before approval.
5. Receive the approved offer.
6. Create answer.
7. Poll inbound WebRTC stats while rendering the remote track in the webview.
