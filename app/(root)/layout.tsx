import type React from 'react'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { ClerkProvider } from '@clerk/nextjs'
import { dark } from '@clerk/themes'

import '../globals.css'
import LeftSidebar from '@/components/shared/LeftSidebar'
import Bottombar from '@/components/shared/Bottombar'
import RightSidebar from '@/components/shared/RightSidebar'
import Topbar from '@/components/shared/Topbar'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
	title: 'Vine Community',
	description: 'Uma comunidade de desenvolvedores feita por desenvolvedroes para desnvolvedores',
	icons: {
		icon: [
			{
				media: '(prefers-color-scheme: dark)',
				url: '/logo-white.png',
				href: '/logo-white.png',
			},
			{
				media: '(prefers-color-scheme: light)',
				url: '/logo-black.png',
				href: '/logo-black.png',
			},
		],
	},
}

export default function RootLayout({
	children,
}: {
	children: React.ReactNode
}) {
	return (
		<ClerkProvider
			appearance={{
				baseTheme: dark,
			}}
		>
			<html lang='pt'>
				<body className={inter.className}>
					<Topbar />

					<main className='flex flex-row'>
						<LeftSidebar />
						<section className='main-container'>
							<div className='w-full max-w-4xl'>{children}</div>
						</section>
						<RightSidebar />
					</main>

					<Bottombar />
				</body>
			</html>
		</ClerkProvider>
	)
}
