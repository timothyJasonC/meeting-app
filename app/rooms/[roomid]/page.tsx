'use client'
import React, { useEffect, useRef } from 'react';
import { ZegoUIKitPrebuilt } from '@zegocloud/zego-uikit-prebuilt';
import { v4 as uuid } from 'uuid';
import useUser from '@/hooks/useUser';

export default function Page({ params }: { params: { roomid: string } }) {
    const { fullName } = useUser();
    const roomID = params.roomid;
    const meetingContainerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const initializeMeeting = async () => {
            if (meetingContainerRef.current) {
                const appID = parseInt(process.env.NEXT_PUBLIC_ZEGO_APP_ID!);
                const serverSecret = process.env.NEXT_PUBLIC_ZEGO_SERVER_SECRET!;
                const kitToken = ZegoUIKitPrebuilt.generateKitTokenForTest(
                    appID,
                    serverSecret,
                    roomID,
                    uuid(),
                    fullName || "user" + Date.now(),
                    600
                );

                const zp = ZegoUIKitPrebuilt.create(kitToken);
                zp.joinRoom({
                    container: meetingContainerRef.current,
                    sharedLinks: [
                        {
                            name: 'Personal link',
                            url:
                                window.location.protocol + '//' +
                                window.location.host + window.location.pathname +
                                '?roomID=' + roomID,
                        },
                    ],
                    scenario: {
                        mode: ZegoUIKitPrebuilt.VideoConference,
                    },
                    maxUsers: 10
                });
            }
        };

        initializeMeeting();
    }, [roomID, fullName]);

    return (
        <div
            className="myCallContainer"
            ref={meetingContainerRef}
            style={{ width: '100vw', height: '100vh' }}
        ></div>
    );
}
