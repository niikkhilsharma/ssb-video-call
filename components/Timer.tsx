'use client'
import { Clock1 } from 'lucide-react'
import { Button } from './ui/button'
import { useState, useEffect } from 'react'
import { Form, FormControl, FormDescription, FormField, FormItem, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { useForm } from 'react-hook-form'

export const Timer = () => {
	const [isRunning, setIsRunning] = useState(false)
	const [initialTime, setInitialTime] = useState(55)
	const [remainingTime, setRemainingTime] = useState(initialTime)

	const form = useForm({
		defaultValues: {
			timeCount: initialTime,
		},
	})

	// Reset timer when initialTime changes and timer is not running
	useEffect(() => {
		if (!isRunning) {
			setRemainingTime(initialTime)
		}
	}, [initialTime, isRunning])

	// Handle timer logic
	useEffect(() => {
		let intervalId: NodeJS.Timeout

		if (isRunning) {
			intervalId = setInterval(() => {
				setRemainingTime(prevTime => {
					if (prevTime <= 1) {
						clearInterval(intervalId)
						setIsRunning(false)
						return initialTime
					}
					return prevTime - 1
				})
			}, 1000)
		}

		// Cleanup function
		return () => {
			if (intervalId) {
				clearInterval(intervalId)
			}
		}
	}, [isRunning, initialTime])

	// Handle timer toggle
	const toggleTimer = () => {
		if (isRunning) {
			setIsRunning(false)
			setRemainingTime(initialTime)
		} else {
			setIsRunning(true)
		}
	}

	// Handle time change directly on input change
	const handleTimeChange = (value: string) => {
		const newTime = parseInt(value)
		if (!isNaN(newTime) && newTime > 0) {
			setInitialTime(newTime)
		}
	}

	return (
		<div className="flex gap-4 w-full max-w-sm">
			<Button onClick={toggleTimer} className="hover:cursor-pointer">
				{isRunning ? (
					<span className="block w-full h-full">Stop {remainingTime} S</span>
				) : (
					<span className="flex gap-2 items-center w-full h-full">
						Start Timer <Clock1 />
					</span>
				)}
			</Button>

			<Form {...form}>
				<div className="space-y-2">
					<FormField
						control={form.control}
						name="timeCount"
						render={({ field }) => (
							<FormItem>
								<FormControl>
									<Input
										type="number"
										placeholder="Set timer seconds"
										disabled={isRunning}
										{...field}
										onChange={e => {
											field.onChange(e)
											handleTimeChange(e.target.value)
										}}
									/>
								</FormControl>
								<FormDescription>Enter timer count in seconds.</FormDescription>
								<FormMessage />
							</FormItem>
						)}
					/>
				</div>
			</Form>
		</div>
	)
}
