'use client'

import { useRouter } from 'next/navigation'

export default function Home() {
	const router = useRouter()

	return (
		<div className="flex flex-col items-center">
			<h1 className="mb-4 mt-20 text-4xl font-extrabold leading-none tracking-tight text-gray-900">Join your SSB Call</h1>
			<form
				onSubmit={e => {
					e.preventDefault()
					router.push(`/channel/test`)
				}}>
				<div className="text-center">
					<button className="inline-flex items-center justify-center px-5 py-3 mt-5 text-base font-medium text-center text-white bg-blue-400 rounded-lg hover:bg-blue-500 focus:ring-4 focus:ring-blue-300 dark:focus:ring-blue-900">
						Join Call
					</button>
				</div>
			</form>
		</div>
	)
}
