import { useState } from 'react'

const KEY = 'ers_sidebar'

// Desktop sidebar: expanded or an icon rail. The choice is remembered on this device.
export function useSidebarCollapsed() {
  const [collapsed, setCollapsed] = useState(() => {
    try {
      return localStorage.getItem(KEY) === 'collapsed'
    } catch {
      return false
    }
  })

  const toggle = () =>
    setCollapsed((c) => {
      try {
        localStorage.setItem(KEY, c ? 'expanded' : 'collapsed')
      } catch {
        /* the choice just will not persist */
      }
      return !c
    })

  return [collapsed, toggle]
}
