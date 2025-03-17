'use client'

import {
	LocalUser,
	RemoteUser,
	useIsConnected,
	useJoin,
	useLocalMicrophoneTrack,
	useLocalCameraTrack,
	usePublish,
	useRemoteUsers,
} from 'agora-rtc-react'
import AgoraRTC, { AgoraRTCProvider } from 'agora-rtc-react'
import { useState, useMemo } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { Timer } from './Timer'

export default function VideoCalling() {
	const client = AgoraRTC.createClient({ mode: 'rtc', codec: 'vp8' })
	return (
		<AgoraRTCProvider client={client}>
			<Basics />
		</AgoraRTCProvider>
	)
}

const Basics = () => {
	const router = useRouter()
	const pathName = usePathname()
	const channelName = pathName.split('/')[2]

	if (!channelName) router.push('/')

	const isConnected = useIsConnected()
	const [calling, setCalling] = useState(false)
	const appId = '4d45e78496014ec1917c301f9f5d17d1'
	// const [channel, setChannel] = useState('')
	const token =
		'007eJxTYGBmD5A4Fxvg4MXyR1Vx9bJ0J9XdTx43vG5g5hSzXuEYfF6BwSTFxDTV3MLE0szA0CQ12dDS0DzZ2MAwzTLNNMXQPMVQ+ej19IZARgb2lWosjAwQCOKzMJSkFpcwMAAAIsEblw=='
	const [micOn, setMic] = useState(true)
	const [cameraOn, setCamera] = useState(true)
	const { localMicrophoneTrack } = useLocalMicrophoneTrack(micOn)
	const { localCameraTrack } = useLocalCameraTrack(cameraOn)

	useJoin({ appid: appId, channel: channelName, token: token }, true)
	usePublish([localMicrophoneTrack, localCameraTrack])

	const remoteUsers = useRemoteUsers()

	// Calculate grid layout dynamically based on total participant count
	const gridLayout = useMemo(() => {
		const totalParticipants = remoteUsers.length + 1 // +1 for local user

		// Logic to determine optimal grid layout
		if (totalParticipants <= 1) {
			return 'grid-cols-1 grid-rows-1'
		} else if (totalParticipants <= 2) {
			return 'grid-cols-2 grid-rows-1'
		} else if (totalParticipants <= 4) {
			return 'grid-cols-2 grid-rows-2'
		} else if (totalParticipants <= 6) {
			return 'grid-cols-3 grid-rows-2'
		} else if (totalParticipants <= 9) {
			return 'grid-cols-3 grid-rows-3'
		} else if (totalParticipants <= 12) {
			return 'grid-cols-4 grid-rows-3'
		} else if (totalParticipants <= 16) {
			return 'grid-cols-4 grid-rows-4'
		} else if (totalParticipants <= 25) {
			return 'grid-cols-5 grid-rows-5'
		} else if (totalParticipants <= 36) {
			return 'grid-cols-6 grid-rows-6'
		} else {
			// For extremely large numbers, use a scrollable container
			return 'grid-cols-6 grid-rows-6 overflow-y-auto'
		}
	}, [remoteUsers.length])

	// Calculate video size based on participant count
	const videoSizeClass = useMemo(() => {
		const totalParticipants = remoteUsers.length + 1

		if (totalParticipants <= 4) {
			return 'h-full' // Larger videos for fewer participants
		} else if (totalParticipants <= 9) {
			return 'h-full' // Medium-sized videos
		} else {
			return 'h-full' // Smaller videos for many participants
		}
	}, [remoteUsers.length])

	return (
		<>
			{isConnected && (
				<div className="h-svh max-h-svh overflow-hidden">
					<div className={cn('w-full h-[90%] grid gap-2 p-2', gridLayout)}>
						<div className={cn('relative rounded-lg overflow-hidden bg-black/10', videoSizeClass)}>
							<LocalUser
								audioTrack={localMicrophoneTrack}
								cameraOn={cameraOn}
								micOn={micOn}
								playAudio={false}
								videoTrack={localCameraTrack}
								className="h-full w-full object-cover"
							/>
							<div className="absolute bottom-2 left-2 bg-black/50 text-white px-2 py-1 rounded text-sm">You</div>
						</div>

						{remoteUsers.map(user => (
							<div key={user.uid} className={cn('relative rounded-lg overflow-hidden bg-black/10', videoSizeClass)}>
								<RemoteUser user={user} className="h-full w-full object-cover" />
								<div className="absolute bottom-2 left-2 bg-black/50 text-white px-2 py-1 rounded text-sm">{user.uid}</div>
							</div>
						))}
					</div>

					<div className="p-4 flex justify-center space-x-4 items-start pb-10">
						<Button className="hover:cursor-pointer bg-blue-600 hover:bg-blue-700" onClick={() => setMic(a => !a)}>
							{micOn ? 'Disable mic' : 'Enable mic'}
						</Button>
						<Button className="hover:cursor-pointer bg-blue-600 hover:bg-blue-700" onClick={() => setCamera(a => !a)}>
							{cameraOn ? 'Disable camera' : 'Enable camera'}
						</Button>
						<Button
							className={cn('hover:cursor-pointer', calling ? 'bg-red-600 hover:bg-red-700' : 'bg-green-600 hover:bg-green-700')}
							onClick={() => setCalling(a => !a)}>
							{calling ? 'End calling' : 'Start calling'}
						</Button>
						<Timer />
					</div>
				</div>
			)}
		</>
	)
}
