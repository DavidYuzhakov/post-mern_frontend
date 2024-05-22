import { useEffect, useState } from "react";
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "./store";

export function useDebounce (search: string) {
  const [value, setValue] = useState('')
  useEffect(() => {
    const handler = setTimeout(() => {
      setValue(search)
    }, 500)

    return () => clearTimeout(handler)
  }, [search])


  return value
}

// export const useAppDispatch = useDispatch<AppDispatch>()
export const useAppDispatch: () => AppDispatch = useDispatch
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector