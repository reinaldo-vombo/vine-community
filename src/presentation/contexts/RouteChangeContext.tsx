"use client"
import { usePathname, useSearchParams } from "next/navigation"
import {
  Suspense,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react"

type RouteChangeContextProps = {
  routeChangeStartCallbacks: Function[]
  routeChangeCompleteCallbacks: Function[]
  onRouteChangeStart: () => void
  onRouteChangeComplete: () => void
}

type RouteChangeProviderProps = {
  children: React.ReactNode
}

const RouteChangeContext = createContext<RouteChangeContextProps>(
  {} as RouteChangeContextProps
)

export const useRouteChangeContext = () => useContext(RouteChangeContext)

function RouteChangeComplete() {
  const { onRouteChangeComplete } = useRouteChangeContext()

  const pathname = usePathname()
  const searchParams = useSearchParams()
  useEffect(() => onRouteChangeComplete(), [pathname, searchParams])

  return null
}

export const RouteChangeProvider: React.FC<RouteChangeProviderProps> = ({
  children,
}: RouteChangeProviderProps) => {
  const [routeChangeStartCallbacks] = useState<Function[]>([])
  const [routeChangeCompleteCallbacks] = useState<Function[]>([])

  const onRouteChangeStart = useCallback(() => {
    routeChangeStartCallbacks.forEach((callback) => callback())
  }, [routeChangeStartCallbacks])

  const onRouteChangeComplete = useCallback(() => {
    routeChangeCompleteCallbacks.forEach((callback) => callback())
  }, [routeChangeCompleteCallbacks])

  return (
    <RouteChangeContext.Provider
      value={{
        routeChangeStartCallbacks,
        routeChangeCompleteCallbacks,
        onRouteChangeStart,
        onRouteChangeComplete,
      }}
    >
      {children}
      <Suspense>
        <RouteChangeComplete />
      </Suspense>
    </RouteChangeContext.Provider>
  )
}
