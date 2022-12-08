import { useContext } from 'react'
import { useFormContext } from 'react-hook-form'
import { CyclesContext } from "../../../../contexts/CyclesContextProvider"
import { 
  FormContainer, 
  TaskInput, 
  MinutesAmountInput 
} from "./styles"

export function NewCycleForm() {
  const { activeCycle } = useContext(CyclesContext)
  const { register } = useFormContext()


  return (
    <FormContainer>
      <label htmlFor="task">I'm going to work with</label>
      <TaskInput
        type="text"
        id="task"
        placeholder="Give a name for your project"
        list="task-sugestion"
        disabled={!!activeCycle}
        {...register('task')}
      />
      <datalist id="task-sugestion">
        <option value="Projeto 1" />
        <option value="Projeto 2" />
        <option value="Projeto 3" />
        <option value="Projeto 4" />
      </datalist>

      <label htmlFor="">during</label>
      <MinutesAmountInput
        type="number"
        id="minutesAmount"
        placeholder="00"
        step={5}
        min={5}
        max={60}
        disabled={!!activeCycle}
        {...register('minutesAmount', { valueAsNumber: true })}
      />

      <span>minutes.</span>
    </FormContainer>
  )
}