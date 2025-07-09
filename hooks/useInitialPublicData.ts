"use client"

import { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { fetchPublicData } from "@/redux/slices/publicDataSlice"
import type { RootState, AppDispatch } from "@/redux/store"

export function useInitialPublicData() {
  const dispatch = useDispatch<AppDispatch>()
  const isLoading = useSelector((state: RootState) => state.publicData.isLoading)

  useEffect(() => {
    dispatch(fetchPublicData())
  }, [dispatch])

  return {
    isLoading,
    publicData: useSelector((state: RootState) => state.publicData),
  }
}
