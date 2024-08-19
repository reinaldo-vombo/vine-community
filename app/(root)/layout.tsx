import type React from 'react'
import type { Metadata } from 'next'
import { ptPT } from "@clerk/localizations"
import { Roboto } from 'next/font/google'
import { ClerkProvider } from '@clerk/nextjs'
import { dark } from '@clerk/themes'

import '../globals.css'
import LeftSidebar from '@/components/shared/LeftSidebar'
import Bottombar from '@/components/shared/Bottombar'
import RightSidebar from '@/components/shared/RightSidebar'

const roboto = Roboto({
	subsets: ['latin'],
	weight: ['100', '300', '500'],
	style: 'normal',
	display: 'swap',
	variable: '--roboto'
})

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
			localization={ptPT}
			appearance={{
				baseTheme: dark,
			}}
		>
			<html lang='pt'>
				<body className={roboto.className}>
					{/* <Topbar /> */}

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

