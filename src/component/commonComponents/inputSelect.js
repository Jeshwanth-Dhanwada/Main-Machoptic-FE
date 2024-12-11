import { FormControl, InputLabel, MenuItem, Select } from "@mui/material"

const InputSelect = ({labelId, label, className, placeholder, selectedVal, handleSelect, options}) => {
    return(
        <FormControl sx={{ m: 1, minWidth: 60 }}>
          <InputLabel id={labelId}>{label}</InputLabel>
          <Select
            labelId={labelId}
            className={className}
            placeholder={placeholder}
            value={selectedVal}
            label={label}
            displayEmpty
            onChange={handleSelect}
          >
            {options.map(item => <MenuItem key={item} value={item}>{item}</MenuItem>)}
          </Select>
        </FormControl>
    )
}

export default InputSelect