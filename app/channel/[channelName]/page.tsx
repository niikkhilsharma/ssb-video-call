'use client'

import dynamic from 'next/dynamic'
import { useEffect, useState } from 'react'

const DynamicCall = dynamic(() => import('@/components/Call'), {
	ssr: false,
	loading: () => <p>Loading...</p>,
})

export default function Page() {
	const [renderNow, setRenderNow] = useState(false)

	useEffect(() => {
		if (typeof window !== 'undefined') {
			setRenderNow(true)
		}
	}, [])

	return <main className="flex w-full flex-col">{renderNow && <DynamicCall />}</main>
}
