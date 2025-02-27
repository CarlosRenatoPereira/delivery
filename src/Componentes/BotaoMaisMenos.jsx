
import  Button  from '@mui/material/Button';
import { MinusIcon, PlusIcon } from "lucide-react"
import  Input  from '@mui/material/Input';
import { useState } from "react"

export default function QuantityCounter() {
  const [value, setValue] = useState(1)

  const increment = () => {
    setValue((prev) => prev + 1)
  }

  const decrement = () => {
    setValue((prev) => Math.max(1, prev - 1))
  }

  const handleChange = (e) => {
    const newValue = Number.parseInt(e.target.value)
    if (!isNaN(newValue)) {
      setValue(Math.max(1, newValue))
    }
  }

  const [hover, setHover] = useState(false);
  const [hover2, setHover2] = useState(false);

  const handleMouseOver = () => {
    setHover(true);
  };

  const handleMouseOut = () => {
    setHover(false);
  };

  const handleMouseOver2 = () => {
    setHover2(true);
  };

  const handleMouseOut2 = () => {
    setHover2(false);
  };

  return (
    <div className="flex items-center gap-2 w-fit">
      <Button onClick={decrement} style={{width:"25px",backgroundColor: hover ? '#dcdcdc' : 'white',minWidth:"30px"}}
      onMouseOver={handleMouseOver}
      onMouseOut={handleMouseOut}>
        <MinusIcon style={{width:"15px",color:"red"}}/>
      </Button>
      <input style={{width:"40px",height:"25px",textAlign: "center"}}
        value={value}
        onChange={handleChange}
      />
      <Button onClick={increment} style={{width:"25px",backgroundColor: hover2 ? '#dcdcdc' : 'white',minWidth:"30px"}} 
      onMouseOver={handleMouseOver2}
      onMouseOut={handleMouseOut2}>
        <PlusIcon style={{color:"darkgreen"}}/>
      </Button>
    </div>
  )
}