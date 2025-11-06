import React, { useState } from 'react'

interface stateInfo {
  food?: string
}

const Home: React.FC = () => {
  const [state, setState] = useState<stateInfo>({})

  // 현재 모드 확인
  console.log('현재 모드:', import.meta.env.MODE)
  console.log('URL:', import.meta.env.VITE_API_BASE_URL)

  return (
    <div>
      <div>{JSON.stringify(state)}</div>
      <Child setState={setState} state={state}></Child>
    </div>
  )
}

interface ChildProps {
  state: stateInfo
  setState: React.Dispatch<React.SetStateAction<stateInfo>>
}

const Child: React.FC<ChildProps> = ({ state, setState }) => {
  const setFood = () => {
    setState(pre => ({ ...pre, food: 'food' }))
  }

  return (
    <div>
      <div>{JSON.stringify(state)}</div>
      <button onClick={setFood}> Food 추가 하기 </button>
    </div>
  )
}

export default Home
