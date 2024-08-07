import { ArtistListCard } from '@/components/ArtistsSearchComponents/ArtistListCard';
import ArtistListCardLoader from '@/components/ArtistsSearchComponents/ArtistListCardLoader';
import { ArtistsSearch } from '@/components/ArtistsSearchComponents/ArtistsSearch';
import { ArtistProfile } from '@/utils/models/ArtistProfile';
import RiForbidLine from '~icons/ri/forbid-line';
import { useRouter } from 'next/router';
import { useState } from 'react';
import useSWR from 'swr';
import { ArtistCardProfile } from '@/components/ArtistsSearchComponents/ArtistCardProfile';
import { motion } from 'framer-motion';
import { NextSeo } from 'next-seo';

export default function Artists() {
  const router = useRouter();
  const [searchString, setSearchString] = useState<string>('');
  const [openedProfile, setOpenedProfile] = useState<string | null>(null);
  const [openedProfileData, setOpenedProfileData] =
    useState<ArtistProfile | null>(null);
  const { data: artistsData, error } = useSWR<{
    status: string;
    response: { data: ArtistProfile[]; has_next: boolean };
  }>(
    `${process.env.API_URL}artists?${searchString}`,
    async (input: RequestInfo, init: RequestInit) => {
      const res = await fetch(input, { ...init, credentials: 'include' });
      return res.json();
    },
    {}
  );

  return (
    <>
      <NextSeo title="Artists" />
      <section className="grid h-fit grid-cols-2 gap-8">
        <div className="flex flex-col gap-8">
          <div className="">
            <ArtistsSearch
              searchString={router.query}
              onSearchStringChanges={setSearchString}
            />
          </div>
          <div className="flex w-full flex-col gap-3">
            {artistsData
              ? artistsData.response.data.map(artist => (
                  <ArtistListCard
                    key={artist.userId}
                    artist={artist}
                    openedProfile={openedProfile}
                    openedProfileData={setOpenedProfileData}
                    onProfileOpened={setOpenedProfile}
                  />
                ))
              : [...Array(25)].map((_, index) => (
                  <ArtistListCardLoader key={index} />
                ))}
          </div>
        </div>
        <div className="h-full w-full">
          <div className="sticky top-8 h-fit w-full">
            {!openedProfile && !openedProfileData ? (
              <div className="flex h-[52px] flex-row items-center gap-3 rounded-xl bg-dot-rose/10 p-3 px-5">
                <RiForbidLine className="text-xl text-dot-rose" />
                Artist not selected.
              </div>
            ) : (
              <ArtistCardProfile
                artist={openedProfileData!}
                key={openedProfileData!.userId}
              />
            )}
          </div>
        </div>
      </section>
    </>
  );
}
