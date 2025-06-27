
import Button from '@mui/material/Button';
import { MinusIcon, PlusIcon } from "lucide-react";
import Input from '@mui/material/Input';
import { useState } from "react"

export default function BotaoMaisMenos({ value, setValue }) {
  const increment = () => setValue(prev => prev + 1);
  const decrement = () => setValue(prev => Math.max(1, prev - 1));
  const handleChange = (e) => {
    const newValue = parseInt(e.target.value);
    if (!isNaN(newValue)) setValue(Math.max(1, newValue));
  };

  const [hover, setHover] = useState(false);
  const [hover2, setHover2] = useState(false);

  return (
    <div style={{ display: "flex", width: "100%" }}>
      <Button
        onClick={decrement}
        style={{ width: "9%", backgroundColor: hover ? '#dcdcdc' : 'white', minWidth: "30px" }}
        onMouseOver={() => setHover(true)}
        onMouseOut={() => setHover(false)}
      >
        <MinusIcon style={{ color: "red" }} />
      </Button>
      <input
        style={{ width: "80%", height: "23px", textAlign: "center" }}
        value={value}
        onChange={handleChange}
      />
      <Button
        onClick={increment}
        style={{ width: "9%", backgroundColor: hover2 ? '#dcdcdc' : 'white', minWidth: "30px" }}
        onMouseOver={() => setHover2(true)}
        onMouseOut={() => setHover2(false)}
      >
        <PlusIcon style={{ color: "darkgreen" }} />
      </Button>
    </div>
  );
}
