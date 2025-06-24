import useSWR from 'swr'
import { getWrestlerProfile, getWrestlerMatches, WrestlerProfile } from '@/lib/api'

// SWR fetcher function
const fetcher = (url: string) => {
  const id = url.split('/').pop()
  return getWrestlerProfile(id!)
}

const matchesFetcher = (url: string) => {
  const id = url.split('/').pop()
  return getWrestlerProfile(id!).then(profile => profile.matches || [])
}

export function useWrestler(id: string) {
  const { data, error, isLoading, mutate } = useSWR(
    id ? `/api/wrestler/${id}` : null,
    fetcher,
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: true,
      errorRetryCount: 3,
    }
  )

  return {
    wrestler: data,
    isLoading,
    isError: error,
    mutate
  }
}

export function useWrestlerMatches(id: string) {
  const { data, error, isLoading, mutate } = useSWR(
    id ? `/api/wrestler/${id}` : null,
    matchesFetcher,
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: true,
      errorRetryCount: 3,
    }
  )

  return {
    matches: data || [],
    isLoading,
    isError: error,
    mutate
  }
}