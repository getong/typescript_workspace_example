import { useState } from "react"

export const App = () => {
  const [cnt, setCnt] = useState(0)
  return (
    <div>
      <h1>bun!</h1>
      <button onClick={() => setCnt((prev) => prev + 1)}>count: {cnt}</button>
    </div>
  )
}
