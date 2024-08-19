import { currentUser, OrganizationSwitcher, SignedIn, SignOutButton } from '@clerk/nextjs'

import UserCard from '../cards/UserCard'

import { fetchCommunities } from '@/lib/actions/community.actions'
import { fetchUsers } from '@/lib/actions/user.actions'
import Image from 'next/image'
import OrganizationSwitcherr from './OrganizationSwitcher'

async function RightSidebar() {
	const user = await currentUser()
	if (!user) return null

	const similarMinds = await fetchUsers({
		userId: user.id,
		pageSize: 4,
	})

	const suggestedCOmmunities = await fetchCommunities({ pageSize: 4 })

	return (
		<section className='custom-scrollbar rightsidebar'>
			<div className='flex items-center gap-1'>
				<div className='block md:hidden'>
					<SignedIn>
						<SignOutButton>
							<div className='flex cursor-pointer'>
								<Image src='/assets/logout.svg' alt='logout' width={24} height={24} />
							</div>
						</SignOutButton>
					</SignedIn>
				</div>
				<div>
					<OrganizationSwitcherr />
					<OrganizationSwitcher />

				</div>
			</div>

			<div className='flex flex-1 flex-col justify-start'>
				<h3 className='text-heading4-medium text-light-1'>Comunidades Sugeridas</h3>

				<div className='mt-7 flex flex-col gap-9'>
					{suggestedCOmmunities.communities.length > 0 ? (
						<>
							{suggestedCOmmunities.communities.map((community) => (
								<UserCard
									key={community.id}
									id={community.id}
									name={community.name}
									username={community.username}
									imgUrl={community.image}
									personType='Community'
								/>
							))}
						</>
					) : (
						<p className='!text-base-regular text-light-3'>Sem comunidades ainda</p>
					)}
				</div>
			</div>

			<div className='flex flex-1 flex-col justify-start'>
				<h3 className='text-heading4-medium text-light-1'>Ideias Similares</h3>
				<div className='mt-7 flex flex-col gap-10'>
					{similarMinds.users.length > 0 ? (
						<>
							{similarMinds.users.map((person) => (
								<UserCard
									key={person.id}
									id={person.id}
									name={person.name}
									username={person.username}
									imgUrl={person.image}
									personType='User'
								/>
							))}
						</>
					) : (
						<p className='!text-base-regular text-light-3'>Sem utilizadores ainda</p>
					)}
				</div>
			</div>
		</section>
	)
}

export default RightSidebar

