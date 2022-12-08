import { createContext, ReactNode, useState, useReducer, useEffect } from 'react'
import { Cycle, cyclesReducers } from '../reducers/cycles/reducer'
import { createNewCycleAction, interruptCycleAction, marCurrentCycleAsFinishedAction } from '../reducers/cycles/actions'
import { differenceInSeconds } from 'date-fns'

interface CreateCycleData {
  task: string
  minutesAmount: number
}


interface CycleContextType {
  cycles: Cycle[]
  activeCycle: Cycle | undefined
  activeCycleId: string | null
  amountSecondsPassed: number
  markCurrentCycleAsFinished: () => void
  interruptCycle: () => void
  setSecondsPassed: (seconds: number) => void
  createNewCycle: (data: CreateCycleData) => void
}

interface CyclesContextProviderProps {
  children: ReactNode
}

export const CyclesContext = createContext({} as CycleContextType)

export function CyclesContextProvider({ children }: CyclesContextProviderProps) {
  const [cyclesState, dispatch] = useReducer(
    cyclesReducers, 
    { 
      cycles: [],
      activeCycleId: null
    },  () => {
      const storedStateAsJSON = localStorage.getItem('@ignite-timer:cycles-state-1.0.0')

      if (storedStateAsJSON) {
        return JSON.parse(storedStateAsJSON)
      }
    }
  )

  const { cycles, activeCycleId } = cyclesState
  const activeCycle = cycles.find((cycle) => cycle.id === activeCycleId)
  
  const [ amountSecondsPassed, setAmountSecondsPassed ] = useState(() => {
    if (activeCycle) {
      return differenceInSeconds(new Date(), new Date(activeCycle.startDate)) 
    }

    return 0
  })
 
  useEffect(() => {
    const stateJSON = JSON.stringify(cyclesState)

    localStorage.setItem('@ignite-timer:cycles-state-1.0.0', stateJSON)
  }, [cyclesState])



  function setSecondsPassed(seconds: number) {
    setAmountSecondsPassed(seconds)
  }

  function createNewCycle(data: CreateCycleData) {
    const id = String(new Date().getTime())

    const newCycle: Cycle = {
      id,
      task: data.task,
      minutesAmount: data.minutesAmount,
      startDate: new Date(),
    }
    
    dispatch(createNewCycleAction(newCycle))

    setAmountSecondsPassed(0)
  }

  function interruptCycle() {
    dispatch(interruptCycleAction())
  }

  function markCurrentCycleAsFinished() {
    dispatch(marCurrentCycleAsFinishedAction())
  }

  return (
    <CyclesContext.Provider 
      value={{
        cycles,
        activeCycle,
        activeCycleId,
        markCurrentCycleAsFinished,
        amountSecondsPassed,
        setSecondsPassed,
        createNewCycle,
        interruptCycle
      }}
    >
      {children}
    </CyclesContext.Provider>
  )
}